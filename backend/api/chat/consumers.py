import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f"chat_{self.chat_id}"

        # Check if the user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        # Verify if the user is part of the chat (either as user1 or user2)
        try:
            self.chat = await self.get_chat()
            if not self.is_in_chat():
                await self.close()
                return
        except Chat.DoesNotExist:
            await self.close()
            return

        # Join the chat room group
        await self.channel_layer.group_add( # Adds the WebSocket connection to a group named chat_<chat_id>.
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the chat room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')

        # Check if the user is still a part of the chat
        if not self.is_in_chat():
            await self.send(text_data=json.dumps({
                'error': 'You are not a participant in this chat.'
            }))
            return

        # Save the message to the database
        Message.objects.create(chat=self.chat, sender=self.user, content=message)

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': self.user.id,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
        }))

    async def get_chat(self):
        """Fetch the chat instance asynchronously."""
        return await Chat.objects.aget(id=self.chat_id)

    def is_in_chat(self):
        """Check if the user is either user1 or user2 in the chat."""
        return self.chat.user1 == self.user or self.chat.user2 == self.user
