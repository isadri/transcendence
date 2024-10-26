from django.contrib import admin

from .models import Friend, FriendRequest


@admin.register(Friend)
class FriendAdmin(admin.ModelAdmin):
    readonly_fields = ['user', 'friends']


@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'when']
