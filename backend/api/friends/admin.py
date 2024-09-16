from django.contrib import admin

from .models import Friend


class FriendAdmin(admin.ModelAdmin):
    readonly_fields = ['user', 'friends']


admin.site.register(Friend, FriendAdmin)
