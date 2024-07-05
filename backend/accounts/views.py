from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer


from django.shortcuts import render


def home(request):
	return render(request, 'home.html')


class RegisterView(generics.CreateAPIView):
	serializer_class = UserSerializer


class LoginView(ObtainAuthToken):
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data,
									 context={'request': request})
		serializer.is_valid(raise_exception=True)
		return Response(status=status.HTTP_201_CREATED)
