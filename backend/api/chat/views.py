from django.contrib.auth import models
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from api.accounts.models import User
from api.accounts.utils import get_current_user_id

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve only the chats that involve the authenticated user
        user = self.request.user
        return Chat.objects.filter(user1=user) | Chat.objects.filter(user2=user)

    def create(self, request, *args, **kwargs):
        user1 = request.user

        try:
            user2 = User.objects.get(pk=get_current_user_id(request))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the chat doesn't already exist
        # chat, created = Chat.objects.get_or_create(
        #     user1=user1, user2=user2) if user1.id < user2.id else Chat.objects.get_or_create(user1=user2, user2=user1)
        chat, created = Chat.objects.get_or_create(
            user1=user1 if user1.id < user2.id else user2,
            user2=user2 if user1.id < user2.id else user1
        )


        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve messages only for chats the user is part of
        user = self.request.user
        return Message.objects.filter(chat__user1=user) | Message.objects.filter(chat__user2=user)

    def perform_create(self, serializer):
        chat_id = self.request.data.get("chat")
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer.save(sender=self.request.user, chat=chat)

