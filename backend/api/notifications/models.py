from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                related_name="notifications")
    type = models.CharField(max_length=50, default="Notification")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:20]}"
