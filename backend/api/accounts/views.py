import logging, os, requests
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import APIException
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from oauth2_provider.contrib.rest_framework import (
    OAuth2Authentication,
    TokenHasScope
)

from .models import User
from .serializers import UserSerializer
from .utils import (
    get_tokens_for_user,
    store_token_in_cookies,
    get_access_token_from_api,
    create_store_tokens_for_user
)


logger = logging.getLogger(__name__)


class HomeView(APIView):
    """
    The home page view.
    """
    permission_classes = []

    def get(self, request: Request) -> Response:
        """
        Return HTTP_200_OK response if a user is authenticated,
        HTTP_402_UNAUTHORIZED response otherwise.
        """
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        return Response(status.HTTP_401_UNAUTHORIZED)


def create_user(user_info: dict[str, str]) -> Response:
    """
    Create a user if does not exist.

    This funtion checks if a user exists, otherwise it creates a new one,
    creates a refresh and access tokens for the user and stores the access 
    token through Set-Cookie header in the response.

    Args:
        user_info: Dict containing user information for creating or getting a 
                user.

    Returns:
        A Response object with the user, and refresh and access tokens.
    """
    try:
        user = User.objects.get(username=user_info['login'])
        status_code = status.HTTP_200_OK
    except User.DoesNotExist:
        user = User.objects.create(
            username=user_info['login'],
            first_name=user_info['first_name'],
            last_name=user_info['last_name'],
            email=user_info['email'],
        )
        status_code = status.HTTP_201_CREATED
    response = create_store_tokens_for_user(user, status_code)
    return response


class LoginView(APIView):
    """
    Login a user.
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

    def post(self, request: Request) -> Response:
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
            response = self.login_user(request, user)
            return response
        elif not User.objects.filter(username=username).exists():
            logger.debug('User does not exist')
            return Response(status=status.HTTP_404_NOT_FOUND)
        logger.debug(f'Invalid password ({username}, {password})')
        return Response(status=status.HTTP_404_NOT_FOUND)


class LoginWith42(APIView):
    """
    Login a 42 student.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request) -> Response:
        logger.debug('User tries to login with 42')
        return redirect('https://api.intra.42.fr/oauth/authorize?'
                        f'client_id={os.getenv("ID", "")}'
                        f'&redirect_uri={os.getenv("REDIRECT_URI", "")}'
                        f'&state={settings.OAUTH2_STATE_PARAMETER}'
                        '&response_type=code')


class AuthorizationCodeView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def store_token_in_cookies(self, response: Response,
                               access_token: str) -> None:
        response.set_cookie(
            'access_token',
            value=access_token,
            httponly=True,
            samesite='Lax'
        )

    def get_42_user_info(self, token: str) -> dict[str, str]:
        uri = 'https://api.intra.42.fr/v2/me'
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(uri, headers=headers)
        if response.status_code == 400:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return response.json()

    def get_42_access_token(self, authorization_code: str) -> str:
        uri = 'https://api.intra.42.fr/oauth/token'
        payload = {
            'grant_type': 'authorization_code',
            'client_id': os.getenv('ID', ''),
            'client_secret': os.getenv('SECRET', ''),
            'redirect_uri': os.getenv('REDIRECT_URI', ''),
            'state': settings.OAUTH2_STATE_PARAMETER,
            'code': authorization_code
        }
        return get_access_token_from_api(uri, payload)

    def get(self, request: Request) -> Response:
        authorization_code = request.GET.get('code', '')
        access_token = self.get_42_access_token(authorization_code)
        user_info = self.get_42_user_info(access_token)
        response = create_user(user_info)
        return response


class RegisterView(generics.CreateAPIView):
    """
    Create a new user.
    """
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class LogoutView(APIView):
    """
    Logout a the currently active user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request) -> Response:
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.AUTH_COOKIE)
        logger.debug(f'{request.user.username} has logged out')
        return response
