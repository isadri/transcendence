# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
# from .models import Notification
# from django.utils import timezone

# def send_friend_request_notification(user_id, message):
#     print("user id is ------------> ",user_id)
#     notification = Notification.objects.create(
#         user_id=user_id,
#         message=message,
#         created_at=timezone.now(),
#         is_read=False 
#     )
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         f"user_{user_id}",
#         {
#             "type": "send_notification",
#             "data": {
#                 "message": message+"hello",
#                 "notification_id": notification.id,
#             },
#         }
#     )
#     print(f"Notification sent to group user_{user_id}_notifications")