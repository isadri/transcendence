from django.urls import path

from . import views


urlpatterns = [
    path('set_cookie', views.set_cookie),
    path('get_cookie/<str:key>/', views.get_cookie),
    path('delete_cookie', views.delete_cookie),
    path('set_test', views.set_test),
    path('check', views.test_worked),
    path('', views.HomeView.as_view(), name='home'),
]
