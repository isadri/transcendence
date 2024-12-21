from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('notifications/', views.NotificationListView.as_view(), name='notifications-list'),
    path('unreadNotifications/', views.UnreadNotifications.as_view(), name='notifications-unread'),
    path('mark-all-read/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    path('clear-all-notif/', views.ClearAllNotificationsView.as_view(), name='clear-all-notifications'),
]