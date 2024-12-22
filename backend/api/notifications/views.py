from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class UnreadNotifications(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_notifications_count': unread_count})

class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': f'{updated_count} notifications marked as read.'})

class ClearAllNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user_notifications = Notification.objects.filter(user=request.user)
        
        if user_notifications.exists():
            user_notifications.delete()
            return Response({"message": "All your notifications have been cleared."}, status=200)
        else:
            return Response({"message": "You have no notifications to clear."}, status=200)