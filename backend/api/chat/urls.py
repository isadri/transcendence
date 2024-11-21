from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatView, MessageView

router = DefaultRouter()
router.register(r'chats', ChatView, basename='chat')
router.register(r'messages', MessageView, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]
