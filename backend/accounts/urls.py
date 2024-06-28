from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


app_name = 'accounts'


urlpatterns = [
	path('signup/', views.SignUpView.as_view(), name='signup'),
]

#urlpatterns = format_suffix_patterns(urlpatterns)
