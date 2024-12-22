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
    path('remove/<int:pk>', views.FriendRequestRemoveView.as_view(), name='remove-friend-request'),
    path('friendship-status/<int:pk>', views.FriendshipStatusView.as_view(), name='friendship-status'), #add by naima
    path('pending', views.PendingFriendRequestsView.as_view(), name='pending-friend-requests'),
    path('cancel', views.CancelFriendRequestsView.as_view(), name='cancel-friend-requests'),
    path('accepted', views.AcceptedFriendRequestsView.as_view(), name='accepted-friend-requests'),
    path('friends', views.FriendListView.as_view(), name='list-friend-requests'),
    path('blocked', views.BlockedFriendsRequestsView.as_view(), name='blocked-friends-requests'),
    path('blockedfriend/<int:pk>', views.BlockedFriendRequestsView.as_view(), name='blocked-friend-requests'),
    path('users', views.UserListView.as_view(), name='users-requests'),
    path('usersUnfriends', views.UserListUnfriendsView.as_view(), name='users-unfriends-requests'),
    path('MutualFriendsView/<str:username>', views.MutualFriendsView.as_view(), name='user-friends')
]
