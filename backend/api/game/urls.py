from django.urls import path
from . import views


app_name = 'game'


urlpatterns = [
  path('invite/', views.CreateGameInvite.as_view(), name='send-game-invite'),
  path('invites/', views.ListGameInvites.as_view(), name='list-game-invites'),
  path('invite/<int:pk>', views.GetGameInvite.as_view(), name='get-game-invite'),
  path('invite/<int:pk>/accept/', views.AcceptGameInvite.as_view(), name='accept-game-invite'),
  path('invite/<int:pk>/cancel/', views.CancelGameInvite.as_view(), name='cancel-game-invite'),
  path('invite/<int:pk>/decline/', views.DeclineGameInvite.as_view(), name='decline-game-invite'),

  path('invites/sent/', views.ListSentGameInvites.as_view(), name='list-sent-game-invites'),
  path('invites/received/', views.ListReceivedGameInvites.as_view(), name='list-received-game-invites'),
  path('userAchievement/', views.UserAchievement.as_view(), name='user-achievement'),
  path('userStats/', views.ListUserStats.as_view(), name='list-user-stats'),

  path('games/', views.GamesList.as_view(), name='list-user-games'),
  path('tournaments/', views.TournamentList.as_view(), name='list-user-tournaments'),
]