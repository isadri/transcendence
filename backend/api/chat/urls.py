from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatView, MessageView,  UserChatView

router = DefaultRouter()
router.register(r'chats', ChatView, basename='chat')
router.register(r'messages', MessageView, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/<int:user2_id>/', UserChatView.as_view(), name='user-chat'),
    # path('chatslist/', ChatListView.as_view(), name='chat-list'),
]
