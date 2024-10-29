from django.db import models
from django.db.models.fields.related import ForeignKey
from django.conf import settings

class Inbox(models.Model):
	reciever = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_inboxes")
	sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_inboxes")
	inbox_hash = models.CharField(max_length=255, unique=True)
	last_msg = models.TextField(null=True, blank=True)
	seen = models.BooleanField(default=False)
	deleted = models.BooleanField(default=False)
	unseen_nbr = models.PositiveIntegerField(default=0)
	date = models.DateTimeField(auto_now_add=True)

class Chat(models.Model):
	reciever = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_chat")
	sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_chat")
	message = models.TextField()
	file = models.FileField(upload_to='chat_files/', null=True, blank=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	# delete_user_id = models.DateTimeField(auto_now_add=True)
