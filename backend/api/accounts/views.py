import logging
import os
import pyotp
from typing import Optional
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.utils import timezone
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer
from .utils import (
    get_access_token_from_api,
    create_store_tokens_for_user,
    create_user,
    get_user_info,
    state_match,
    send_otp_email,
)


logger = logging.getLogger(__name__)


class HomeView(APIView):
    """
    The home page view.
    """

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Return HTTP_200_OK response if the user is authenticated,
        HTTP_402_UNAUTHORIZED response otherwise.
        """
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    """
    Login a user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        logger.debug(f'format: {type(format)}, {format}')
        return Response({
            'login with 42': 'http://127.0.0.1:8000/api/accounts/login/42auth',
            'login with google': 'http://127.0.0.1:8000/api/accounts/'
                                 'login/google'
        })

    def post(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Read the username and the password from the request and try to
        authenticate the user.

        This function takes the request and tries to authenticate the user
        with the username and password existed in the request, and if the
        information are not valid it returns a response indicating that the
        user does not exist. Otherwise, authenticates the user.

        Args:
            request: A Request object containing the username and password
                supplied by the user.

        Returns:
            A Response object indicating if a user is successfully
            authenticated or the user does not exist.
        """
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            user.seed = pyotp.random_base32()
            user.otp = pyotp.TOTP(user.seed).now()
            user.otp_created_at = timezone.now()
            user.save()
            send_otp_email(user)
            return Response({
                'detail': 'The verification code sent successfully',
            }, status=status.HTTP_200_OK)
        elif not User.objects.filter(username=username).exists():
            logger.debug('User does not exist')
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_404_NOT_FOUND)


class VerifyOTPView(APIView):
    """
    This view verify if the otp provided by the user is valid.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def login_user(self, request: Request, user: User) -> Response:
        """
        Login the user.

        This method logins the user and creates a refresh and tokens for her.
        Store the access token in the Set-Cookie header of the returned
        response.

        Args:
            request: The received request.
            user: The user to be logged in.

        Returns:
            A Response object with the user, and refresh and access tokens.
        """
        login(request, user)
        response = create_store_tokens_for_user(user, status.HTTP_200_OK)
        logger.info(f'{user.username} has logged in successfully')
        return response

    def post(self, request: Request, format: Optional[str] = None) -> Response:
        otp = request.data['key']
        username = request.data['username']
        user = User.objects.get(username=username)
        total_difference = timezone.now() - user.otp_created_at
        if total_difference.total_seconds() > 60 or otp != str(user.otp):
            return Response({'error': 'Key is incorrect'},
                            status=status.HTTP_400_BAD_REQUEST)
        response = self.login_user(request, user)
        return response


class GoogleLoginView(APIView):
    """
    Login with Google.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Directs the user to the authorization server.
        """
        return redirect('https://accounts.google.com/o/oauth2/v2/auth?'
                        f'client_id={os.getenv("GOOGLE_ID")}'
                        f'&redirect_uri={os.getenv("GOOGLE_REDIRECT_URI")}'
                        f'&state={settings.OAUTH2_STATE_PARAMETER}'
                        '&scope=openid profile email&response_type=code'
                        '&display=popup')


class GoogleAuthCodeView(APIView):
    """
    Login a user using google and associate with the user a refresh token
    and access token.

    This class requests an access token by authenticating with Google API, and
    fetches user information (such as username, first name, and last name).
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_access_token(sefl, authorization_code: str) -> str:
        uri = 'https://oauth2.googleapis.com/token'
        payload = {
            'code': authorization_code,
            'client_id': os.getenv('GOOGLE_ID'),
            'client_secret': os.getenv('GOOGLE_SECRET'),
            'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI'),
            'grant_type': 'authorization_code'
        }
        return get_access_token_from_api(uri, payload)

    def create_user(self, user_info: dict[str, str]) -> Response:
        """
        Create a user and returns a response containing the user information
        along with the refresh and access tokens.

        This function use the create_user function from utils.py.
        """
        username = user_info['email'].split('@')[0].replace('.', '_')
        return create_user(username, user_info['email'])

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        if not state_match(request.GET.get('state')):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        authorization_code = request.GET.get('code')
        access_token = self.get_access_token(authorization_code)
        userinfo_endpoint = ('https://openidconnect.googleapis.com/v1/userinfo'
                             '?scope=openid profile email')
        user_info = get_user_info(userinfo_endpoint, access_token)
        user = self.create_user(user_info)
        send_otp_email(user)
        return Response({
            'detail': 'The verification code sent successfully',
        }, status=status.HTTP_200_OK)


class Intra42LoginView(APIView):
    """
    Login with 42.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Directs the user to the authorization server
        """
        return redirect('https://api.intra.42.fr/oauth/authorize?'
                        f'client_id={os.getenv("INTRA_ID")}'
                        f'&redirect_uri={os.getenv("INTRA_REDIRECT_URI")}'
                        f'&state={settings.OAUTH2_STATE_PARAMETER}'
                        '&response_type=code')


class Intra42AuthCodeView(APIView):
    """
    Login a user using 42 and associate with the user a refresh token
    and access token.

    This class requests an access token by authenticating with 42 API, and
    fetches user information (such as username, first name, last name,
    and email).
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_access_token(self, authorization_code: str) -> str:
        """
        get access token using authorization code.

        Returns:
            str: The authorization code obtained from the authorization server.
        """
        uri = 'https://api.intra.42.fr/oauth/token'
        payload = {
            'grant_type': 'authorization_code',
            'client_id': os.getenv('INTRA_ID'),
            'client_secret': os.getenv('INTRA_SECRET'),
            'redirect_uri': os.getenv('INTRA_REDIRECT_URI'),
            'code': authorization_code
        }
        return get_access_token_from_api(uri, payload)

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        if not state_match(request.GET.get('state')):
            return Response({'error': 'states do not match'},
                            status=status.HTTP_400_BAD_REQUEST)
        authorization_code = request.GET.get('code', '')
        access_token = self.get_access_token(authorization_code)
        userinfo_endpoint = 'https://api.intra.42.fr/v2/me'
        user_info, status_code = get_user_info(userinfo_endpoint, access_token)
        if status_code != 200:
            return Response(user_info, status=status.HTTP_400_BAD_REQUEST)
        user = create_user(user_info['login'], user_info['email'])
        send_otp_email(user)
        return Response({
            'detail': 'The verification code sent successfully',
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """
    Create a new user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Create a new user.

        Returns:
            The information of the new user. Returns error message if the data
            provided is not valid.
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Logout a the currently active user.
    """
    permission_classes = [AllowAny]

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Logout the user.
        """
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.AUTH_COOKIE)
        logger.debug(f'{request.user.username} has logged out')
        return response


class UpdateView(generics.UpdateAPIView):
    """
    Update user information.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'username'
