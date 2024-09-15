from django.contrib import admin

from .models import Friends


class FriendsAdmin(admin.ModelAdmin):
    readonly_fields = ['user', 'friends']


admin.site.register(Friends, FriendsAdmin)
