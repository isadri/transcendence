from django.db import models
from ..accounts.models import User

# Create your models here.



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

  def setAsStarted(self):
    if self.progress != 'P':
      raise ValueError("Cannot start the game unless it's is pending.")
    self.progress = 'S'

  def setScore(self, score):
    self.p1_score = score[self.player1.username]
    self.p2_score = score[self.player2.username]

  def setAsEnded(self, score):
    if self.progress != 'S':
      raise ValueError("Cannot end the game unless it's has started.")
    self.setScore(score)
    self.progress = 'E'

  def setWinner(self, score):
    self.setAsEnded(score)
    self.setWinner()

  def setWinner(self):
    if self.progress != 'E':
      raise ValueError("Cannot set a winner unless the game has ended.")
    if self.p1_score > self.p2_score:
        self.winner = self.player1
    elif self.p2_score > self.p1_score:
        self.winner = self.player2
    self.save()

  def abortGame(self, winner, score):
    self.winner = self.player1 if self.player1.username == winner else self.player2
    self.setScore(score)
