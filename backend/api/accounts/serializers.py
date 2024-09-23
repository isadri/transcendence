from django.db import models
from rest_framework import serializers
import io
import qrcode
import pyotp

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
            'username', 'email', 'password', 'avatar'
            ]

    def create(self, validated_data: dict[str, str]) -> User:
        """
        Create a new User instance.

        Returns:
            New User instance.
        """
        seed = pyotp.random_base32()
        provisioning_uri = pyotp.totp.TOTP(seed).provisioning_uri(
            name=validated_data['email'], issuer_name='Ping Pong'
        )
        stream = io.BytesIO()
        image = qrcode.make(provisioning_uri)
        image.save(stream)
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            avatar=validated_data['avatar']
        )
        #user.qr_code = models.Image
        return user
