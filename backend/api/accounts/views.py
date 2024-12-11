import logging
import os
import pyotp
from typing import Optional
from django.conf import settings
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.utils import timezone
from rest_framework import (
    generics,
    status,
    viewsets,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer
from .utils import (
    get_access_token_from_api,
    get_tokens_for_user,
    store_token_in_cookies,
    get_access_token_google,
    get_access_token_42,
    create_user,
    get_user,
    get_user_info,
    send_otp_email,
)


class HomeView(APIView):
    """
    The home page view.
    """

    def get(self, request: Request, format: Optional[str] = None) -> Response:
        """
        Return HTTP_200_OK response if the user is authenticated,
        HTTP_402_UNAUTHORIZED response otherwise.
        """
        serializer =  UserSerializer(request.user)

        if request.user.is_authenticated:
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class LoginViewSet(viewsets.ViewSet):
    """
    A ViewSet for login a user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        """
        Get the username and the password from the request and try to
        authenticate the user.

        This method tries to authenticate the user with the username and the
        password given in request, and if the information are not valid, it
        returns a response indicating that the user with the given information
        does not exist, otherwise, this method authenticates the user and
        login the user.
        """
        username = request.data.get('username').lower()
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            logger.info(f'{username} is logged in',
                        extra={'index_name': 'login', 'user': user })
            login(request, user)
            refresh_token, access_token = get_tokens_for_user(user)
            response = Response({
                'refresh_token': refresh_token,
                'access_token': access_token,
            }, status=status.HTTP_200_OK)
            store_token_in_cookies(response, access_token)
            return response
        if not User.objects.filter(username=username).exists():
            logger.error('Invalid username',
                         extra={'index_name': 'errors', 'username': username})
            return Response({
                'error': 'A user with that username does not exist.'
            }, status=status.HTTP_404_NOT_FOUND)
        logger.error('Invalid password', extra={'index_name': 'errors'})
        return Response({
            'error': 'A user with that password does not exist.'
        }, status=status.HTTP_404_NOT_FOUND)
        


class LoginWith2FAViewSet(viewsets.ViewSet):
    """
    A ViewSet for login a user with 2FA.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
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
        username = request.data['username'].lower()
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            user.seed = pyotp.random_base32()
            user.otp = pyotp.TOTP(user.seed).now()
            user.otp_created_at = timezone.now()
            user.save()
            send_otp_email(user)
            logger.info(f'send email to {username}',
                        extra={'index_name': 'emails', 'user': user})
            return Response({
                'detail': 'The verification code sent successfully',
            }, status=status.HTTP_200_OK)
        logger.error('Invalid credentials', extra={'index_name': 'errors'})
        return Response(status=status.HTTP_404_NOT_FOUND)


class VerifyOTPViewSet(viewsets.ViewSet):
    """
    A ViewSet for verifying if the otp provided by the user is valid.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        otp = request.data['key']
        username = request.data['username'].lower()
        user = User.objects.get(username=username)
        total_difference = timezone.now() - user.otp_created_at
        if total_difference.total_seconds() > 60 or otp != str(user.otp):
            logger.error('Incorrect OTP key', extra={'index_name': 'errors'})
            return Response({'error': 'Key is incorrect'},
                            status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        logger.info(f'{username} is logged in',
                    extra={'extra': 'login','user': user})
        refresh_token, access_token = get_tokens_for_user(user)
        response = Response({
            'refresh_token': refresh_token,
            'access_token': access_token,
        }, status=status.HTTP_200_OK)
        store_token_in_cookies(response, access_token)
        return response


class GoogleLoginViewSet(viewsets.ViewSet):
    """
    Login a user using Google

    This class requests an access token by authenticating with Google API, and
    fetches user information (such as username, first name, and last name).
    If the user does not exist, it creates a new one.
    """
    permission_classes = [AllowAny]

    def get_user(self, user_info: dict[str, str]) -> User:
        """
        Extract a username from the email of the user and get the user.
        """
        username = user_info['email'].split('@')[0].replace('.', '_').lower()
        return get_user(username, user_info['email'])

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        access_token = get_access_token_google(authorization_code)
        userinfo_endpoint = ('https://openidconnect.googleapis.com/v1/userinfo'
                             '?scope=openid profile email')
        user_info, status_code = get_user_info(userinfo_endpoint, access_token)
        if status_code != 200:
            logger.error(user_info, extra={'index_name': 'errors'})
            return Response(user_info, status=status_code)
        user = self.get_user(user_info)
        login(request, user)
        logger.info(f'{username} is logged in through Google',
                    extra={
                        'index_name': 'remote-auth',
                        'remote_server': 'Google',
                        'user': user,
                    })
        refresh_token, access_token = get_tokens_for_user(user)
        response = Response({
            'refresh_token': refresh_token,
            'access_token': access_token,
        }, status=status.HTTP_200_OK)
        store_token_in_cookies(response, access_token)
        return response


class GoogleLoginWith2FAViewSet(viewsets.ViewSet):
    """
    2FA with Google.

    This class requests an access token by authenticating with Google API, and
    fetches user information (such as username, first name, and last name).
    If the user does not exist, it creates a new one.
    """
    permission_classes = [AllowAny]

    def get_access_token(self, authorization_code: str) -> str:
        """
        Get access token from the Google API.

        This method makes a request to Google API to get the access token that
        will be used to get user information. The request contains
        authorization_code which is necessary to authenticate with the API.

        Returns:
            The access token
        """
        token_endpoint = 'https://oauth2.googleapis.com/token'
        payload = {
            'code': authorization_code,
            'client_id': os.getenv('GOOGLE_ID'),
            'client_secret': os.getenv('GOOGLE_SECRET'),
            'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI'),
            'grant_type': 'authorization_code'
        }
        return get_access_token_from_api(token_endpoint, payload)

    def create_user(self, user_info: dict[str, str]) -> Response:
        """
        Create a user and returns a response containing the user information
        along with the refresh and access tokens.

        This function use the create_user function from utils.py.
        """
        username = user_info['email'].split('@')[0].replace('.', '_').lower()
        return create_user(username, user_info['email'])

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        access_token = self.get_access_token(authorization_code)
        userinfo_endpoint = ('https://openidconnect.googleapis.com/v1/userinfo'
                             '?scope=openid profile email')
        user_info, _ = get_user_info(userinfo_endpoint, access_token)
        user = self.create_user(user_info)
        send_otp_email(user)
        logger.info(f'send email to {user_info['username']}',
                    extra={'index_name': 'emails', 'receiver': user})
        return Response({
            'detail': 'The verification code sent successfully',
        }, status=status.HTTP_200_OK)


class IntraLoginViewSet(viewsets.ViewSet):
    """
    Login a user using 42 and associate with the user a refresh token
    and access token.

    This class requests an access token by authenticating with 42 API, and
    fetches user information (such as username, first name, last name,
    and email).
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code')
        access_token = get_access_token_42(authorization_code)
        user_info, status_code = get_user_info('https://api.intra.42.fr/v2/me',
                                               access_token)
        if status_code != 200:
            logger.error(user_info, extra={'index_name': 'errors'})
            return Response(user_info, status=status_code)
        user = get_user(user_info.get('login'), user_info.get('email'))
        login(request, user)
        logger.info(f'{username} is logged in through 42',
                    extra={
                        'index_name': 'remote-auth',
                        'remote_server': '42',
                        'user': user,
                    })
        refresh_token, access_token = get_tokens_for_user(user)
        response = Response({
            'refresh_token': refresh_token,
            'access_token': access_token,
        }, status=status.HTTP_200_OK)
        store_token_in_cookies(response, access_token)
        return response


class IntraLoginWith2FAViewSet(viewsets.ViewSet):
    """
    2FA authentication with 42.

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
        token_endpoint = 'https://api.intra.42.fr/oauth/token'
        payload = {
            'grant_type': 'authorization_code',
            'client_id': os.getenv('INTRA_ID'),
            'client_secret': os.getenv('INTRA_SECRET'),
            'redirect_uri': os.getenv('INTRA_REDIRECT_URI'),
            'code': authorization_code
        }
        return get_access_token_from_api(token_endpoint, payload)

    def list(self, request: Request) -> Response:
        """
        Authenticate with the authorization server and obtain user information.
        """
        authorization_code = request.GET.get('code', '')
        access_token = self.get_access_token(authorization_code)
        userinfo_endpoint = 'https://api.intra.42.fr/v2/me'
        user_info, status_code = get_user_info(userinfo_endpoint, access_token)
        if status_code != 200:
            logger.error(user_info, extra={'index_name': 'errors'})
            return Response(user_info, status=status.HTTP_400_BAD_REQUEST)
        user = create_user(user_info['login'], user_info['email'])
        send_otp_email(user)
        logger.info(f'send email to {user.username}',
                    extra={'index_name': 'emails', 'receiver': user})
        return Response({
            'detail': 'The verification code sent successfully',
        }, status=status.HTTP_200_OK)


class RegisterViewSet(viewsets.ViewSet):
    """
    A ViewSet for creating new user.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request: Request) -> Response:
        data = request.data.copy()
        data['username'] = data['username'].lower()
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"new user: {request.data['username']}",
                        extra={'index_name': 'register', 'user': user,})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(serializer.errors, extra={'index_name': 'errors'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutViewSet(viewsets.ViewSet):
    """
    Logout a the currently active user.
    """
    permission_classes = [AllowAny]

    def list(self, request: Request) -> Response:
        """
        Logout the user.
        """
        logger.info(f'{request.user.username} is logged out',
                    extra={'index_name': 'logout', 'user': request.user,})
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.AUTH_COOKIE)
        return response


class UpdateView(generics.UpdateAPIView):
    """
    Update user information.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = 'username'
