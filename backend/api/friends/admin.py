from django.contrib import admin

from .models import FriendList, FriendRequest

class FriendListAdmin(admin.ModelAdmin):
    readonly_fields = ['user', 'friends']
    class Meta:
        model = FriendList

admin.site.register(FriendList, FriendListAdmin)


class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'timestamp']
    class Meta:
        model = FriendRequest

admin.site.register(FriendRequest, FriendRequestAdmin)
