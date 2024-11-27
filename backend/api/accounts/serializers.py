import re
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Create new user.

    Raises:
        serializers.ValidationError: If any of user fields are not valid.
    """
    avatar = serializers.ImageField(default='default.jpeg')

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'avatar'
            ]

    def validate_password(self, value: str) -> str:
        """
        Validate the password.
        
        Raises:
            serializers.ValidationError: If the password is not valid.
        """
        if len(value) < 8:
            raise serializers.ValidationError('password too short. '
                                              'At least 8 characters.')
        regexp = re.compile('^([a-z]+|[A-Z]+|[0-9]){8,}')

    def create(self, validated_data: dict[str, str]) -> User:
        """
        Create a new User instance.

        Returns:
            New User instance.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            avatar=validated_data['avatar']
        )
        return user
