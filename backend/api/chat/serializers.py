from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'receiver', 'content', 'timestamp']
        read_only_fields = ['sender'] 

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    user2 = serializers.SerializerMethodField()
    user1 = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2', 'created_at', 'last_message', 'messages','nbr_of_unseen_msg_user1', 'nbr_of_unseen_msg_user2']
        read_only_fields = ['user1', 'last_message'] 


    def get_user1(self, obj):
        serializer = UserSerializer(obj.user1, context={})
        return serializer.data

    def get_user2(self, obj):
        serializer = UserSerializer(obj.user2, context={})
        return serializer.data