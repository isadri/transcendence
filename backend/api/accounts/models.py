from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profiles',
                                default='./media/default/default_profile.png')

    def __str__(self):
        return self.username
