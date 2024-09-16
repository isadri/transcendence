import logging
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from . import friends
from .models import Friend
from .serializers import FriendSerializer
from .utils import get_object
from ..accounts.serializers import UserSerializer


logger = logging.getLogger(__name__)

User = get_user_model()


class FriendAddView(APIView):
    """
    This view is used to add a new friend.
    """

    def post(self, request: Request) -> Response:
        """
        Add a new friend.
        """
        try:
            username = request.data.get('username', '')
            new_friend = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'No such user.'},
                            status=status.HTTP_404_NOT_FOUND)
        friend_list = Friend.objects.get(user=request.user)
        try:
            friend_list.add(new_friend)
        except friends.AlreadyExistsError:
            return Response({'error': 'This friend already exists.'},
                            status=status.HTTP_400_BAD_REQUEST)
        friends_list = [item.username for item in friend_list.friends.all()]
        return Response({'friends': friends_list}, status=status.HTTP_200_OK)


class FriendListView(APIView):
    """
    This view list all friends of the current user.
    """

    def get(self, request: Request) -> Response:
        """
        List all the friends of the current user.
        """
        user = Friend.objects.get(user=request.user)
        queryset = user.friends.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
