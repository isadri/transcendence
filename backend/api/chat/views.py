from django.contrib.auth import models
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from api.accounts.models import User
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from api.friends.models import FriendList
from django.db.models import Q

class UserChatView(APIView):
    """
    API view to fetch the chat details between the authenticated user and the specified user2.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user2_id: int):
        user1 = request.user  # The authenticated user

        # Validate user2_id
        if user1.id == user2_id:
            return Response({'error': 'You cannot start a chat with yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            return Response({'error': 'The specified user does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the chat between the two users
        chat = Chat.objects.filter(
            (Q(user1=user1) & Q(user2=user2)) | (Q(user1=user2) & Q(user2=user1))
        ).first()

        if not chat:
            return Response({'error': 'No chat found between the two users.'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch all messages in the chat
        messages = Message.objects.filter(chat=chat).order_by('timestamp')

        # Serialize chat and messages
        chat_data = ChatSerializer(chat).data

        return Response({
            'chat': chat_data,
        }, status=status.HTTP_200_OK)

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

        if not friend_list1.friends.filter(id=user2.id).exists():
            return Response({'error': 'You cannot create chat with a user who is not your friend.'},
            status=status.HTTP_400_BAD_REQUEST)

        # Ensure the chat doesn't already exist
        chat, created = Chat.objects.get_or_create(user1=user1, user2=user2)

        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

# class ChatListView(ListAPIView):
#     serializer_class = ChatSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Retrieve only the chats that involve the authenticated user
#         user = self.request.user
#         return Chat.objects.filter(user1=user) | Chat.objects.filter(user2=user)


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

