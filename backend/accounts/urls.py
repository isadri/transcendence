from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
	path('signup/', views.RegisterView.as_view()),
	path('api-token-auth/', views.LoginView.as_view()),
]

#urlpatterns = format_suffix_patterns(urlpatterns)
