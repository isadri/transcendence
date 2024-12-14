import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the user from the scope and create a group name
        self.user = self.scope['user']
        self.room_group_name = f"user_{self.user.id}_notifications"

        # Join the notification group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the notification group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        # Send notification to WebSocket
        notification = event['message']
        await self.send(text_data=json.dumps({
            'message': notification
        }))
