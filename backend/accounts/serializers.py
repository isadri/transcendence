from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, required=True, style={
		'input_type': 'password'
	})
	password_confirmation = serializers.CharField(write_only=True, required=True, style={
		'input_type': 'password'
	})

	class Meta:
		model = models.User
		fields = [
				'username', 'email', 'first_name', 'last_name', 'password',
				'password_confirmation'
			]
