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
from .models import Friend, FriendRequest
from .serializers import FriendSerializer
from .utils import get_object
from ..accounts.serializers import UserSerializer


logger = logging.getLogger(__name__)

User = get_user_model()


class FriendRequestSendView(APIView):
    """
    This view is used to send friend requests.
    """

    def post(self, request: Request) -> Response:
        """
        Send a friend request.
        """
        try:
            receiver_username = request.data.get('username', '')
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist.'},
                            status=status.HTTP_404_NOT_FOUND)
        friend_request, created = (
            FriendRequest.objects.get_or_create(sender=request.user,
                                                receiver=receiver))
        if created:
            return Response({'message': 'the request is sent.'},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'the request is already sent.'},
                            status=status.HTTP_400_BAD_REQUEST)



class FriendRequestAcceptView(APIView):
    """
    This view is used to accept friend requests.

    """

    def add_friends(self, sender: User, receiver: User) -> None:
        """
        Add sender to the list of friends of receiver, and vice versa.
        """
        sender_friend_list = Friend.objects.get(user=sender)
        receiver_friend_list = Friend.objects.get(user=receiver)
        sender_friend_list.add(receiver)
        receiver_friend_list.add(sender)

    def post(self, request: Request) -> Response:
        """
        Accept the friend request.

        Returns:
            HTTP_404_NOT_FOUND response: If there is no friend request to the
                current user.
            HTTP_400_BAD_REQUEST response: If the current user and the sender
                user are already friends.
            HTTP_200_OK response: If the current user accept the friend request
                of the sender user.
        """
        sender_username = request.data.get('sender_username', '')
        sender = User.objects.get(username=sender_username)
        receiver = request.user
        try:
            friend_request = FriendRequest.objects.get(sender=sender,
                                                       receiver=request.user)
            self.add_friends(sender, receiver)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'No such request'},
                            status=status.HTTP_404_NOT_FOUND)
        except friends.AlreadyExistsError:
            return Response({'error': 'This user is already a friend.'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'friend request accepted'},
                        status=status.HTTP_200_OK)


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
