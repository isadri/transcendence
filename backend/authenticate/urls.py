from django.urls import path

from . import views


app_name = 'authenticate'


urlpatterns = [
	path('', views.home),
]