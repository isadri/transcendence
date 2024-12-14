import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Game
from ..accounts.serializers import UserSerializer
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()

TABLE_Z = 8.65640
PADDLE_Z = 0.5
PADDLE_X = 1.5
BALL_R = 0.12
SIDE_Z = (8.65640+ 0.5)/2
GAME_SPEED = 1/60
PADDLE_SPEED = 0.1


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
    self.done = False
    self.direction = 1
    self.player1 = p1.username
    self.player2 = p2.username
    self.winneer = None
    self.score = {p1.username : 0, p2.username : 0}
    self.players = {p1.username : p1, p2.username : p2}
    self.players_pos = {
      self.player1 : [0, 0.09, (TABLE_Z - 1)/ 2],
      self.player2 : [0, 0.09, -(TABLE_Z - 1)/ 2]
    }

  async def update(self):
    await channel_layer.group_send(self.room_name, {
      'type': 'game.update',
      'event': 'GAME_UPDATE',
      'ball': self.getBall(),
      self.player1 : 'player1',
      self.player2 : 'player2',
      'player1_score': self.score[self.player1],
      'player2_score': self.score[self.player2],
      'player1': self.players_pos[self.player1][0],
      'player2': self.players_pos[self.player2][0]
    })
    self.checkWinner()
    self.update_ball()
    self.checkScore()

  def update_player1(self, pos):
    self.player1_pos = pos

  def update_player2(self, pos):
    self.player1_pos = pos

  def update_ball(self):
    self.ball[2] += 0.1 * self.direction
    if self.hitPaddle(self.players_pos[self.player1]) or self.hitPaddle(self.players_pos[self.player2]):
        self.direction *= -1

  def checkScore(self):
    if abs(SIDE_Z - self.ball[2]) <= BALL_R * 2:
      self.score[self.player1] += 1
      self.ball = [0, 0.2, 0]
    if abs(-SIDE_Z - self.ball[2]) <= BALL_R * 2:
      self.score[self.player2] += 1
      self.ball = [0, 0.2, 0]

  def checkWinner(self):
    if self.score[self.player1] == 7 or self.score[self.player2] == 7:
      self.done = True
      return True
    return False

  def getScore(self):
    return self.score

  def hitPaddle(self, pos):
    x = self.ball[0]
    z = self.ball[2]
    if abs(pos[2] - z) <= ((PADDLE_Z/2) + BALL_R) and abs(pos[0] - x) <= PADDLE_X/2:
      return True
    return False

  def getBall(self):
    return self.ball
  def setBall(self, pos):
    self.ball = pos

  def isDone(self):
    return self.done

  def getPlayer(self, username):
    return self.players[username]
  def getPlayerPos(self, username):
    return self.players_pos[username]
  def setPlayerPos(self, username, pos):
    direct = PADDLE_SPEED if pos == '+' else -PADDLE_SPEED
    newpos = self.players_pos[username][0] + direct
    if newpos < (3.07345 - 0.75) and newpos > -(3.07345 - 0.75):
      self.players_pos[username][0] += direct

  def abort_game(self, username=None):
    self.done = True
    if username:
      self.winneer = username

class RemoteGame(AsyncWebsocketConsumer):

  connected = {}
  async def connect(self):
    self.game: Game = None
    self.user = self.scope["user"]
    self.username = self.user.username
    self.game_id = self.scope["url_route"]["kwargs"]['game_id']
    self.room_name = f"game_{self.game_id}"
    self.game_data : GameData = None
    await self.accept()

    try:
      self.game = await self.getGame(self.game_id)
    except ValueError as e:
      await self.abort(e.args[0])
      return

    if not self.game:
      await self.abort("No game found with this ID")
      return
    if await self.isPartOfTheGame(self.game):
      if self.game_id not in self.connected:
        self.connected[self.game_id] = {self.username: self}
      else:
        self.connected[self.game_id][self.username] = self
      await self.channel_layer.group_add(self.room_name, self.channel_name)
      if len(self.connected[self.game_id]) == 2:
        self.task = asyncio.create_task(self.game_loop())
    else:
      await self.abort("You are not allowed to join this game")

  @database_sync_to_async
  def isPartOfTheGame(self, game):
    if self.username in [game.player1.username, game.player2.username]:
      return True
    return False


  async def abort(self, message):
    print('message  > ' ,message)
    await self.send(text_data=json.dumps({
      'event': 'ABORT',
      'message': message
    }))
    self.close()

  async def receive(self, text_data):
    data = json.loads(text_data)
    print(data)
    if  data["event"] == 'MOVE':
      self.game_data.setPlayerPos(data["username"], data["direction"])

  async def disconnect(self, code):
    await self.channel_layer.group_send(self.room_name, {
      'type': 'player_disconnected',
    })
    self.channel_layer.group_discard(self.room_name, self.channel_name)
    try:
      del self.connected[self.game_id][self.username]
    except Exception:
      pass # pass when its not part of the connected yet


  @database_sync_to_async
  def end_game(self, username):
    if self.game_data :
      self.game.setAsEnded(self.game_data.score)

  @database_sync_to_async
  def getGame(self, game_id):
    try:
      game = Game.objects.get(pk=game_id)
      game.setAsStarted()
      self.enemy = game.player2 if self.user != game.player2 else game.player1
      return game
    except Game.DoesNotExist:
      return None

  async def game_update(self, event):
    await self.send(json.dumps(event))

  async def game_start(self, event):
    await self.send(json.dumps({
      "event": "START",
      "enemy": UserSerializer(self.enemy).data
    }))

  async def game_loop(self):
    iterator = iter(iter(self.connected[self.game_id].items()))
    _ , player1 = next(iterator)
    _ , player2 = next(iterator)
    player1.task = self.task
    player2.task = self.task
    if not player1.game_data and not player2.game_data:
      player1.game_data = player2.game_data  = GameData(player1, player2, self.game, self.channel_layer, self.room_name)
    player2.game_data = player1.game_data
    await self.channel_layer.group_send(self.room_name, {
      'type': 'game.start',
      'event': 'START'
    })
    while not self.game_data.isDone():
      await self.game_data.update()
      await asyncio.sleep(GAME_SPEED)
      if len(self.connected[self.game_id]) != 2:
        await self.end_game()
        break

  @database_sync_to_async
  def end_game(self):
    self.game_data.abort_game(self.username)
    self.game.abortGame(self.username, self.game_data.getScore())
    


  async def player_disconnected(self, event):
    await self.abort("The enemy disconnected, you won!")

  def getUsername(self):
    return self.username
