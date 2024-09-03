import logging
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
#from django.middleware import csrf
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .authenticate import TokenAuthentication
from .models import User
from .serializers import UserSerializer


logger = logging.getLogger(__name__)


class HomeView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({'message': 'User is authenticated'})
        return Response({'error': 'User is not authenticated'})


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        settings.SIMPLE_JWT['AUTH_COOKIE']: str(refresh.access_token)
    }


class LoginView(APIView):
    permission_classes = [AllowAny]

    def store_access_token_in_cookie(self, response, user):
        response.set_cookie(
            settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=get_tokens_for_user(user)[settings.SIMPLE_JWT['AUTH_COOKIE']],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            httponly=settings.SESSION_COOKIE_HTTPONLY,
            samesite=settings.SESSION_COOKIE_SAMESITE
        )

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            response = Response({'message': 'Logged Successfully'})
            self.store_access_token_in_cookie(response, user)
            #csrf.get_token(request)
            logger.info(f'{user.username} has logged in')
            return response
        elif not User.objects.filter(username=username).exists():
            logger.info('User does not exist')
            return Response({'error': 'Username does not exist'},
                            status=status.HTTP_404_NOT_FOUND)
        logger.info('Invalid password')
        return Response({'error': 'Invalid password'},
                        status=status.HTTP_404_NOT_FOUND)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class MyTokenObtainTokenPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        #access_token = response.data['access']
        #response.set_cookie('access_token', access_token)
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        return response
