from django.conf import settings
from django.db import models
from django.db.models import UniqueConstraint
from django.utils.timesince import timesince

STATUS_CHOICES = (
    ('none', 'none'),
    ('blocker', 'blocker'),
    ('blocked', 'blocked'),
)

class Chat(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chats_as_user1',
                              on_delete=models.CASCADE)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chats_as_user2',
                              on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_message = models.TextField(null=True, blank=True)
    blocke_state_user1 = models.CharField(max_length=8, choices=STATUS_CHOICES, default="none")
    blocke_state_user2 = models.CharField(max_length=8, choices=STATUS_CHOICES, default="none")
    nbr_of_unseen_msg_user1 = models.IntegerField(default=0)
    nbr_of_unseen_msg_user2 = models.IntegerField(default=0)

    class Meta:
        constraints = [
            UniqueConstraint(fields=['user1', 'user2'], name='unique_chat'),
        ]

    def __str__(self):
        return f"Chat between {self.user1.username} and {self.user2.username}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages',
                                on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} in chat {self.chat.id}"
