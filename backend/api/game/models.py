from django.db import models
from django.contrib.auth import get_user_model
from django.utils.timezone import now, timedelta

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

  def accept(self, user : User):
    if self.isExpired() or self.status != 'P':
      raise ValueError('the invite already been processed or its expired')
    if user != self.invited:
      raise ValueError('You dont have permession to prosses this invite')
    self.status = 'A'
    self.save()

  def decline(self, user : User):
    if self.isExpired() or self.status != 'P':
      raise ValueError('the invite already been processed or its expired')
    if user != self.invited:
      raise ValueError('You dont have permession to prosses this invite')
    self.status = 'D'
    self.save()

  def isExpired(self):
    if now() > self.sent_at + timedelta(hours=1):
      self.status = 'E'
      return True
    return False
