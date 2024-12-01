from django.conf import settings
from django.db import models
from django.db.models import UniqueConstraint
from django.utils.timesince import timesince

class Chat(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chats_as_user1',
                              on_delete=models.CASCADE)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='chats_as_user2',
                              on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_message = models.TextField(null=True, blank=True)

    class Meta:
        constraints = [
            UniqueConstraint(fields=['user1', 'user2'], name='unique_chat'),
            UniqueConstraint(fields=['user2', 'user1'], name='unique_chat_reverse')
        ]

    def __str__(self):
        return f"Chat between {self.user1.username} and {self.user2.username}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages',
                                on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    file = models.FileField(upload_to='chat_files/%y/%m/%d', null=True, blank=True)
    image = models.ImageField(upload_to='chat_files/%y/%m/%d', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def formatted_close_time(self):
        # HH:MM AM/PM
        return self.created_at.strftime("%I:%M %p")

    def formatted_far_time(self):
        # November 17, 2024
        return self.created_at.strftime("%B %d, %Y")

    def human_readable_time(self):
        # 5 minutes ago
        return timesince(self.timestamp)

    def __str__(self):
        return f"Message from {self.sender.username} in chat {self.chat.id}"
