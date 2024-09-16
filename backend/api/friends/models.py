from django.conf import settings
from django.db import models

from . import friends


class Friend(models.Model):
    """
    Friends model to create list of friends.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, related_name='user')
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True,
                                     related_name='friends')

    def __str__(self) -> str:
        """
        string representation.
        """
        return self.user.username

    def add(self, new_friend: 'User') -> None:
        """
        add a new friend to the list of friends of the current user, and add
        the current user to the list of friends of new_friend.

        Raises:
            friends.AlreadyExistsError: If new_friend already exists.
        """
        if new_friend in self.friends.all():
            raise friends.AlreadyExistsError
        self.friends.add(new_friend)
        friend = Friend.objects.get(user=new_friend)
        friend.friends.add(self.user)
