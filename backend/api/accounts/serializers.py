import logging
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User


logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    """
    Create new user.

    Raises:
        serializers.ValidationError: If any of user fields are not valid.
    """

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'username', 'email', 'password',
            'avatar'
            ]

    def not_lower_case_ascii_alphabet(self, c: str) -> bool:
        """
        Check if c is a valid character. A valid character must contain only
        lower case ascii alphabet.

        Returns:
            True if c is valid, otherwise, False.
        """
        return not c.islower() or not c.isascii()

    def validate_username(self, value: str) -> str:
        """
        Validate the username field.

        Args:
            value: The value of the username field.

        Raises:
            serializers.ValidationError: If the username field is not valid.

        Returns:
            The validated username.
        """
        if (not value[0].isalpha() or
            self.not_lower_case_ascii_alphabet(value[0])):
            raise serializers.ValidationError(
                'username must begin with a lower case alphabet character.')
        for c in value[1:]:
            if ((not c.isalnum() and c != '_') or
                self.not_lower_case_ascii_alphabet(c)):
                raise serializers.ValidationError('username must contain only '
                                                  'lower case alphanumeric '
                                                  'characters or _.')
        return value

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
