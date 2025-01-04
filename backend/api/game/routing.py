from django.urls import path
from .consumers import RandomGame, RemoteGame, RandomTournament, RemoteTournament

websocket_urlpatterns = [
  path("ws/game/random/", RandomGame.as_asgi()),
  path("ws/game/remote/<int:game_id>", RemoteGame.as_asgi()),
  path("ws/game/tournament/random", RandomTournament.as_asgi()),
  path("ws/game/tournament/<int:id>", RemoteTournament.as_asgi()),
]