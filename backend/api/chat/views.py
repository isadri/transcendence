from django.contrib.auth import models
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from api.accounts.models import User
from rest_framework.exceptions import PermissionDenied

from api.friends.models import FriendList

class ChatView(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve only the chats that involve the authenticated user
        user = self.request.user
        return Chat.objects.filter(user1=user) | Chat.objects.filter(user2=user)

    def create(self, request, *args, **kwargs):
        user1 = request.user # the user current signed user
        user2_id = request.data.get("user2") # the other user

        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            friend_list1 = FriendList.objects.get(user=user1)
        except FriendList.DoesNotExist:
            return Response({'error': 'Friend list not found.'},
            status=status.HTTP_400_BAD_REQUEST)

        if friend_list1.objects.filter(id=user2.id).exists():
            return Response({'error': 'You cannot create chat with a user who is not your friend.'},
            status=status.HTTP_400_BAD_REQUEST)

        # Ensure the chat doesn't already exist
        chat, created = Chat.objects.get_or_create(user1=user1, user2=user2)

        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class MessageView(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve messages only for chats the user is part of
        user = self.request.user
        return Message.objects.filter(chat__user1=user) | Message.objects.filter(chat__user2=user)

    def create(self, request, *args, **kwargs):
        chat_id = self.request.data.get("chat")
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)

        if chat.user1 != self.request.user and chat.user2 != self.request.user:
            raise PermissionDenied("You are not a participant in this chat.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(sender=request.user, chat=chat)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

