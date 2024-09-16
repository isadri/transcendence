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


class FriendRequest(models.Model):
    """
    Generate friend requests.

    Attributes:
        sender: The user who sends the request.
        receiver: The user who receives the request.
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name='sender')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name='receiver')
    when = models.DateTimeField(auto_now_add=True)

    def accept(self) -> None:
        """
        Accept the friend request.
        """
        sender = Friend.objects.get(user=self.sender)
        receiver = Friend.objects.get(user=self.receiver)
        sender.add(self.receiver)
        receiver.add(self.sender)
        self.delete()

    def __str__(self) -> str:
        return self.sender.username
