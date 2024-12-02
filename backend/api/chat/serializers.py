from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

class MessageSerializer(serializers.ModelSerializer):
    # sender = UserSerializer()
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'receiver', 'content', 'timestamp', 'file', 'image']
        read_only_fields = ['sender'] 

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    user2 = UserSerializer() ######### add this after end of chat modification #########
    user1 = UserSerializer() ######### add this after end of chat modification #########

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2', 'created_at', 'last_message', 'messages']
        read_only_fields = ['user1', 'last_message'] 
