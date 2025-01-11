from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path

from api.accounts import views


def health(request):
    return HttpResponse({}, status=200)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health),
    path('api', views.HomeView.as_view()),
    path('api/chat/', include('api.chat.urls')),
    path('api/game/', include('api.game.urls')),
    path('api/friends/', include('api.friends.urls')),
    path('api/accounts/', include('api.accounts.urls')),
    path('api/notifications/', include('api.notifications.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                        document_root=settings.MEDIA_ROOT)
