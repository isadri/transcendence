import json

from django.db.models.query_utils import Q
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_group_name = f"chat_room_of_{self.user.id}"

        # Check if the user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        # Verify if the user is part of the chat (either as user1 or user2)
        # try:
        #     self.chat = await self.get_chat()
        #     if not self.is_in_chat():
        #         await self.close()
        #         return
        # except Chat.DoesNotExist:
        #     await self.close()
        #     return

        # Join the chat room group
        await self.channel_layer.group_add( # Adds the WebSocket connection to a group named chat_<user_id>.
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
        receiver_id = data.get('receiver')

        # Check if the user is exist
        # receiver = None
        try:
            receiver = await User.objects.aget(id=receiver_id)
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'This user does not exist.'
            }))

        # Get or create the chat instance
        # chat, _ = await Chat.objects.aget_or_create(
        #     Q(user1=self.user, user2=receiver) |
        #     Q(user1=receiver, user2=self.user)
        # )

        # try:
        #     chat = await Chat.objects.aget(
        #         Q(user1=self.user, user2=receiver) |
        #         Q(user1=receiver, user2=self.user)
        #     )
        # except Chat.DoesNotExist:
        #     chat = await Chat.objects.acreate(user1=self.user, user2=receiver)


        chat = await Chat.objects.filter(
            Q(user1=self.user, user2=receiver) |
            Q(user1=receiver, user2=self.user)
        ).afirst()  # Fetch the first match asynchronously

        if not chat:
            chat = await Chat.objects.acreate(
                user1=self.user,
                user2=receiver
            )


        new_message = await Message.objects.acreate(
            chat=chat,
            sender=self.user,
            receiver=receiver,
            content=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'chat_id': chat.id,
                'sender_id': self.user.id,
                'receiver_id': receiver.id
            }
        )

        receiver_room = f"chat_room_of_{receiver.id}"
        await self.channel_layer.group_send(
            receiver_room,
            {
                'type': 'chat_message',
                'message': message,
                'chat_id': chat.id,
                'sender_id': self.user.id,
                'receiver_id': receiver.id
            }
        )
        chat.last_message = message
        await database_sync_to_async(chat.save)()

    async def chat_message(self, event):
        # Send message to websocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'chat_id': event['chat_id'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id']
        }))