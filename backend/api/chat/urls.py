# from django.db import router
# from django.urls import path, include
# # from rest_framework.urlpatterns import format_suffix_patterns
# from .views import InboxList, ChatList
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'inbox', InboxList, basename='inbox')
# router.register(r'chat', ChatList, basename='chat')

# urlpatterns = [
#     path('', include(router.urls)),
#     # path('inbox/', InboxList.as_view(), name='inbox-list'),
#     # path('inbox/<int:pk>', InboxDetail.as_view(), name='inbox-detail'),
#     # path('chat/', ChatList.as_view()),
#     # path('chat/<int:pk>', ChatDetail.as_view()),
# ]

# # urlpatterns = format_suffix_patterns(urlpatterns)


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
]
