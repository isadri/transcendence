from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views


urlpatterns = [
	path('', views.home, name='home'),
	#path('signup/', views.RegisterView.as_view(), name='singup'),
	#path('api-token-auth/', views.LoginView.as_view()),
	path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

#urlpatterns = format_suffix_patterns(urlpatterns)
