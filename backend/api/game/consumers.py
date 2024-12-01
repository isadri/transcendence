from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Game


class GameStart(AsyncWebsocketConsumer):

  qeuee = {}
  async def connect(self):
    self.user = self.scope["user"]
    self.qeuee[self.user.username] = self.user
    if len(self.qeuee) >= 2:
      iterator = iter(iter(self.qeuee.items()))
      key1 , player1 = next(iterator)
      key2 , player2 = next(iterator)
      print(player1 , "vs", player2)
      gameMatch = await self.create_game(player1, player2)
      print(gameMatch)
      del self.qeuee[key1]
      del self.qeuee[key2]
      print(self.qeuee)
    await self.accept()


  async def disconnect(self, code):
    print(code)


  @database_sync_to_async
  def create_game(self, player1, player2):
    return Game.objects.create(player1=player1, player2=player2)