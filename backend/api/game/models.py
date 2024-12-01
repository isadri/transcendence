from django.db import models
from ..accounts.models import User

# Create your models here.
class Game(models.Model):
  player1 = models.ForeignKey()