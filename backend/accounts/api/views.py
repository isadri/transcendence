from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.views import APIView

from .serializers import UserSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }


class LoginView(APIView):

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            response = Response({'message': 'Logged Successfully'})
            response.set_cookie(
                'access',
                value=get_tokens_for_user(user)['access'],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                httponly=settings.SESSION_COOKIE_HTTPONLY
            )
            login(request, user)
            return response
        return Response({'error': 'Invalid credentials'})


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer


class MyTokenObtainTokenPairview(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        access_token = response.data['access']
        response.set_cookie('access', access_token)
        return response


def logout_user(request):
    logout(request)
    return Response({'message': "klghsklgh"})
