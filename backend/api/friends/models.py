from django.conf import settings
from django.db import models

from . import friends


class FriendList(models.Model):
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

    def add_friend(self, new_friend: 'User') -> None:
        """
        add a new friend to the list of friends of the current user, and add
        the current user to the list of friends of new_friend.

        Raises:
            friends.AlreadyExistsError: If new_friend already exists.
        """
        if new_friend in self.friends.all():
            raise friends.AlreadyExistsError
        self.friends.add(new_friend)

    def remove_friend(self, friend):
        """
        Remove a friend
        """
        if friend in self.friends.all():
            self.friends.remove(friend)
    
    def unfriend(self, removee):
        """
        Initiate the action of unfriending someone
        """
        remove_friends_list = self # person terminating the friendship

        # Remove friend from remover friend list
        remove_friends_list.remove_friend(removee)

        # Remove friend from removee friend list
        friends_list = FriendList.objects.get(user=removee)
        friends_list.remove_friend(self.user)

    def is_mutual_friend(self, friend):
        """
        Is this a friend?
        """
        if friend in self.friends.all():
            return True
        return False

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
    # a friend request been active when it's either been accepted or inactive if it's declined
    is_active = models.BooleanField(blank=True, null=False, default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.sender.username

    def accept(self) -> None:
        """
        Accept the friend request.
        Update both sender and receiver friend lists
        """
        receiver_friend = FriendList.objects.get(user=self.receiver)
        if receiver_friend:
            receiver_friend.add_friend(self.sender)
            sender_friend = FriendList.objects.get(user=self.sender)
            if sender_friend:
                sender_friend.add_friend(self.receiver)
                self.is_active = False
                self.save() # he is not sure if this is correct

    def decline(self):
        """
        Decline a friend request.
        It is 'declined' by setting the 'is_active' field to False
        """
        self.is_active = False
        self.save() # he is not sure if this is correct
        
    def cancel(self):
        """
        Cancel a friend request.
        It is 'cancelled' by setting the 'is_active' field to False.
        This is only different with respect to 'declining' through the notification that is genetated.
        """
        self.is_active = False
        self.save()