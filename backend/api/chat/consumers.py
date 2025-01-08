from ..friends.models import FriendRequest
import json
from django.db.models.query_utils import Q
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.db import transaction

from ..notifications.consumers import NotificationConsumer
from ..notifications.models import Notification
from django.utils import timezone

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.isBlocked = False
        self.isBlockedPayload = None

        # Check if the user is authenticated
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return

        self.room_group_name = f"chat_room_of_{self.user.id}"
        self.user.open_chat = True
        await self.user.asave()
        # Join the chat room group
        await self.channel_layer.group_add( # Adds the WebSocket connection to a group named chat_<user_id>.
            self.room_group_name,
            self.channel_name 
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the chat room group
        if not self.user:
            return
        self.user.open_chat = False
        await self.user.asave()
        await self.handle_reset_active_chat()
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def handle_reset_active_chat(self):
        try:
            self.user.active_chat = -1
            await database_sync_to_async(self.user.save)()
        except Exception as e:
            await self.send(text_data=json.dumps({
                'error': 'resetting active chat:'
            }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('message_type')

        if not message_type:
            await self.send(text_data=json.dumps({'error': 'Invalid message type.'}))
            return

        if (message_type == "send_message"):
            await self.handle_send_message(data)

        if (message_type == "block_friend" or self.isBlocked):
            data = self.isBlockedPayload if self.isBlocked else data
            await self.handle_block_friend(data)
        if (message_type == "active_chat"):
            chat_id = data.get('chat_id')
            if not chat_id:
                await self.send(text_data=json.dumps({'error': 'Invalid chat id.'}))
                return
            if chat_id == -1:
                await self.handle_reset_active_chat()
            else:
                await self.handle_active_chat(chat_id)
        if (message_type == "mark_is_read"):
            chat_id = data.get('chat_id')
            if not chat_id:
                await self.send(text_data=json.dumps({'error': 'Invalid chat id.'}))
                return
            await self.handle_mark_is_read(chat_id)

    async def handle_mark_is_read(self, chat_id):
        try:
            chat = await database_sync_to_async(Chat.objects.get)(id=chat_id)

            # Check if the current user is user1 or user2
            user1 = await database_sync_to_async(lambda: chat.user1)()
            if self.user.id == user1.id:
                chat.nbr_of_unseen_msg_user1 = 0
            else:
                chat.nbr_of_unseen_msg_user2 = 0
            await chat.asave()

            # Send a response back to the client
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'update_unseen_message',
                    'status': False,
                    'chat_id': chat.id,
                    'nbr_of_unseen_msg_user1': chat.nbr_of_unseen_msg_user1,
                    'nbr_of_unseen_msg_user2': chat.nbr_of_unseen_msg_user2,
                }
            )

        except Chat.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'Chat does not exist.'
            }))

    async def update_unseen_message(self, event):
        state = event.get('status', False)  # Determine if there are unseen messages
        await self.send(text_data=json.dumps({
            'type': 'update_unseen_message',
            'chat_id': event['chat_id'],
            'nbr_of_unseen_msg_user1': event.get('nbr_of_unseen_msg_user1', 0),
            'nbr_of_unseen_msg_user2': event.get('nbr_of_unseen_msg_user2', 0),
            'status': state,
        }))

    async def handle_active_chat(self, chat_id):
        try:
            self.user.active_chat = chat_id
            await database_sync_to_async(self.user.save)()

        except Chat.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'Chat does not exist.'
            }))

    async def handle_block_friend(self, data):
        chat_id = data.get('chat_id')
        blocker = data.get('blocker')
        blocked = data.get('blocked')
        status = data.get('status')
        try:
            if (not chat_id or not blocked or not blocker):
                await self.send(text_data=json.dumps({'error': 'Invalid'}))
                return
            if (int(blocker) != self.user.id):
                await self.send(text_data=json.dumps({'error': 'You cannot block'}))
                return
            if (blocked == blocker):
                await self.send(text_data=json.dumps({'error': 'You cannot block yourself'}))
                return
            chat = await database_sync_to_async(Chat.objects.get)(id=chat_id)

            user1, user2 = await self.get_users_from_chat(chat)
            if ((user1.id != int(blocked) and user1.id != int(blocker)) or (user2.id != int(blocked) and user2.id != int(blocker))):
                await self.send(text_data=json.dumps({'error': 'You are not a member of that chat.'}))
                return
            try:
                blocker_user = await database_sync_to_async(User.objects.get)(id=blocker)
                blocked_user = await database_sync_to_async(User.objects.get)(id=blocked)
            except User.DoesNotExist:
                await self.send(text_data=json.dumps({
                    'error': 'This user does not exist.'
                }))
                return

            if (status == True and chat.blocke_state_user1 != 'none' and chat.blocke_state_user2 != 'none'):
                await self.send(text_data=json.dumps({'error': 'You cannot block this user.'}))
                return

            friend_request = await FriendRequest.objects.filter(
            Q(sender_id=blocker, receiver_id=blocked) |
            Q(sender_id=blocked, receiver_id=blocker)
            ).afirst()

            friend_request_unblock = await FriendRequest.objects.filter(
                    Q(sender_id=blocker, receiver_id=blocked) |
                    Q(sender_id=blocked, receiver_id=blocker),
                    status='blocked',
                    blocked_by=blocker_user,
                    ).afirst()
            if status == True:
                if (user1.id == blocked):
                    chat.blocke_state_user1 = "blocked"
                    chat.blocke_state_user2 = "blocker"
                elif (user1.id == blocker): 
                    chat.blocke_state_user1 = "blocker"
                    chat.blocke_state_user2 = "blocked"
                if friend_request:
                    await friend_request.block_async(blocker_user)
                else:
                    await FriendRequest.objects.acreate(
                        sender=blocker_user,
                        receiver=blocked_user,
                        status='blocked',
                        blocked_by=blocker_user
                    )
            elif status == False:
                if not friend_request_unblock:
                    await self.send(text_data=json.dumps({'error': 'No blocked request found.'}))
                    return
                await friend_request_unblock.unblock_async(blocker_user)
                await database_sync_to_async(friend_request_unblock.delete)()
                chat.blocke_state_user1 = "none"
                chat.blocke_state_user2 = "none"
                self.isBlocked = False
                self.isBlockedPayload = None
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
            'status': event['status']
        }))

    async def reciver_blocked(self, receiver:User):
        try:
            blocked_request = await FriendRequest.objects.aget(
                Q(sender=self.user, receiver=receiver, status='blocked') |  # User blocked target
                Q(sender=receiver, receiver=self.user, status='blocked')   # Target blocked user
            )
            return (blocked_request , True)
        except:
            return (None, False)
    
    @database_sync_to_async
    def send_block_status(self, chat, blocked_req, is_blocked):
        blocker = blocked_req.blocked_by
        blocked = blocked_req.sender if blocked_req.blocked_by != blocked_req.sender else blocked_req.receiver

        payload = {
            'chat_id': chat.id,
            'blocker': blocker.id,
            'blocked': blocked.id,
            'status': is_blocked
        }
        return payload



    async def handle_send_message(self, data):
        message = data.get('message')
        receiver_id = data.get('receiver')
        if not message:
            await self.send(text_data=json.dumps({'error': 'Invalid message.'}))
            return
        if isinstance(receiver_id, int):
            pass
        elif receiver_id and receiver_id.isdigit():
            receiver_id = int(receiver_id)
        else:
            await self.send(text_data=json.dumps({'error': 'Invalid receiver_id.'}))
            return
        try:
            receiver = await User.objects.aget(id=receiver_id)
        except User.DoesNotExist:
            await self.send(text_data=json.dumps({
                'error': 'This user does not exist.'
            }))
            return
        if self.user.id == receiver_id:
            await self.send(text_data=json.dumps({'error': 'You cannot send to yourself.'}))
            return
        chat = await Chat.objects.filter(
            Q(user1=self.user, user2=receiver) |
            Q(user1=receiver, user2=self.user)
        ).afirst()

        if not chat:
            chat = await Chat.objects.acreate(
                user1=self.user,
                user2=receiver
            )

        if self.is_blocked(chat):
            await self.send(text_data=json.dumps({"error": "You can't send message to that user."}))
            return
        blocked_req , is_blocked= await self.reciver_blocked(receiver)
        if  blocked_req and is_blocked:
            self.isBlockedPayload = await self.send_block_status(chat ,blocked_req, is_blocked)
            self.isBlocked = True
            return
        if not is_blocked:
            self.isBlocked = False
            self.isBlockedPayload = None


        new_message = await Message.objects.acreate(
            chat=chat,
            sender=self.user,
            receiver=receiver,
            content=message
        )

        await self.update_unseen_messages(chat, receiver)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'chat_id': chat.id,
                'sender_id': self.user.id,
                'receiver_id': receiver.id,
                'nbr_of_unseen_msg_user1': chat.nbr_of_unseen_msg_user1,
                'nbr_of_unseen_msg_user2': chat.nbr_of_unseen_msg_user2,
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
                'receiver_id': receiver.id,
                'nbr_of_unseen_msg_user1': chat.nbr_of_unseen_msg_user1,
                'nbr_of_unseen_msg_user2': chat.nbr_of_unseen_msg_user2,
            }
        )
        if (receiver.open_chat == False):
            print("------->", receiver.open_chat)
            msg = f"You have a new message from {self.user.username}!"
            notification = await Notification.objects.acreate(
                user_id=receiver_id,
                message=msg,
                type= "Message",
                is_read=False
            )
            await NotificationConsumer.send_friend_request_notificationChat(receiver_id, msg, notification.id, notification.type, notification.created_at)

        chat.last_message = message
        await chat.asave()

    async def update_unseen_messages(self, chat, receiver):
        if chat.id != receiver.active_chat:
            user1 = await database_sync_to_async(lambda: chat.user1)()
            if receiver.id == user1.id:
                chat.nbr_of_unseen_msg_user1 += 1
            else:
                chat.nbr_of_unseen_msg_user2 += 1
            receiver_room = f"chat_room_of_{receiver.id}"
            await self.channel_layer.group_send(
            receiver_room,
            {
                'type': 'update_unseen_message',
                'status': True,
                'chat_id': chat.id,
                'nbr_of_unseen_msg_user1': chat.nbr_of_unseen_msg_user1,
                'nbr_of_unseen_msg_user2': chat.nbr_of_unseen_msg_user2,
            })
        await chat.asave()

    async def chat_message(self, event):
        # Send message to websocket
        await self.send(text_data=json.dumps({
            'type': 'send_message',
            'message': event['message'],
            'chat_id': event['chat_id'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id'],
            'nbr_of_unseen_msg_user1': event['nbr_of_unseen_msg_user1'],
            'nbr_of_unseen_msg_user2': event['nbr_of_unseen_msg_user2'],
        }))

    def is_blocked(self, chat):
        """
        Checks if the current user or the other user is blocked.
        """
        return (
            chat.blocke_state_user1 == 'blocked' or 
            chat.blocke_state_user2 == 'blocked'
        )