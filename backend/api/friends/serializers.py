from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import FriendList, FriendRequest
from ..accounts.serializers import UserSerializer


User = get_user_model()

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

class FriendListSerializer(serializers.ModelSerializer):
    # user = FriendSerializer(read_only=True)
    friends = FriendSerializer(many=True, read_only=True)

    class Meta:
        model = FriendList
        fields = ['friends']

class FriendRequestReceiverSerializer(serializers.ModelSerializer):
    """
    A serializer for receivers of the friend requests.
    """
    class Meta:
        model = FriendRequest
        read_only_fields = ['sender','status', 'blocked_by']
        fields = ['sender', 'receiver', 'status', 'timestamp', 'blocked_by']
