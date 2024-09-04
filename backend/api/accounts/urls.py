from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


app_name = 'api.accounts'


urlpatterns = [
	path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('login/42auth/', views.LoginWith42.as_view(), name='42-auth'),

    # Get access token
	path('token/', views.MyTokenObtainTokenPairView.as_view(),
        name='token-obtain-pair'),
    # Refrech tokne
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    #path('', views.HomeView.as_view(), name='home'),
]
