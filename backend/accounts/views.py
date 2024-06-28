from rest_framework.response import Response
from rest_framework import generics

from .models import User
from .serializers import UserSerializer


class SignUpView(generics.ListCreateAPIView):
	serializer_class = UserSerializer
	queryset = User.objects.all()
