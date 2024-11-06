# from rest_framework import serializers
# from .models import Inbox, Chat

# class InboxSerializer(serializers.ModelSerializer):
# 	reciever_username = serializers.CharField(source="reciever.username", read_only=True)
# 	sender_username = serializers.CharField(source="sender.username", read_only=True)
# 	class Meta:
# 		model = Inbox
# 		fields = ['id', 'reciever', 'reciever_username', 'sender', 'sender_username', 
# 		'inbox_hash', 'last_msg', 'seen', 'deleted', 'unseen_nbr', 'date']

# class ChatSerializer(serializers.ModelSerializer):
#     reciever_username = serializers.CharField(source='reciever.username', read_only=True)
#     sender_username = serializers.CharField(source='sender.username', read_only=True)
#     file_url = serializers.FileField(source='file', read_only=True)
#     image_url = serializers.ImageField(source='image', read_only=True)

#     class Meta:
#         model = Chat
#         fields = [
#             'id', 'reciever', 'reciever_username', 'sender', 'sender_username',
#             'message', 'file', 'file_url', 'image', 'image_url', 'timestamp'
#         ]


from rest_framework import serializers
from .models import Chat, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'timestamp']

class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2', 'created_at', 'messages']
