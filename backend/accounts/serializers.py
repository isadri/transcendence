from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, required=True, style={
		'input_type': 'password'
	})

	class Meta:
		model = User
		fields = [
				'first_name', 'last_name', 'username', 'email', 'password'
			]
