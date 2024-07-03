from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, required=True, style={
		'input_type': 'password'
	})

	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'username', 'email', 'password']

	def create(self, validated_data):
		user = User(
			username=validated_data['username'],
			first_name=validated_data['first_name'],
			last_name=validated_data['last_name'],
			email=validated_data['email'],
		)
		user.set_password(validated_data['password'])
		user.save()
		return user
