from django.conf import settings
from django.conf.urls.static import static
from django.urls import include
from django.urls import path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


app_name = 'api.accounts'


router = routers.SimpleRouter()
router.register(r'register', views.RegisterViewSet, basename='register')
router.register(r'confirm-email', views.ConfirmEmailViewSet, basename='confirm-email')
router.register(r'login', views.LoginViewSet, basename='login')
router.register(r'login2fa', views.LoginWith2FAViewSet, basename='login-2fa')
router.register(r'verify-otp', views.VerifyOTPViewSet, basename='verify-otp')
router.register(r'logout', views.LogoutViewSet, basename='logout')
router.register(r'login/intra', views.IntraLoginViewSet,
                basename='intra-login')
#router.register(r'login/intra-2fa', views.IntraLoginWith2FAViewSet,
#                basename='intra-2fa')
router.register(r'login/google', views.GoogleLoginViewSet,
                basename='google-login')
#router.register(r'login/google-2fa', views.GoogleLoginViewSet,
#                basename='google-2fa')


urlpatterns = [
    path('', include(router.urls)),

    path('updateuserData/', views.UpdateUserDataView.as_view(), name='update-user'),
    path('updateUsername/', views.UpdateUsernameView.as_view(), name='update-username'),
    path('updateuserPass/', views.UpdateUserPasswordView.as_view(), name='update-user-pass'),
    path('deleteUser/', views.DeleteUserAccountView.as_view(), name='delete-user'),
    path('user/<str:username>/', views.UserDetailView.as_view(), name='get_user_by_username'),
    path('GetIntraLink/', views.GetIntraLink.as_view(), name='Get_Intra_Link'),
    path('GetGoogleLink/', views.GetGoogleLink.as_view(), name='Get_Google_Link'),
    path('SendOTPView/<str:username>/', views.SendOTPView.as_view(), name='Send_OTP_Email'),
    path('checkValidOtp/', views.checkValidOtp.as_view(), name='check_Valid_Otp')
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json'])


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
