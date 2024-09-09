import logging, os, requests
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.urls import reverse
#from django.middleware import csrf
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from oauth2_provider.contrib.rest_framework import (
    OAuth2Authentication,
    TokenHasScope
)

from .models import User
from .serializers import UserSerializer


logger = logging.getLogger(__name__)


class HomeView(APIView):
    permission_classes = []

    def get(self, request):
        if request.user.is_authenticated:
            return Response({'message': 'User is authenticated'})
        token = request.COOKIES.get(settings.ACCESS_TOKEN)
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get('https://api.intra.42.fr/v2/me',
                                headers=headers)
        if response.status_code == 400:
            return Response({'error': 'User is not authenticated'})
        logger.info(response.json().get('login', ''))
        return Response({'login': response.json().get('login', '')})


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        settings.ACCESS_TOKEN: str(refresh.access_token)
    }


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def store_access_token_in_cookie(self, response, user):
        response.set_cookie(
            settings.ACCESS_TOKEN,
            value=get_tokens_for_user(user)[settings.ACCESS_TOKEN],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            httponly=settings.SESSION_COOKIE_HTTPONLY,
            samesite=settings.SESSION_COOKIE_SAMESITE
        )

    def login_user(self, request, user):
        login(request, user)
        response = Response(status=status.HTTP_200_OK)
        self.store_access_token_in_cookie(response, user)
        logger.info(f'{user.username} has logged in successfully')
        return response

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            response = self.login_user(request, user)
            return response
        elif not User.objects.filter(username=username).exists():
            logger.debug('User does not exist')
            return Response({'error': 'Username does not exist'},
                            status=status.HTTP_404_NOT_FOUND)
        logger.debug(f'Invalid password ({username}, {password})')
        return Response({'error': 'Invalid password'},
                        status=status.HTTP_404_NOT_FOUND)


class LoginWith42(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        logger.debug('User tries to login with 42')
        return redirect('https://api.intra.42.fr/oauth/authorize?'
                        f'client_id={os.getenv("ID", "")}'
                        f'&redirect_uri={os.getenv("REDIRECT_URI", "")}'
                        f'&state={settings.OAUTH2_STATE_PARAMETER}'
                        '&response_type=code')


class AuthorizationCodeView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def store_token_in_cookies(self, response, access_token):
        response.set_cookie(
            'access_token',
            value=access_token,
            httponly=True,
            samesite='Lax'
        )

    def get(self, request):
        authorization_code = request.GET.get('code', '')
        parameters = {
            'grant_type': 'authorization_code',
            'client_id': os.getenv('ID', ''),
            'client_secret': os.getenv('SECRET', ''),
            'redirect_uri': os.getenv('REDIRECT_URI', ''),
            'state': settings.OAUTH2_STATE_PARAMETER,
            'code': authorization_code,
        }
        resp = requests.post('https://api.intra.42.fr/oauth/token/',
                            params=parameters)
        access_token = resp.json().get('access_token', '')
        if access_token == '':
            return Response({'error': 'access_token not found'},
                           status=status.HTTP_400_BAD_REQUEST)
        response = redirect('http://127.0.0.1:8000/')
        logger.debug('user has authenticated with 42')
        self.store_token_in_cookies(response, access_token)
        logger.debug('client stored access token in cookies')
        return response


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class MyTokenObtainTokenPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.ACCESS_TOKEN)
        return response
