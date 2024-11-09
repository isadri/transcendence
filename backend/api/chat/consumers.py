# import json

# from django.http import response
# from channels.generic.websocket import AsyncWebsocketConsumer
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def websocker_connect(self, event):
#         print('connected', event)
#         user = self.scope['user']
#         chat_room = f'user_chatroom_{user.id}'
#         self.chat_room = chat_room
#         await self.channels_layer.group_add(
#             chat_room,
#             self.channel_name
#         )
#         await self.send({
#             'type': 'websocket.accept'
#         })


#     async def websocker_receive(self, event):
#         print('received', event)
#         received_data = json.loads(event['text'])
#         msg = received_data.get('message')
#         sent_by_id = received_data.get('sent_by')
#         send_to_id = received_data.get('send_to')
#         if not msg:
#             print('Error:: empty message')
#             return False

#         sent_by_user = await self.get_user_object(sent_by_id)
#         sent_to_user = await self.get_user_object(send_to_id)
#         if not send_to_id:
#             print('Error:: send to user is incorrect')
#         if not sent_by_id:
#             print('Error:: sent by user is incorrect')


#         other_user_chat_room = f'user_chatroom_{send_to_id}'
#         self_user = self.scope['user']

#         response = {
#             'message':  msg,
#             'sent_by': self_user.id
#         }

#         await self.channels_layer.group_send(
#             other_user_chat_room,
#             {
#                 'type': 'chat_message',
#                 'text': json.dumps(response)
#             }
#         )

#         await self.channels_layer.group_send(
#             self.chat_room,
#             {
#                 'type': 'chat_message',
#                 'text': json.dumps(response)
#             }
#         )

#     async def websocker_disconnect(self, event):
#         print('disconnected', event)

#     async def chat_message(self, event):
#         print('chat_message', event)
#         await self.send({
#             'type': 'websocket.send',
#             'text': event['text']
#         }
#         )

#     @database_sync_to_async
#     def get_user_object(self, user_id):
#         qs = User.objects.filter(id=user_id)
#         if qs.exists():
#             obj = qs.first()
#         else:
#             obj = None
#         return obj





# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f"chat_{self.chat_id}"

        # Join the chat room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the chat room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message'] 
        sender_id = self.user.id

        # Save the message to the database
        chat = Chat.objects.get(id=self.chat_id)
        Message.objects.create(chat=chat, sender_id=sender_id, content=message)

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
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

