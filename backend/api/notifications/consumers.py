import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_group_name = f"user_{self.user.id}_notifications"
        if self.user.is_authenticated:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        # Leave the notification group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        notification = event['data']['message']
        notification_id = event['data']['notification_id']
        notification_created_at = event['data']['notification_created_at']
        await self.send(text_data=json.dumps({
            'id': notification_id,
            'message': notification,
            'created_at': notification_created_at
        }))

    @staticmethod
    def send_friend_request_notification(user_id, message):
        """
        Sends a friend request notification to the user.
        """
        notification = Notification.objects.create(
            user_id=user_id,
            message=message,
            created_at=timezone.now(),
            is_read=False
        )
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}_notifications",
            {
                "type": "send_notification",
                "data": {
                    "message": message,
                    "notification_id": notification.id,
                    "notification_created_at": notification.created_at.strftime('%b %d, %Y at %H:%M'),
                },
            }
        )
