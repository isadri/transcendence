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
    self.room_name = None
    await self.accept()



  async def disconnect(self, code):
    username = self.user.username
    if username in self.qeuee:
      del self.qeuee[username]
    if username in self.connected:
      del self.connected[username]
    if self.room_name:
      await self.channel_layer.group_send(
        self.room_name,
        {
            "type": "player.disconnected",
            "username": self.user.username,
        },
      )


  async def receive(self, text_data):
    data = json.loads(text_data)
    if data["event"] == "READY":
      self.qeuee[self.user.username] = self
      print("qeuee", self.qeuee)
      if len(self.qeuee) >= 2:
        iterator = iter(iter(self.qeuee.items()))
        key1 , player1 = next(iterator)
        key2 , player2 = next(iterator)
        print(player1, player2)
        print(self.qeuee)
        self.gameMatch = await self.create_game(player1.user, player2.user)
        self.room_name = f"room_{self.gameMatch.id}"
        self.setAsConnected(key1, key2)
        await self.handshaking(key1, key2)
        await self.joinRoom(player1)
        await self.joinRoom(player2)
  

  @database_sync_to_async
  def create_game(self, player1, player2):
    '''
      create an instance of the game
    '''
    return Game.objects.create(player1=player1, player2=player2)


  async def joinRoom(self, player):
    try:
      await player.channel_layer.group_add(self.room_name, player.channel_name)
    except Exception as e:
      print("join room> ", e)


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

  async def player_disconnected(self, event):
        """
        Notify the remaining player that their opponent disconnected.
        """
        await self.send(json.dumps({
            "event": "ABORT",
            "username": event["username"],
        }))





class RemoteGame(AsyncWebsocketConsumer):

  connected = {}
  async def connect(self):
    await self.accept()
    self.user = self.scope["user"]
    self.game_id = self.scope["url_route"]["kwargs"]['game_id']
    self.room_name = f"game_{self.game_id}"
    self.game = await self.getGame(self.game_id)
    print("enemy=>", self.enemy)
    await self.channel_layer.group_add(self.room_name, self.channel_name)
    await self.send(json.dumps({
      "event": "START",
      "enemy": UserSerializer(self.enemy).data
    }))


  async def receive(self, text_data):
    data = json.loads(text_data)
    if  data["event"] == 'MOVE':
      await self.channel_layer.group_send(
        self.room_name,
        {
            "type": "enemy.move",
            "username": data["username"],
            "direction": data["direction"],
        },
      )



  async def disconnect(self, code):
   await self.channel_layer.group_send(
     self.room_name,
     {
         "type": "player.disconnected",
         "username": self.user.username,
     },
   )


  @database_sync_to_async
  def getGame(self, game_id):
    game = Game.objects.get(pk=game_id)#protection
    game.state = 'S'
    self.enemy = game.player2 if self.user != game.player2 else game.player1
    return game


  async def enemy_move(self, event):
    if event['username'] != self.user.username:
      await self.send(json.dumps({
          "event": "MOVE",
          "username": event["username"],
          "direction": event["direction"],
          # "timestamp": event["timestamp"],
      }))

  async def player_disconnected(self, event):
    """
    Notify the remaining player that their opponent disconnected.
    """
    await self.send(json.dumps({
        "event": "ABORT",
        "username": event["username"],
    }))
