from django.urls import path
from . import views


app_name = 'game'


urlpatterns = [
  path('invite/', views.CreateGameInvite.as_view(), name='send-game-invite'),
  path('invites/', views.ListGameInvites.as_view(), name='list-game-invites'),
  path('invite/<int:id>', views.GetGameInvite.as_view(), name='get-game-invite'),
  path('accept/<int:id>', views.AcceptGameInvite.as_view(), name='accept-game-invite'),
  path('cancel/<int:id>', views.CancelGameInvite.as_view(), name='cancel-game-invite'),
  path('decline/<int:id>', views.DeclineGameInvite.as_view(), name='decline-game-invite'),
]