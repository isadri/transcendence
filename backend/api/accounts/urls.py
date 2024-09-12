from django.urls import path

from . import views


app_name = 'api.accounts'

urlpatterns = [
	path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('login/42auth/', views.Intra42LoginView.as_view(), name='login-42'),
    path('login/42auth/code/', views.Intra42AuthCodeView.as_view(),
        name='auth-code-42'),
    path('login/google/', views.GoogleLoginView.as_view(),
        name='login-google'),
    path('login/google/code/', views.GoogleAuthCodeView.as_view(),
        name='auth-code-google'),
    path('<str:username>/update/', views.UpdateView.as_view(), name='update'),
]
