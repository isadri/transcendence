from django.urls import path


from . import views


app_name = 'friends'


urlpatterns = [
    path('send/', views.FriendRequestSendView.as_view(), name='send-friend-request'),
    path('accept/<int:pk>', views.FriendRequestAcceptView.as_view(), name='accept-friend-request'),
    path('decline/<int:pk>', views.FriendRequestDeclineView.as_view(), name='decline-friend-request'),
    path('cancel/<int:pk>', views.FriendRequestCancelView.as_view(), name='cancel-friend-request'),
    path('block/<int:pk>', views.FriendRequestBlockView.as_view(), name='block-friend-request'),
    path('unblock/<int:pk>', views.FriendRequestUnblockView.as_view(), name='unblock-friend-request'),
    path('pending', views.PendingFriendRequestsView.as_view(), name='pending-friend-requests'),
    path('accepted', views.AcceptedFriendRequestsView.as_view(), name='accepted-friend-requests'),
    path('friends', views.FriendListView.as_view(), name='list-friend-requests'),
    path('blocked', views.BlockedFriendRequestsView.as_view(), name='blocked-friend-requests'),
    path('users', views.UserListView.as_view(), name='users-requests'),
]
