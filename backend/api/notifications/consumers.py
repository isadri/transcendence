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
            self.user.is_online = True
            await self.user.asave(update_fields=['is_online'])
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        # Leave the notification group
        self.user.is_online = False
        await self.user.asave(update_fields=['is_online'])
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        notification = event['data']['message']
        notification_type = event['data']['type']
        print("notification_type ====> ", notification_type)
        notification_id = event['data']['notification_id']
        notification_created_at = event['data']['notification_created_at']
        await self.send(text_data=json.dumps({
            'id': notification_id,
            'message': notification,
            'type': notification_type,
            'created_at': notification_created_at
        }))

    @staticmethod
    def send_friend_request_notification(user_id, message, type):
        """
        Sends a friend request notification to the user.
        """
        print("type ===> ", type)
        notification = Notification.objects.create(
            user_id=user_id,
            message=message,
            type=type,
            created_at=timezone.now(),
            is_read=False
        )
        channel_layer = get_channel_layer()
        created_at_iso = notification.created_at.isoformat()
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}_notifications",
            {
                "type": "send_notification",
                "data": {
                    "message": message,
                    "type" : type,
                    "notification_id": notification.id,
                    "notification_created_at": created_at_iso,
                },
            }
        )
    @staticmethod
    async def send_friend_request_notificationChat(user_id, message, notification_id, type, created_at):
        """
        Sends a friend request notification to the user.
        """
        print("type ===> ", type)
        created_at_iso = created_at.isoformat()
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            f"user_{user_id}_notifications",
            {
                "type": "send_notification",
                "data": {
                    "message": message,
                    "type" : type,
                    "notification_id": notification_id,
                    "notification_created_at": created_at_iso,
                },
            }
        )
