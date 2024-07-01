from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


app_name = 'accounts'


urlpatterns = [
	path('signup/', views.RegisterView.as_view(), name='signup'),
	path('login/', views.LoginView.as_view(), name='login'),
]

#urlpatterns = format_suffix_patterns(urlpatterns)
