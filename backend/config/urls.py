from django.contrib import admin
from django.urls import include, path

from api.accounts import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('api.accounts.urls')),
    path('', views.HomeView.as_view()),
]
