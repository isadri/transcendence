from django.urls import path
from .consumers import RandomGame

websocket_urlpatterns = [
  path("ws/game/random/", RandomGame.as_asgi())
]