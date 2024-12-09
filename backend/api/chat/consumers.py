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
        message_type = data.get('message_type')

        if not message_type:
            await self.send(text_data=json.dumps({'error': 'Invalid message type.'}))
            return

        if (message_type == "send_message"):
            message = data.get('message')
            receiver_id = data.get('receiver')
            await self.handle_send_message(receiver_id, message)

        elif (message_type == "block_friend"):
            chat_id = data.get('chat_id')
            blocker = data.get('blocker')
            blocked = data.get('blocked')
            status = data.get('status')
            await self.handle_block_friend(chat_id, blocker, blocked, status)

    async def handle_block_friend(self, chat_id, blocker, blocked, status):
        try:
            chat = await database_sync_to_async(Chat.objects.get)(id=chat_id)

            user1, user2 = await self.get_users_from_chat(chat)

            if status == True:
                if (user1.id == blocked):
                    chat.blocke_state_user1 = "blocked"
                    chat.blocke_state_user2 = "blocker"
                else:
                    chat.blocke_state_user1 = "blocker"
                    chat.blocke_state_user2 = "blocked"
            elif status == False:
                chat.blocke_state_user1 = "none"
                chat.blocke_state_user2 = "none"

            await chat.asave()

            blocker_room = f"chat_room_of_{blocker}"
            blocked_room = f"chat_room_of_{blocked}"
            relation_status = self.is_blocked(chat)

            payload = {
                'type': 'block_status_update',
                'chat_id': chat_id,
                'blocker': blocker,
                'blocked': blocked,
                'status': relation_status
            }

            await self.channel_layer.group_send(blocker_room, payload)
            await self.channel_layer.group_send(blocked_room, payload)

        except Chat.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'Chat does not exist.'
            }))

    async def get_users_from_chat(self, chat):
        # Wrap user access in async-safe method
        user1 = await database_sync_to_async(lambda: chat.user1)()
        user2 = await database_sync_to_async(lambda: chat.user2)()
        return user1, user2

    async def block_status_update(self, event):
        """
        Sends block/unblock updates to the client.
        """
        await self.send(text_data=json.dumps({
            'type': 'block_status_update',
            'chat_id': event['chat_id'],
            'blocker': event['blocker'],
            'blocked': event['blocked'],
            'status': event['status']  # true if blocked, false otherwise
        }))




        # elif (message_type == "delete_chat") :
        #     print("-----hellloo")
        #     if chat.id:
        #         await self.handle_delete_chat(chat.id)

    # async def handle_delete_chat(self, chat_id):
    #     # Delete the chat from the database
    #     try:
    #         chat = Chat.objects.get(id=chat_id)
    #         chat.delete()
    #         # Broadcast to all connected clients
    #         await self.channel_layer.group_send(
    #             self.group_name,
    #             {
    #                 "type": "delete_chat",
    #                 "chat_id": chat_id,
    #             },
    #         )
    #     except Chat.DoesNotExist:
    #         pass

    # async def chat_deleted(self, event):
    #     await self.send(text_data=json.dumps({
    #         "type": "delete_chat",
    #         "chat_id": event["chat_id"]
    #     }))

    async def handle_send_message(self, receiver_id, message):
        try:
            receiver = await User.objects.aget(id=receiver_id)
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'This user does not exist.'
            }))
            return

        chat = await Chat.objects.filter(
            Q(user1=self.user, user2=receiver) |
            Q(user1=receiver, user2=self.user)
        ).afirst()  # Fetch the first match asynchronously

        if not chat:
            chat = await Chat.objects.acreate(
                user1=self.user,
                user2=receiver
            )

        if self.is_blocked(chat):
            await self.send(text_data=json.dumps({"error": "You can't send message to that user."}))
            return

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
        await chat.asave()

    async def chat_message(self, event):
        # Send message to websocket
        await self.send(text_data=json.dumps({
            'type': 'send_message',
            'message': event['message'],
            'chat_id': event['chat_id'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id']
        }))

    def is_blocked(self, chat):
        """
        Checks if the current user or the other user is blocked.
        """
        return (
            chat.blocke_state_user1 == 'blocked' or 
            chat.blocke_state_user2 == 'blocked'
        )