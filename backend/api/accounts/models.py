from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    avatar = models.ImageField(upload_to='profiles',
                                default='default/default_profile.jpg')

    def __str__(self):
        return self.username
