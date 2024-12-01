from django.urls import path
from .consumers import GameStart

websocket_urlpatterns = [
  path("ws/game/start/", GameStart.as_asgi())
]