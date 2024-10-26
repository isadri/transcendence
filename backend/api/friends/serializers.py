from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Friend
from .models import FriendRequest
from .utils import get_object
from ..accounts.serializers import UserSerializer


User = get_user_model()


class FriendSerializer(serializers.ModelSerializer):
    """
    A serializer for the friends list.
    """

    class Meta:
        model = Friend
        fields = ['friends']

    def create(self, validated_data: dict[str, str]) -> Friend:
        """
        Add a new friend.

        Raises:
            serializers.ValidationError: If the friend does not exist or
                already exists.
        """
        #new_friend = User.objects.get(username=validated_data['username'])
        current_user = get_object(self.context['current_user'])
        for friend in validated_data['friends']:
            if friend in current_user.friends.all():
                raise serializers.ValidationError('Friend already exists.')
            current_user.friends.add(friend)
        return current_user


class FriendRequestSenderSerializer(serializers.ModelSerializer):
    """
    A serializer for senders of the friend requests.
    """

    class Meta:
        model = FriendRequest
        fields = ['sender']


class FriendRequestReceiverSerializer(serializers.ModelSerializer):
    """
    A serializer for receivers of the friend requests.
    """

    class Meta:
        model = FriendRequest
        fields = ['receiver']
