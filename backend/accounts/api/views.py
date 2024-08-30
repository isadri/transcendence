from django.contrib.auth import logout
from rest_framework import generics
from rest_framework.response import Response

from .serializers import UserSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer


def logout_user(request):
    logout(request)
    return Response({'message': "klghsklgh"})
