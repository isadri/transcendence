# from django.contrib.auth import models
# from api.accounts.models import User
# from rest_framework.generics import ListAPIView

from rest_framework.exceptions import PermissionDenied
from .models import Chat, Message
from rest_framework.views import APIView
from .serializers import ChatSerializer, MessageSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.friends.models import FriendList, FriendRequest
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

User = get_user_model()

class ChatConversationView(APIView):
    """
    API view to fetch the chat details and all messages for a specific chat by its ID.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id: int):
        user1 = request.user  # The authenticated user

        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({'error': 'The specified chat does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the authenticated user is part of this chat
        if user1 not in [chat.user1, chat.user2]:
            return Response({'error': 'You are not part of this chat.'}, status=status.HTTP_403_FORBIDDEN)

        # Fetch all messages for the chat
        messages = Message.objects.filter(chat=chat).order_by('timestamp')

        # Serialize chat and messages
        chat_data = ChatSerializer(chat).data
        message_data = MessageSerializer(messages, many=True).data

        return Response({
            'chat': chat_data,
            'messages': message_data
        }, status=status.HTTP_200_OK)
    
    def delete(self, request, chat_id: int):
        user = request.user

        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({'error': 'The specified chat does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if user not in [chat.user1, chat.user2]:
            return Response({'error': 'You are not a part of this chat.'}, status=status.HTTP_403_FORBIDDEN)
        
        chat.delete()
        return Response({'message': 'Chat and messages have been deleted succesfully for that user.'},
                         status=status.HTTP_200_OK)

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
        """
        Retrieve only the chats that involve the authenticated user.
        """
        user = self.request.user
        return Chat.objects.filter(Q(user1=user) | Q(user2=user))

    def create(self, request, *args, **kwargs):
        user1 = request.user
        user2_id = request.data.get("user2")

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

        try:
            # Use filter first to check if the chat exists
            chat = Chat.objects.filter(
                Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
            ).first()

            # If no chat exists, create one
            if not chat:
                chat = Chat.objects.create(
                    user1=user1,
                    user2=user2,
                    last_message=''
                )

            serializer = self.get_serializer(chat)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
           print(f"Error creating chat: {e}")
           return Response({"error": "An error occurred while creating the chat."},
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MessageView(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve messages only for chats the user is part of
        user = self.request.user
        return Message.objects.filter(chat__user1=user) | Message.objects.filter(chat__user2=user)

    def create(self, request, *args, **kwargs):
        chat_id = self.request.data.get("chat")
        receiver_id = request.data.get('receiver')
        # content = request.data.get('content')

        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if chat.user1 != user and chat.user2 != user:
            raise PermissionDenied("You are not a participant in this chat.")

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=status.HTTP_404_NOT_FOUND)

        if receiver == user:
            raise ValidationError("You cannot send a message to yourself.")

        if receiver != chat.user1 and receiver != chat.user2:
            raise ValidationError("The receiver must be a participant in the chat.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save(sender=user, receiver=receiver, chat=chat)

        chat.last_message = message.content
        chat.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

