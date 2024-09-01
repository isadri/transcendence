from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from two_factor.urls import urlpatterns as tf_urls

from . import views


urlpatterns = [
    path('', include(tf_urls)),
    # Sign up
	path('accounts/register/', views.RegisterView.as_view(), name='register'),
    path('accounts/login/', views.LoginView.as_view(), name='login'),
    path('accounts/logout/', views.LogoutView.as_view(), name='logout'),

    # Get access token
	path('accounts/token/', views.MyTokenObtainTokenPairview.as_view(), name='token_obtain_pair'),
    # Refrech tokne
    path('accounts/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
