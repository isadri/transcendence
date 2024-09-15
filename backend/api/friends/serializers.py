import logging
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Friends
from .utils import get_object


User = get_user_model()

logger = logging.getLogger(__name__)


class FriendsSerializer(serializers.ModelSerializer):
    """
    A serializer for the friends list.
    """

    class Meta:
        model = Friends
        fields = ['friends']

    def create(self, validated_data: dict[str, str]) -> Friends:
        """
        Add a new friend.

        Raises:
            serializers.ValidationError: If the friend does not exist or
                already exists.
        """
        logger.debug(validated_data)
        #new_friend = User.objects.get(username=validated_data['username'])
        current_user = get_object(self.context['current_user'])
        for friend in validated_data['friends']:
            if friend in current_user.friends.all():
                raise serializers.ValidationError('Friend already exists.')
            current_user.friends.add(friend)
        return current_user
