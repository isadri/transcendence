from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Create new user.

    Raises:
        serializers.ValidationError: If any of user fields are not valid.
    """
    avatar = serializers.ImageField(default='default.jpg')

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'username', 'email', 'password',
            'avatar'
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

        Returns:
            New User instance.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            avatar=validated_data['avatar']
        )
        return user
