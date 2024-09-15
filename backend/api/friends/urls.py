from django.urls import path


from . import views


app_name = 'friends'


urlpatterns = [
    path('add/', views.FriendAddView.as_view(), name='new'),
    #path('<str:username>/detail/', views.FriendDetailView.as_view(),
    #     name='detail'),
    path('', views.FriendListView.as_view(), name='list'),
]
