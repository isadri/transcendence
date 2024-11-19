from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import FriendList, FriendRequest
# from .models import FriendList, FriendRequest
# from .utils import get_object
from ..accounts.serializers import UserSerializer


User = get_user_model()


# class FriendSerializer(serializers.ModelSerializer):
#     """
#     A serializer for the friends list.
#     """

#     class Meta:
#         model = FriendList
#         fields = ['friends']

#     def create(self, validated_data: dict[str, str]) -> FriendList:
#         """
#         Add a new friend.

#         Raises:
#             serializers.ValidationError: If the friend does not exist or
#                 already exists.
#         """
#         #new_friend = User.objects.get(username=validated_data['username'])
#         current_user = get_object(self.context['current_user'])
#         for friend in validated_data['friends']:
#             if friend in current_user.friends.all():
#                 raise serializers.ValidationError('Friend already exists.')
#             current_user.friends.add(friend)
#         return current_user


# class FriendRequestSenderSerializer(serializers.ModelSerializer):
#     """
#     A serializer for senders of the friend requests.
#     """

#     class Meta:
#         model = FriendRequest
#         fields = ['sender']

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class FriendListSerializer(serializers.ModelSerializer):
    user = FriendSerializer(read_only=True)
    friends = FriendSerializer(many=True, read_only=True)

    class Meta:
        model = FriendList
        fields = ['user', 'friends']

class FriendRequestReceiverSerializer(serializers.ModelSerializer):
    """
    A serializer for receivers of the friend requests.
    """
    class Meta:
        model = FriendRequest
        read_only_fields = ['sender','status', 'blocked_by']
        fields = ['sender', 'receiver', 'status', 'timestamp', 'blocked_by']


# class FriendRequestAcceptSerializer(serializers.ModelSerializer):
#     """
#     Serializer for accepting friend requests.
#     """

#     class Meta:
#         model = FriendRequest
#         fields = ['status']  # No fields required for this operation
