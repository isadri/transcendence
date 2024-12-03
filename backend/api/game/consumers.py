import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Game
from ..accounts.serializers import UserSerializer


class RandomGame(AsyncWebsocketConsumer):

  qeuee = {}
  connected = {}
  async def connect(self):
    self.user = self.scope["user"]
    await self.accept()
    # join first two player into a new game



  async def disconnect(self, code):
    username = self.user.username
    if username in self.qeuee:
      del self.qeuee[username]
    if username in self.connected:
      del self.connected[username]
    print(code)


  async def receive(self, text_data):
    data = json.loads(text_data)
    if data["event"] == "READY":
      self.qeuee[self.user.username] = self
      if len(self.qeuee) >= 2:
        print("Eeeeeee")
        iterator = iter(iter(self.qeuee.items()))
        key1 , player1 = next(iterator)
        key2 , player2 = next(iterator)
        self.gameMatch = await self.create_game(player1.user, player2.user)
        print(self.gameMatch)
        self.setAsConnected(key1, key2)
        await self.handshaking(key1, key2)

  @database_sync_to_async
  def create_game(self, player1, player2):
    '''
      create an instance of the game
    '''
    return Game.objects.create(player1=player1, player2=player2)


  async def handshake(self, key1, key2):
    '''
      notify the client with the game and sent enemy's data
    '''
    try:
      await self.connected[key1].send(json.dumps({
        "event" : "HANDSHAKING",
        "game_id": self.gameMatch.id,
        "enemy": UserSerializer(self.connected[key2].user).data
      }))
      print(f"handshake sent to {key1}")
    except Exception as e:
      print(f"handshake of {key1}:> ", e)


  async def handshaking(self, key1, key2):
    """
      notify the players that a game inisialied
    """
    await self.handshake(key1, key2)
    await self.handshake(key2, key1)

  def setAsConnected(self, key1, key2):
    # delet them from the qeuee and set them as connected
    self.connected[key1] = self.qeuee[key1]
    del self.qeuee[key1]
    self.connected[key2] = self.qeuee[key2]
    del self.qeuee[key2]
    print("qeuee", self.qeuee)
    print("connected", self.connected)