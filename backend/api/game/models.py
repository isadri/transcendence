from django.db import models
from ..accounts.models import User

# Create your models here.


GAME_STATE = [
    ("P", "pending"),
    ("S", "started"),
    ("E", "ended"),
]

class Game(models.Model):
  player1  = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1")
  player2  = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2")
  progress = models.CharField(max_length=1, choices=GAME_STATE, default="P")
  start_at = models.DateTimeField(auto_now_add=True)
  p1_score = models.SmallIntegerField(default=0)
  p2_score = models.SmallIntegerField(default=0)