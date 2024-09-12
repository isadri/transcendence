import logging
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'username', 'email', 'password',
            ]

    def validate_first_name(self, value: str) -> str:
        """
        Validate the first name field.

        Args:
            value: The value of the first name field.

        Raises:
            serializers.ValidationError: If the first name field is not valid.

        Returns:
            The validated first name.
        """
        if not value.isalpha():
            raise serializers.ValidationError("Invalid first name")
        return value

    def validate_last_name(self, value: str) -> str:
        """
        Validate the last name field.

        Args:
            value: The value of the last name field.

        Raises:
            serializers.ValidationError: If the last name field is not valid.

        Returns:
            The validated last name.
        """
        if not value.isalpha():
            raise serializers.ValidationError("Invalid last name")
        return value

    def create(self, validated_data: dict[str, str]) -> User:
        """
        Create a new instance.

        Raises:
            serializers.ValidationError: If the password is not valid.

        Returns:
            New User instance.
        """
        logger.debug(validated_data)
        user = User(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        try:
            validate_password(password=validated_data['password'], user=user)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        user.save()
        return user


class AvatarUploadSerializer(serializers.Serializer):

    avatar = serializers.ImageField()

    def create(self, validated_data: dict[str, str]) -> User:
        user = User.objects.get(username=self.context['user'].username)
        user.avatar = validated_data['avatar']
        user.save()
        return user

    def update(self, validated_data: dict[str, str]) -> User:
        user = User.objects.get(username=self.context.user.username)
        user.avatar = validated_data.get('avatar', user.avatar)
        user.save()
        return user
