from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    # created_at = serializers.DateTimeField(format='%b %d, %Y at %H:%M')

    class Meta:
        model = Notification
        fields = '__all__'
