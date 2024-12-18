from django.conf import settings
from django.db import models
from django.db import transaction
from django.db.models.deletion import SET_NULL

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

    def add_friend(self, new_friend) -> None:
        """
        add a new friend to the list of friends of the current user, and add
        the current user to the list of friends of new_friend.

        Raises:
            friends.AlreadyExistsError: If new_friend already exists.
        """
        # if new_friend in self.friends.all():
        #     raise friends.AlreadyExistsError
        if new_friend in self.friends.all():
            raise ValueError("This friend is already in the friend list.")
        self.friends.add(new_friend)

    def remove_friend(self, friend):
        """
        Remove a friend
        """
        if friend in self.friends.all():
            self.friends.remove(friend)
    
    # def unfriend(self, removee):
    #     """
    #     Initiate the action of unfriending someone
    #     """
    #     remove_friends_list = self # person terminating the friendship

    #     # Remove friend from remover friend list
    #     remove_friends_list.remove_friend(removee)

    #     # Remove friend from removee friend list
    #     friends_list = FriendList.objects.get(user=removee)
    #     friends_list.remove_friend(self.user)

    # def is_mutual_friend(self, friend):
    #     """
    #     Is this a friend?
    #     """
    #     if friend in self.friends.all():
    #         return True
    #     return False



STATUS_CHOICES = (
    ('pending', 'pending'),
    ('accepted', 'accepted'),
    ('blocked', 'blocked'),
)

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
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default="pending")
    blocked_by = models.ForeignKey(settings.AUTH_USER_MODEL,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True,
                                   related_name='blocked_requests')

    def __str__(self) -> str:
        return self.sender.username

    def accept(self) -> None:
        """
        Accept the friend request.
        Update both sender and receiver friend lists
        This method also marks the friend request as accepted.
        """
        try:
            """
            transaction.atomic() is a good practice when making multiple database
            operations that depend on each other. It ensures atomicity—either all operations
            succeed, or none are applied, maintaining database consistency.
            """
            with transaction.atomic():
                receiver_friend_list, _ = FriendList.objects.get_or_create(user=self.receiver)
                receiver_friend_list.add_friend(self.sender)

                sender_friend_list, _ = FriendList.objects.get_or_create(user=self.sender)
                sender_friend_list.add_friend(self.receiver)

                self.status = 'accepted'
                self.save()
        except Exception as e:
            # Optionally, log the exception for debugging
            raise ValueError(f"Failed to accept the friend request: {str(e)}")


    def block(self, blocker_user):
        """
        Block a user from the friend request.
        The blocker_user must be either the sender or receiver.
        """
        try:
            if blocker_user not in [self.sender, self.receiver]:
                raise ValueError("The blocker_user must be either the sender or the receiver.")

            # Determine the user being blocked
            user_to_block = self.receiver if blocker_user == self.sender else self.sender

            with transaction.atomic():
                # Only remove if they are friends
                if FriendList.objects.filter(user=blocker_user, friends=user_to_block).exists():
                    blocker_user_friend_list, _ = FriendList.objects.get_or_create(user=blocker_user)
                    blocker_user_friend_list.remove_friend(user_to_block)

                    user_to_block_friend_list, _ = FriendList.objects.get_or_create(user=user_to_block)
                    user_to_block_friend_list.remove_friend(blocker_user)

                    blocker_user.is_friend = False
                    user_to_block.is_friend = False

                # Update the FriendRequest status and record who blocked whom
                self.status = 'blocked'
                self.blocked_by = blocker_user
                self.save()
                blocker_user.save()
                user_to_block.save()

        except Exception as e:
            raise ValueError(f"Failed to block the friend request: {str(e)}")

    def remove(self, remover_user):
        """
        remove a user from the friend request.
        The remover_user must be either the sender or receiver.
        """
        try:
            if remover_user not in [self.sender, self.receiver]:
                raise ValueError("The remover_user must be either the sender or the receiver.")
        
            # Determine the user being removed
            removed_user = self.receiver if remover_user == self.sender else self.sender
        
            with transaction.atomic():
                remover_user_friend_list, _ = FriendList.objects.get_or_create(user=remover_user)
                remover_user_friend_list.remove_friend(removed_user)
        
                # Remove the blocker from the user-to-block's friend list
                removed_user_friend_list, _ = FriendList.objects.get_or_create(user=removed_user)
                removed_user_friend_list.remove_friend(remover_user)
        
                # Update the FriendRequest status and record who blocked whom
                # self.status = 'blocked'
                # self.blocked_by = remover_user
                self.delete()
        except Exception as e:
            raise ValueError(f"Failed to remove the friend request: {str(e)}")

    # def unblock(self, unblocker_user):
    #     """
    #     Block a user from the friend request.
    #     The unblocker_user must be either the sender or receiver.
    #     """
    #     try:
    #         if unblocker_user not in [self.sender, self.receiver]:
    #             raise ValueError("The unblocker_user must be either the sender or the receiver.")

    #         # Determine the user being blocked
    #         blocked_user = self.receiver if unblocker_user == self.sender else self.sender

    #         with transaction.atomic():
    #             # ensure the friend request status is 'blocked' before proceeeding
    #             if self.status != 'blocked' or self.blocked_by != unblocker_user:
    #                 raise ValueError("This friend request is not blocked.")

    #             unblocker_user.is_blocked = False
    #             blocked_user.is_blocked = False

    #             # if they were previously friends, restore is_friend
    #             if FriendList.objects.filter(user=unblocker_user, friends__id=blocked_user).exists():
    #                 unblocker_user.is_friend = True
    #                 blocked_user.is_friend = True
    #                 unblocker_user_friend_list, _ = FriendList.objects.get_or_create(user=unblocker_user)
    #                 unblocker_user_friend_list.add_friend(blocked_user)

    #                 # Remove the blocker from the user-to-block's friend list
    #                 blocked_user_friend_list, _ = FriendList.objects.get_or_create(user=blocked_user)
    #                 blocked_user_friend_list.add_friend(unblocker_user)
    #             else:
    #                 unblocker_user.is_friend = False
    #                 blocked_user.is_friend = False

    #             # Update the FriendRequest status and record who blocked whom
    #             self.status = 'accepted'
    #             self.blocked_by = None
    #             self.save()

    #             unblocker_user.save()
    #             blocked_user.save()
    #     except Exception as e:
    #         raise ValueError(f"Failed to block the friend request: {str(e)}")

    def unblock(self, unblocker_user):
        """
        Unblock a user from the friend request.
        The unblocker_user must be either the sender or receiver.
        """
        try:
            if unblocker_user not in [self.sender, self.receiver]:
                raise ValueError("The unblocker_user must be either the sender or the receiver.")
        
            # Determine the blocked user
            blocked_user = self.receiver if unblocker_user == self.sender else self.sender
        
            with transaction.atomic():
                # Ensure the request is blocked and unblocker_user is the one who blocked
                if self.status != 'blocked' or self.blocked_by != unblocker_user:
                    raise ValueError("This friend request is not blocked.")
        
                # Reset block status for both users
                unblocker_user.is_blocked = False
                blocked_user.is_blocked = False
        
                # If they were previously friends, restore is_friend and add to FriendList
                # if FriendList.objects.filter(user=unblocker_user, friends=blocked_user).exists():
                #     unblocker_user.is_friend = True
                #     blocked_user.is_friend = True
        
                #     # Add both users to each other's friend list
                #     # unblocker_user_friend_list, _ = FriendList.objects.get_or_create(user=unblocker_user)
                #     # unblocker_user_friend_list.add_friend(blocked_user)
        
                #     # blocked_user_friend_list, _ = FriendList.objects.get_or_create(user=blocked_user)
                #     # blocked_user_friend_list.add_friend(unblocker_user)
                # else:
                #     # If they were not friends, no need to modify friend lists
                # unblocker_user.is_friend = False
                # blocked_user.is_friend = False
        
                # Update the FriendRequest status and clear block information
                self.status = 'accepted'
                self.blocked_by = None
                self.save()
        
                # Save the changes to both users
                unblocker_user.save()
                blocked_user.save()
        
        except Exception as e:
            raise ValueError(f"Failed to unblock the friend request: {str(e)}")
        