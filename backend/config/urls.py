from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    # File path: accounts/api/
	path('api/', include('accounts.api.urls')),

    path('admin/', admin.site.urls),

    # For 2FA
    path('', include('accounts.urls')),
]
