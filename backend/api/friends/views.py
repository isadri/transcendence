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
from .models import Friends
from .serializers import FriendsSerializer
from .utils import get_object


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
        friend_list = get_object(request.user)
        try:
            friend_list.add(new_friend)
        except friends.AlreadyExistsError:
            return Response({'error': 'This friend already exists.'})
        friends_list = [item.username for item in friend_list.friends.all()]
        return Response({'friends': friends_list}, status=status.HTTP_200_OK)
