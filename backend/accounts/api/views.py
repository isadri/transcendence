from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.middleware import csrf
from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView

from .serializers import UserSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        settings.ACCESS_TOKEN: str(refresh.access_token)
    }


class LoginView(APIView):

    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            response = Response({'message': 'Logged Successfully'})
            response.set_cookie(
                settings.ACCESS_TOKEN,
                value=get_tokens_for_user(user)[settings.ACCESS_TOKEN],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                httponly=settings.SESSION_COOKIE_HTTPONLY,
                samesite=settings.SESSION_COOKIE_SAMESITE
            )
            csrf.get_token(request)
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


class LogoutView(APIView):

    def get(self, request):
        logout(request)
        response = Response({'message': 'Logged out'})
        response.delete_cookie(settings.ACCESS_TOKEN)
        return response
