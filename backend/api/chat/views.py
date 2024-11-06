# from .models import Inbox, Chat
# from .serializers import InboxSerializer, ChatSerializer
# from rest_framework.viewsets import ViewSet
# from rest_framework.response import Response
# from rest_framework import generics
# from rest_framework import status
# from django.http import Http404
# from rest_framework.permissions import IsAuthenticated

# class InboxList(ViewSet):
#     permission_classes = [IsAuthenticated]

#     def list(self, request):
#         inbox = Inbox.objects.all()
#         serializer = InboxSerializer(inbox, many=True)
#         return Response(serializer.data)

#     def create(self, request):
#         serializer = InboxSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # class InboxDetail(generics.RetrieveUpdateDestroyAPIView):
# #     permission_classes = [IsAuthenticated]
# #     queryset = Inbox.objects.all()
# #     serializer_class = InboxSerializer

# class ChatList(ViewSet):
#     permission_classes = [IsAuthenticated]

#     def list(self, request):
#         chat = Chat.objects.all()
#         serializer = ChatSerializer(chat, many=True)
#         return Response(serializer.data)

#     def create(self, request):
#         serializer = ChatSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # class ChatDetail(generics.RetrieveUpdateDestroyAPIView):
# #     permission_classes = [IsAuthenticated]
# #     queryset = Chat.objects.all()
# #     serializer_class = ChatSerializer


from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve only the chats that involve the authenticated user
        user = self.request.user
        return Chat.objects.filter(user1=user) | Chat.objects.filter(user2=user)

    def create(self, request, *args, **kwargs):
        user1 = request.user
        user2_id = request.data.get("user2")
        
        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the chat doesn't already exist
        chat, created = Chat.objects.get_or_create(user1=user1, user2=user2) \
        if user1.id < user2.id else Chat.objects.get_or_create(user1=user2, user2=user1)
        
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
        serializer.save(sender=self.request.user)
