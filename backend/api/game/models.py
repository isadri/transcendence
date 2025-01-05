from django.db import models
from django.contrib.auth import get_user_model
from django.utils.timezone import now, timedelta
from ..notifications.consumers import NotificationConsumer

User = get_user_model()


class Game(models.Model):
  GAME_STATE = [
      ("P", "pending"),
      ("S", "started"),
      ("E", "ended"),
  ]

  player1  = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1")
  player2  = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2")
  progress = models.CharField(max_length=1, choices=GAME_STATE, default="P")
  start_at = models.DateTimeField(auto_now_add=True)
  p1_score = models.SmallIntegerField(default=0)
  p2_score = models.SmallIntegerField(default=0)
  winner  = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="winner",
    blank=True,
    null=True,
  )

  def __str__(self) -> str:
    return f"{self.pk} => {self.progress}:{self.player1} [{self.p1_score} vs {self.p2_score}] {self.player2}"

  def setAsStarted(self):
    if self.progress != 'P':
      raise ValueError("Cannot start the game unless it's is pending.")
    self.progress = 'S'
    self.save()

  def setScore(self, score):
    self.p1_score = score[self.player1.username]
    self.p2_score = score[self.player2.username]
    self.save()

  def setAsEnded(self, score):
    if self.progress != 'S' and self.progress != 'P':
      raise ValueError("Cannot end the game unless it's has started.")
    self.setScore(score)
    self.progress = 'E'
    self.save()

  def setWinnerByScore(self, score):
    self.setAsEnded(score)
    self.setWinner()
    self.save()

  def setWinner(self):
    if self.progress != 'E':
      raise ValueError("Cannot set a winner unless the game has ended.")
    if self.p1_score > self.p2_score:
        self.winner = self.player1
    elif self.p2_score > self.p1_score:
        self.winner = self.player2
    self.save()

  def abortGame(self, winner, score):
    try:
      self.setAsEnded(score)
    except Exception:
      pass
    self.winner = self.player1 if self.player1.username == winner else self.player2
    self.save()



class GameInvite(models.Model):

  INVITE_STATE = [
        ('P', 'Pending'),
        ('A', 'Accepted'),
        ('D', 'Declined'),
        ('E', 'Expired'),
    ]

  invited = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invited")
  inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="inviter")
  status  = models.CharField(max_length=1, choices=INVITE_STATE, default="P")
  sent_at = models.DateTimeField(auto_now_add=True)


  def __str__(self) -> str:
    return f'{self.pk} : {self.status} => {self.inviter} invites {self.invited}'

  def accept(self, user : User): 
    if self.isExpired() or self.status != 'P':
      raise ValueError('the invite already been processed or its expired')
    if user != self.invited:
      raise ValueError('The invited user can prosses this invite')
    self.status = 'A'
    self.save()

  def decline(self, user : User):
    if self.isExpired() or self.status != 'P':
      raise ValueError('the invite already been processed or its expired')
    if user != self.invited:
      raise ValueError('The invited user can prosses this invite')
    self.status = 'D'
    self.save()

  def isExpired(self):
    if now() > self.sent_at + timedelta(hours=1):
      self.status = 'E'
      return True
    return False

class UserAchievement(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_achievement')
  type = models.CharField(max_length=255 , default="")
  name = models.CharField(max_length=255 , default="")
  key = models.CharField(max_length=255 , default="") # game_1/ level_7
  text = models.TextField(default="")
  def __str__(self):
        return self.name

class UserStats(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_stats')
  level = models.FloatField(default=0)
  badge = models.IntegerField(default=0)
  win = models.IntegerField(default=0)
  lose = models.IntegerField(default=0)
  nbr_games = models.IntegerField(default=0)

  def __str__(self):
        return f"{self.user.username} - Level {self.level}"
      


class Tournament(models.Model):
  player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_1")
  player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_2")
  player3 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_3")
  player4 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player_4")
  half1 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="half1", null=True)
  half2 = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="half2", null=True)
  final = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="final", null=True)
  winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tournament_winner", null=True)

  def init(self):
    self.get_or_create_half1()
    self.get_or_create_half2()

  def send_notification(self, player):
    message = f"Are you ready to play!"
    NotificationConsumer.send_friend_request_notification(player.id, message, "Tournament")

  def get_or_create_half1(self):
    if not self.half1:
      self.half1 = Game.objects.create(player1=self.player1, player2=self.player2)
      self.save(update_fields=['half1'])
      self.send_notification(self.player1)
      self.send_notification(self.player2)
    return (self.half1)

  def get_or_create_half2(self):
    if not self.half2:
      self.half2 = Game.objects.create(player1=self.player3, player2=self.player4)
      self.send_notification(self.player3)
      self.send_notification(self.player4)
      self.save(update_fields=['half2'])
    return (self.half2)

  def get_or_create_final(self):
    if not self.final and self.ready_to_start_final():
      self.final = Game.objects.create(player1=self.half1.winner, player2=self.half2.winner)
      self.send_notification(self.half1.winner)
      self.send_notification(self.half2.winner)
      self.save(update_fields=['final'])
    self.has_a_winner()
    return (self.final)

  def ready_to_start_final(self):
    if not self.half1 or not self.half2:
      return False
    return self.half1.progress == 'E' and  self.half2.progress == 'E'

  def has_a_winner(self):
    if self.final and self.final.progress == 'E':
      if self.winner:
        return True
      self.winner = self.final.winner
      self.save(update_fields=['winner'])
      return True
    return False