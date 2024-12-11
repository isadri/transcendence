import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Game
from ..accounts.serializers import UserSerializer
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()

TABLE_HEIGHT = 8.65640

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


class GameData:

  def __init__(self, p1, p2, game, channel, name):
    self.game = game
    self.room_name = name
    self.channel = channel
    self.ball = [0, 0.2, 0]
    self.score = {p1.username : 0, p2.username : 0}
    self.players = {p1.username : p1, p2.username : p2}
    self.players_pos = {
      p1.username : [0, 0.09, +(TABLE_HEIGHT - 1)/ 2],
      p2.username : [0, 0.09, -(TABLE_HEIGHT - 1)/ 2]
    }

  async def update(self):
    await channel_layer.group_send(self.room_name, {
      'type': 'ball.update',
      'event': 'BALL_UPDATE',
      'ball': self.getBall()
    })
    self.update_ball()

  def update_player1(self, pos):
    self.player1_pos = pos

  def update_player2(self, pos):
    self.player1_pos = pos

  def update_ball(self):
    self.ball[2] += 0.1

  def getBall(self):
    return self.ball
  def setBall(self, pos):
    self.ball = pos

  def getPlayer(self, username):
    return self.players[username]
  def getPlayerPos(self, username):
    return self.players_pos[username]
  def setPlayerPos(self, username, pos):
    self.players_pos[username] = pos



class RemoteGame(AsyncWebsocketConsumer):

  connected = {}
  async def connect(self):
    self.user = self.scope["user"]
    self.username = self.user.username

    self.game_id = self.scope["url_route"]["kwargs"]['game_id']
    self.room_name = f"game_{self.game_id}"
    self.game = await self.getGame(self.game_id)
    if await self.isPartOfTheGame(self.game):
      if self.game_id not in self.connected:
        self.connected[self.game_id] = {self.username: self}
      else:
        self.connected[self.game_id][self.username] = self
      await self.accept()
      await self.channel_layer.group_add(self.room_name, self.channel_name)
      if len(self.connected[self.game_id]) == 2:
        await self.channel_layer.group_send(self.room_name, {
          'type': 'game.start',
          'event': 'START'
        })
        asyncio.create_task(self.game_loop())

  @database_sync_to_async
  def isPartOfTheGame(self, game):
    if self.username in [game.player1.username, game.player2.username]:
      return True
    return False

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
      self.game_data.setPlayerPos

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
    game = Game.objects.get(pk=game_id)#need protection
    game.state = 'S'
    self.enemy = game.player2 if self.user != game.player2 else game.player1
    return game


  async def game_start(self, event):
    await self.send(json.dumps({
      "event": "START",
      "enemy": UserSerializer(self.enemy).data
    }))


  async def game_loop(self):
    iterator = iter(iter(self.connected[self.game_id].items()))
    _ , player1 = next(iterator)
    _ , player2 = next(iterator)
    self.game_data = GameData(player1, player2, self.game, self.channel_layer, self.room_name)
    self.connected[self.game_id]['game'] = self.game_data
    print(self.connected)
    while True:
      await asyncio.sleep(1/60)
      await self.game_data.update()


  async def enemy_move(self, event):
    if event['username'] != self.user.username:
      await self.send(json.dumps({
          "event": "MOVE",
          "username": event["username"],
          "direction": event["direction"],
          # "timestamp": event["timestamp"],
      }))

  async def ball_update(self, event):
    # data = json.loads(event)
    await self.send(json.dumps({
      'event': 'BALL_UPDATE',
      'ball': event['ball']
    }))


  def getUsername(self):
    return self.username

  async def player_disconnected(self, event):
    """
    Notify the remaining player that their opponent disconnected.
    """
    await self.send(json.dumps({
        "event": "ABORT",
        "username": event["username"],
    }))
