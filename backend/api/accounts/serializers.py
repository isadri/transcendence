import string
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

    def validate_username(self, value: str) -> str:
        """
        Validate the username.
        
        Raises:
            serializers.ValidationError: If the username is not valid.
        """
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('A user with this username '
                                             'already exists.')
        if not value[0] in string.ascii_lowercase and value[0] != '_':
            raise serializers.ValidationError('The username must begin with '
                                             ' a lowercase character or a _.')
        if len(value) < 3 or len(value) > 15:
            raise serializers.ValidationError('username must at least contain 3'
                                ' and at most 15 characters.')
        allowed_characters = string.ascii_lowercase + string.digits + '_' + '-' + '.'
        if any(c for c in value if c not in allowed_characters):
            raise serializers.ValidationError("The username can only contain "
                                "lowercase characters, digits, '.', '_', or '-'.")
        return value

    def validate_password(self, value: str) -> str:
        """
        Validate the password.
        
        Raises:
            serializers.ValidationError: If the password is not valid.
        """
        if len(value) < 8:
            raise serializers.ValidationError('password too short. '
                                              'At least 8 characters.')
        upper_case = 0
        lower_case = 0
        digits = 0
        specials = 0
        for c in value:
            if c.isupper():
                upper_case += 1
            if c.islower():
                lower_case += 1
            if c.isdigit():
                digits += 1
            if c in string.punctuation:
                specials += 1
        if not upper_case or not lower_case or not digits or not specials:
            raise serializers.ValidationError('password must contain at least '
                                              'one lowercase character, '
                                              'one uppercase character, '
                                              'one digit, and one special '
                                              'symbol.')
        return value

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
