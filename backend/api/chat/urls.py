from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatView, MessageView,  ChatConversationView

router = DefaultRouter()
router.register(r'chats', ChatView, basename='chat')
router.register(r'messages', MessageView, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('chatuser/<int:chat_id>/', ChatConversationView.as_view(), name='user-chat'),
    # path('chatslist/', ChatListView.as_view(), name='chat-list'),
]
