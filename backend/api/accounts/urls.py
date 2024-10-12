from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


app_name = 'api.accounts'

urlpatterns = [
	path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('login2fa/', views.LoginWith2FAView.as_view(), name='login-2fa'),
    path('otp-verify/', views.VerifyOTPView.as_view(), name='opt-verify'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # The frontend should redirect the user to one of these two apis
    # For login with 42, the frontend should redirect the user to the
    # endpoint:
    # 'https://api.intra.42.fr/oauth/authorize?'
    #                   'client_id={"INTRA_ID"}'
    #                   '&redirect_uri={"INTRA_REDIRECT_URI"}'
    #                   '&state={settings.OAUTH2_STATE_PARAMETER}'
    #                   '&response_type=code'
    # For Google:
    #'https://accounts.google.com/o/oauth2/v2/auth?'
    #                   'client_id={"GOOGLE_ID")}'
    #                   '&redirect_uri={"GOOGLE_REDIRECT_URI")}'
    #                   '&state={settings.OAUTH2_STATE_PARAMETER}'
    #                   '&scope=openid profile email&response_type=code'
    #                   '&display=popup'
    path('login/intra.42/', views.IntraLoginView.as_view(), name='login-42'),
    path('login/google/', views.GoogleLoginView.as_view(),
        name='login-google'),
    path('<str:username>/update/', views.UpdateView.as_view(), name='update'),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json'])


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
