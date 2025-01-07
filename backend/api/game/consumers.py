import json
import math
import random
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import *
from ..game.serializers import TournamentSerializer
from ..accounts.serializers import UserSerializer
from ..friends.serializers import FriendSerializer
from channels.layers import get_channel_layer
from django.db.models import Q
channel_layer = get_channel_layer()

TABLE_Z = 8.65640
PADDLE_Z = 0.5
PADDLE_X = 1.5

SIDE_WIDTH = 0.5
BALL_R = 0.12
GOAL_Z = (8.65640 + 0.5)/2
GAME_SPEED = 1/60
PADDLE_SPEED = 0.08
SIDE_LIMIT = 3.07345
MOVE_SIDE_LIMIT = 3.07345-PADDLE_X/2
BALL_SPEED = 0.05
PI_4 = math.pi / 4
PI_4_100 = PI_4 / (PADDLE_X / 2)
Z_PADDLE_BALL_R = PADDLE_Z/2 + BALL_R
X_PADDLE_BALL_R = PADDLE_Z/2 + BALL_R

class RandomGame(AsyncWebsocketConsumer):

  queue = {}
  connected = {}
  async def connect(self):
    self.user = self.scope["user"]
    self.room_name = None
    if self.user and self.user.is_authenticated:
      await self.accept()



  async def disconnect(self, code):
    if not self.user or not self.user.is_authenticated:
      return
    username = self.user.username
    if username in self.queue:
      del self.queue[username]
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
    try:
      data = json.loads(text_data)
      if data["event"] == "READY":
        self.queue[self.user.username] = self
        print(self.queue)
        if len(self.queue) >= 2:
          iterator = iter(iter(self.queue.items()))
          key1 , player1 = next(iterator)
          key2 , player2 = next(iterator)
          self.gameMatch = await self.create_game(player1.user, player2.user)
          self.room_name = f"random_game_{self.gameMatch.id}"
          self.setAsConnected(key1, key2)
          await self.handshaking(key1, key2)
          await self.joinRoom(player1)
          await self.joinRoom(player2)
    except:
      await self.close()


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
        "enemy": await self.serializing_data(self.connected[key2].user)
      }))
    except Exception as e:
      print(f"handshake of {key1}:> ", e)


  @database_sync_to_async
  def serializing_data(self, user):
    serializer = FriendSerializer(user, context={'user':self.user})
    return serializer.data

  async def handshaking(self, key1, key2):
    """
      notify the players that a game initialed
    """
    await self.handshake(key1, key2)
    await self.handshake(key2, key1)

  def setAsConnected(self, key1, key2):
    # delete them from the queue and set them as connected
    self.connected[key1] = self.queue[key1]
    del self.queue[key1]
    self.connected[key2] = self.queue[key2]
    del self.queue[key2]

  async def player_disconnected(self, event):
    """
    Notify the remaining player that their opponent disconnected.
    """
    await self.send(json.dumps({
        "event": "ABORT",
        "username": event["username"],
    }))


class GameData:

  def __init__(self, p1, p2, game, name):
    self.game = game
    self.room_name = name

    self.resetBall()

    self.done = False
    self.winner = None

    self.player1Update = 0
    self.player2Update = 0
    self.player1 = p1.username
    self.player2 = p2.username
    self.score = {p1.username : 0, p2.username : 0}
    self.players = {p1.username : p1, p2.username : p2}
    self.players_pos = {
      self.player1 : [0, 0.09, (TABLE_Z - 0.6)/ 2],
      self.player2 : [0, 0.09, -(TABLE_Z - 0.6)/ 2]
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
    self.update_Players()
    self.update_ball()
    self.checkScore()

  def update_Players(self):
    if self.justBeenHited():
      return
    newpos = self.players_pos[self.player1][0] + self.player1Update
    if newpos < MOVE_SIDE_LIMIT and newpos > -MOVE_SIDE_LIMIT:
      self.players_pos[self.player1][0] += self.player1Update 
    newpos = self.players_pos[self.player2][0] + self.player2Update
    if newpos < MOVE_SIDE_LIMIT and newpos > -MOVE_SIDE_LIMIT:
      self.players_pos[self.player2][0] += self.player2Update 

  def update_player1(self, pos):
    self.player1_pos = pos

  def update_player2(self, pos):
    self.player1_pos = pos

  def update_ball(self):
    if self.hitSideWalls():
      self.x_direction *= -1
    else:
      self.hitPaddle(self.players_pos[self.player1])
      self.hitPaddle(self.players_pos[self.player2])
    self.oldx_direction = self.x_direction
    self.moveBall()

  def moveBall(self):
    self.oldBall = self.ball
    self.ball[2] += self.dz * self.z_direction
    self.ball[0] += self.dx * self.x_direction

  def checkScore(self):
    if abs(GOAL_Z - self.ball[2]) <= BALL_R * 2:
      self.score[self.player2] += 1
      self.resetBall()
    if abs(-GOAL_Z - self.ball[2]) <= BALL_R * 2:
      self.score[self.player1] += 1
      self.resetBall()

  def resetBall(self):
    self.z_direction = 1
    self.x_direction = 1
    self.ball = [0, 0.2, 0]
    self.oldBall = self.ball
    self.counter = 0
    self.alpha = math.pi / 4
    self.oldx_direction = self.x_direction
    self.dz = math.cos(self.alpha) * BALL_SPEED
    self.dx = math.sin(self.alpha) * BALL_SPEED

  def checkWinner(self):
    if self.score[self.player1] == 7 or self.score[self.player2] == 7:
      self.done = True
      self.winner = self.player1 if self.score[self.player1] == 7 else self.player2
      return True
    return False

  def getScore(self):
    return self.score

  def hitSideWalls(self):
    x = self.ball[0]
    if abs(SIDE_LIMIT - x) <= BALL_R or abs(-SIDE_LIMIT - x) <= BALL_R:
      return True
    return False

  def justBeenHited(self) -> bool:
    if self.counter == 0:
      return False
    self.counter -= 1
    return True

  def hitPaddle(self, pos):
    z = self.ball[2] + GOAL_Z + self.dz * self.z_direction
    x = self.ball[0] + SIDE_LIMIT + self.dx * self.x_direction
    pz = pos[2] + GOAL_Z
    px = pos[0] + SIDE_LIMIT

    ball_LEFT   = x - BALL_R
    ball_RIGHT  = x + BALL_R
    ball_TOP    = z - BALL_R
    ball_BOTTOM = z + BALL_R
    paddle_LEFT   = px - PADDLE_X/2
    paddle_RIGHT  = px + PADDLE_X/2
    paddle_TOP    = pz - PADDLE_Z/2
    paddle_BOTTOM = pz + PADDLE_Z/2
    if ball_LEFT <= paddle_RIGHT and ball_TOP <= paddle_BOTTOM and ball_RIGHT >= paddle_LEFT and ball_BOTTOM >= paddle_TOP:
        horizontal_overlap = min(ball_RIGHT - paddle_LEFT, paddle_RIGHT - ball_LEFT)
        vertical_overlap = min(ball_BOTTOM - paddle_TOP, paddle_BOTTOM - ball_TOP)
        if vertical_overlap < horizontal_overlap:
          self.z_direction *= -1
          self.alpha = PI_4_100 * abs(px - x)
          self.dx += math.sin(self.alpha) * BALL_SPEED
        else:
          self.x_direction *= -1
          self.alpha = PI_4_100 * abs(pz - z)
          self.dz += math.sin(self.alpha) * BALL_SPEED * 3
          self.counter = 5

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
    direct = 0
    newpos = self.players_pos[username][0] + direct
    if newpos < MOVE_SIDE_LIMIT and newpos > -MOVE_SIDE_LIMIT:
      if pos == '+':
        direct = PADDLE_SPEED
      elif pos == '-':
        direct = -PADDLE_SPEED
    else:
      pos = '*'
    if username == self.player1:
      self.player1Update = direct
    if username == self.player2:
      self.player2Update = direct

  def abort_game(self, username=None):
    self.done = True
    if username:
      self.winner = username

  def getWinner(self):
    return self.winner

class RemoteGame(AsyncWebsocketConsumer):

  connected = {}
  async def connect(self):
    self.game: Game = None
    self.user = self.scope["user"]

    if not self.user or not self.user.is_authenticated:
      return
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
      if await self.isStarted():
        await self.abort('The game is already done')
        return
      if self.game_id not in self.connected:
        self.connected[self.game_id] = {self.username: self}
      else:
        self.connected[self.game_id][self.username] = self
      await self.channel_layer.group_add(self.room_name, self.channel_name)
      print(self.user, self.connected[self.game_id])
      if len(self.connected[self.game_id]) == 2 and list(self.connected[self.game_id].keys()).index(self.username) == 1:
        self.task = asyncio.create_task(self.game_loop())
        self.task.add_done_callback(self.handle_task)
    else:
      await self.abort("You are not allowed to join this game")

  def handle_task(self, task):
    try:
        task.result()  #  re-raise any error has been 
    except Exception as e:
        print(f"Task crashed with error: {e}")# to do : send error message to the client

  @database_sync_to_async
  def isStarted(self) -> bool:
    if self.game.progress != 'P':
      return True
    return False

  @database_sync_to_async
  def isPartOfTheGame(self, game):
    if self.username in [game.player1.username, game.player2.username]:
      return True
    return False

  async def abort(self, message):
    await self.send(text_data=json.dumps({
      'event': 'ABORT',
      'message': message
    }))
    self.close()

  async def receive(self, text_data):
    data = json.loads(text_data)
    if  data["event"] == 'MOVE':
      self.game_data.setPlayerPos(data["username"], data["direction"])

  async def disconnect(self, code):
    if not self.user or not self.user.is_authenticated:
      return
    await self.channel_layer.group_send(self.room_name, {
      'type': 'player_disconnected',
    })
    self.channel_layer.group_discard(self.room_name, self.channel_name)
    try:
      del self.connected[self.game_id][self.username]
    except Exception:
      pass # pass when its not part of the connected yet


  @database_sync_to_async
  def end_game(self):
    if self.game_data :
      self.game.setWinnerByScore(self.game_data.score)

  @database_sync_to_async
  def getGame(self, game_id):
    try:
      game = Game.objects.get(pk=game_id)
      self.enemy = game.player2 if self.user != game.player2 else game.player1
      return game
    except Game.DoesNotExist:
      return None

  async def game_update(self, event):
    await self.send(json.dumps(event))

  async def game_start(self, event):
    await self.send(json.dumps({
      "event": "START",
      "enemy": await self.serializing_data(self.enemy),
      event['player1']:'player1',
      event['player2']:'player2',
    }))

  @database_sync_to_async
  def serializing_data(self, users):
    serializer = UserSerializer(users)
    return serializer.data

  @database_sync_to_async
  def setGameAsStarted(self):
    self.game.setAsStarted()

  async def game_loop(self):
    iterator = iter(iter(self.connected[self.game_id].items()))
    _ , player1 = next(iterator)
    _ , player2 = next(iterator)
    player1.task = self.task
    player2.task = self.task
    try:
      await self.setGameAsStarted()
    except Exception as e:
      await self.abort(e.args[0])
      return
    if not player1.game_data and not player2.game_data:
      player1.game_data = player2.game_data  = GameData(player1, player2, self.game, self.room_name)
    player2.game_data = player1.game_data
    await self.channel_layer.group_send(self.room_name, {
      'type': 'game.start',
      'event': 'START',
      'player1':self.game_data.player1,
      'player2':self.game_data.player2
    })
    while True:
      await self.game_data.update()
      await asyncio.sleep(GAME_SPEED)
      if len(self.connected[self.game_id]) != 2:
        await self.abort_game()
        return
      if self.game_data.isDone():
        break
    await self.end_game()
    print(f'loop :{self.user}', self.game_data.getWinner())
    await self.channel_layer.group_send(self.room_name, {
      'type': 'got_winner',
      'winner': self.game_data.getWinner()
    })

  async def got_winner(self, event):
    await self.send(json.dumps({
      "event": "WINNER",
      "winner": event['winner']
    }))

  @database_sync_to_async
  def abort_game(self):
    self.game_data.abort_game(self.username)
    self.game.abortGame(self.username, self.game_data.getScore())

  async def player_disconnected(self, event):
    if self.game_data:
      await self.abort_game()
      await self.send(json.dumps({
        "event": "WINNER",
        "winner": self.game_data.getWinner()
      }))

  def getUsername(self):
    return self.username




class RandomTournament(AsyncWebsocketConsumer):
  queue = {}
  connected = {}
  async def connect(self):
    self.user = self.scope["user"]
    self.room_name = None
    if self.user.is_authenticated:
      await self.accept()
    else:
      await self.close()

  async def receive(self, text_data):
    data = json.loads(text_data)
    if data["event"] == "READY":
      self.queue[self.user.username] = self
      if len(self.queue) >= 4:
        iterator = iter(iter(self.queue.items()))
        key1 , player1 = next(iterator)
        key2 , player2 = next(iterator)
        key3 , player3 = next(iterator)
        key4 , player4 = next(iterator)
        
        self.tournament = await self.create_tournament(
          player1.user,
          player2.user,
          player3.user,
          player4.user
        )
        print(self.tournament)
        self.room_name = f"room_{self.tournament.id}"
        await player1.channel_layer.group_add(self.room_name, player1.channel_name)
        await player2.channel_layer.group_add(self.room_name, player2.channel_name)
        await player3.channel_layer.group_add(self.room_name, player3.channel_name)
        await player4.channel_layer.group_add(self.room_name, player4.channel_name)
        await self.handshaking(
          player1.user,
          player2.user,
          player3.user,
          player4.user
        )



  async def handshaking(self, p1, p2, p3, p4):
    await self.channel_layer.group_send(self.room_name, {
      'type': 'handshake',
      'tournament': self.tournament.id,
      'players': await self.serializing_data([p1, p2, p3, p4]),
    })


  async def handshake(self, event):
    enemies = []
    players = event.get('players')
    for player in players:
      username = player.get('username')
      if username != self.user.username:
        enemies.append({
          'avatar': player['avatar'],
          'username': player['username'],
          'stats': player['stats'],
        })
    await self.send(text_data=json.dumps({
      'event': 'HANDSHAKING',
      'enemies': enemies,
      'tournament': event['tournament']
    }))

  # @database_sync_to_async
  # def setup_half_games(self, tournament: Tournament):
  #   tournament.get_half1()

  @database_sync_to_async
  def serializing_data(self, users):
    serializer = FriendSerializer(users, many=True, context={'user':self.user})
    return serializer.data
  
  @database_sync_to_async
  def create_tournament(self, p1, p2, p3, p4):
    tournament = Tournament.objects.create(
      player1=p1,
      player2=p2,
      player3=p3,
      player4=p4,
    )
    tournament.init()
    return tournament

  async def disconnect(self, code):
    username = self.user.username
    if username in self.queue:
      del self.queue[username]
    if username in self.connected:
      del self.connected[username]
    if self.room_name:
      await self.channel_layer.group_send(
        self.room_name,
        {
            "type": "player_disconnected",
            "username": self.user.username,
        }
      )



class RemoteTournament(AsyncWebsocketConsumer):

  tournaments = {}
  async def connect(self):
    self.user = self.scope.get('user')
    self.tournament_id = self.scope["url_route"]["kwargs"]['id']
    self.room_name = f'tournament_{self.tournament_id}'
    if self.user or self.user.is_authenticated:
      self.username = self.user.username
      await self.accept()
      await self.channel_layer.group_add(self.room_name, self.channel_name)
      self.tournaments.setdefault(self.tournament_id, {})
      self.tournaments[self.tournament_id].setdefault('players', {})
      self.tournaments[self.tournament_id]['players'].setdefault(self.username, self)
      self.tournament = await self.get_tournament(self.tournament_id)
      if not self.tournament:
        self.abort('This tournament does not exist!')
        return
      if not await self.is_part_of_tournament(self.tournament):
        self.abort('You dont have the permissions to access this tournament!')
        return
      self.task = await asyncio.create_task(self.update_data())
    else:
      self.abort('Something went wrong!')

  async def update_data(self):
    self.data = None
    while True:
      self.tournament = await self.get_tournament(self.tournament_id)
      await self.check_for_final()
      data = await self.serializing_data(self.tournament)
      if self.data != data:
        self.data = data
        await self.send(text_data=json.dumps(self.data))
        if self.data['final'] and self.data['final']['winner']:
          break
      await asyncio.sleep(1)

  @database_sync_to_async
  def check_for_final(self):
    return self.tournament.get_or_create_final()

  @database_sync_to_async
  def serializing_data(self, tournament: Tournament):
    serializer = TournamentSerializer(tournament, context={'user' : self.user})
    return serializer.data

  async def abort(self, message):
    await self.send(text_data=json.dumps({
      'event': 'ABORT',
      'message': message
    }))
    self.close()

  @database_sync_to_async
  def is_part_of_tournament(self, tournament: Tournament):
    return self.user in [tournament.player1, tournament.player2, tournament.player3, tournament.player4]

  @database_sync_to_async
  def get_tournament(self, pk:int) -> Tournament:
    try:
      tournament = Tournament.objects.get(pk=pk)
      return tournament
    except:
      return None

  async def disconnect(self, code):
    pass




class FriendGame(AsyncWebsocketConsumer):

  connected = {}
  async def connect(self):
    self.user = self.scope['user']
    if not self.user or not self.user.is_authenticated:
      return
    await self.accept()
    self.invite_id = self.scope["url_route"]["kwargs"]['invite_id']
    self.invite = await self.get_invite(self.invite_id)
    if not self.invite or not await self.is_part_of_invite(self.invite):
      self.abort("No invite with this id or you dont have permission")
      return
    self.connected.setdefault(self.invite_id, {})
    self.connected[self.invite_id].setdefault('players', [])
    self.connected[self.invite_id]['players'].append(self)
    self.room_name = f"room_invite_{self.invite.id}"
    self.player1 = self.invite.inviter
    self.player2 = self.invite.invited
    await self.channel_layer.group_add(self.room_name, self.channel_name)
    if not await self.accept_invite(self.invite):
      self.close()


  async def receive(self, text_data):
    data = json.loads(text_data)
    event = data.get("event")
    if event and event == "READY":
      if len(self.connected[self.invite_id]['players']) >= 2:
        self.gameMatch = await self.create_game(player1=self.player1, player2=self.player2)
        await self.delete_invite(self.invite)
        await self.channel_layer.group_send(
          self.room_name,
          {
            "type": "handshake",
            "game_id": self.gameMatch.id,
          },
        )

  @database_sync_to_async
  def serializing_data(self, user):
    serializer = FriendSerializer(user, context={'user':self.user})
    return serializer.data
  

  async def handshake(self, event):
    print(event)
    await self.send(text_data=json.dumps({
        "event" : "HANDSHAKING",
        "game_id": event["game_id"],
        "enemy": await self.serializing_data(self.player1 if self.user == self.player2 else self.player2)
      }))

  async def abort(self, message):
    await self.send(text_data=json.dumps({
      'event': 'ABORT',
      'message': message
    }))
    self.close()

  @database_sync_to_async
  def is_part_of_invite(self, invite):
    return self.user in [invite.inviter, invite.invited]

  @database_sync_to_async
  def accept_invite(self, id):
    try:
      if self.user == self.invite.invited:
        self.invite.status = 'A'
        self.invite.save(update_fields=['status'])
      return True
    except Exception as e:
      return False

  @database_sync_to_async
  def get_invite(self, id):
    try:
      return GameInvite.objects.get(pk=id)
    except Exception as e:
      return None


  @database_sync_to_async
  def create_game(self, player1, player2):
    return Game.objects.create(player1=player1, player2=player2)


  @database_sync_to_async
  def delete_invite(self, invite:GameInvite):
    try:
      invite.delete()
    except Exception as e:
      pass

  async def disconnect(self, code):
    if not self.room_name or not self.invite_id:
      return
    await self.channel_layer.group_discard(self.room_name, self.channel_name)


