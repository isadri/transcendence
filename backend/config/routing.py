from api.chat.routing import websocket_urlpatterns as chat_ws_urls
from api.game.routing import websocket_urlpatterns as game_ws_urls
from api.notifications.routing import websocket_urlpatterns as notifications_ws_urls

websocket_urlpatterns = [
  *chat_ws_urls,
  *game_ws_urls,
  *notifications_ws_urls,
]
