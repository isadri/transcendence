from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import User
from .serializers import UserSerializer


from django.shortcuts import render


class HomeView(APIView):
	authenticate_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def get(self, request):
		content = {'message': 'Hello, World!'}
		return Response(content)


class RegisterView(generics.CreateAPIView):
	serializer_class = UserSerializer


class LoginView(ObtainAuthToken):
	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data,
									 context={'request': request})
		serializer.is_valid(raise_exception=True)
		return Response(status=status.HTTP_201_CREATED)
