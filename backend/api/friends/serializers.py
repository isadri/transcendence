from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db.models import Q

from ..game.models import UserStats
from ..game.serializers import UserStatsSerializer
from ..accounts.serializers import UserSerializer
from .models import FriendList, FriendRequest


User = get_user_model()

# class FriendSerializer(serializers.ModelSerializer):
#     is_friend = serializers.BooleanField(read_only=True) # i add this suppose to deleted
#     is_blocked = serializers.SerializerMethodField()
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'avatar', 'is_friend', 'is_blocked']

#     def get_is_blocked(self, obj):
#         request_user = self.context['request'].user
#         return FriendRequest.objects.filter(
#             Q(sender=request_user, receiver=obj, status='blocked') |
#             Q(sender=request_user, receiver=obj, status='blocked')
#         ).exists()

class FriendSerializer(UserSerializer):
    is_blocked = serializers.SerializerMethodField()
    class Meta(UserSerializer.Meta):
        READ_ONLY = {'write_only': True}
        model = User
        fields = UserSerializer.Meta.fields + ['is_blocked']
        extra_kwargs = {
            'password': READ_ONLY,
            'usable_password': READ_ONLY,
            'tmp_email': READ_ONLY,
            'email_verified': READ_ONLY,
            'register_complete': READ_ONLY,
            'from_remote_api': READ_ONLY,
            'open_chat': READ_ONLY,
            'active_chat': READ_ONLY,
        }

    def get_is_blocked(self, obj):
        """
        Checks if the current user has blocked or is blocked by the given user (`obj`).
        """
        request_user = self.context['user']
        if not request_user:
            return False 
        # Check if there is a blocked friend request in either direction
        return FriendRequest.objects.filter(
            Q(sender=request_user, receiver=obj, status='blocked') |
            Q(sender=obj, receiver=request_user, status='blocked')
        ).exists()

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
    sender = FriendSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        read_only_fields = ['sender','status', 'blocked_by']
        fields = ['sender', 'receiver', 'status', 'timestamp', 'blocked_by']

class FriendRequestUnblockSerializer(serializers.ModelSerializer):
    """
    A serializer for receivers of the friend requests.
    """
    sender = FriendSerializer(read_only=True)
    receiver = FriendSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        read_only_fields = ['sender','status', 'blocked_by']
        fields = ['sender', 'receiver', 'status', 'timestamp', 'blocked_by']

class FriendRequestSenderSerializer(serializers.ModelSerializer):
    """
    A serializer for receivers of the friend requests.
    """
    # sender = FriendSerializer(read_only=True)
    receiver = FriendSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        read_only_fields = ['sender','status', 'blocked_by']
        fields = ['sender', 'receiver', 'status', 'timestamp', 'blocked_by']
