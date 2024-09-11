from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from api.accounts import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('api.accounts.urls')),
    path('', views.HomeView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                        document_root=settings.MEDIA_ROOT)
