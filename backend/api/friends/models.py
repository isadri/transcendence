from django.conf import settings
from django.db import models

from . import friends


class Friends(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, related_name='user')
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True,
                                     related_name='friends')

    def __str__(self) -> str:
        return self.user.username

    def add(self, new_friend: 'User') -> None:
        if new_friend in self.friends.all():
            raise friends.AlreadyExistsError
        self.friends.add(new_friend)
