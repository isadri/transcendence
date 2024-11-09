from django.contrib import admin
from django.core.exceptions import PermissionDenied
from .models import Chat, Message

class MessageInline(admin.TabularInline):
    model = Message
    extra = 1
    readonly_fields = ['sender', 'content', 'timestamp']

    # Override the get_queryset method to filter messages for participants only
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Only show messages where the logged-in user is either user1 or user2 of the chat
        return qs.filter(chat__user1=request.user) | qs.filter(chat__user2=request.user)

class ChatAdmin(admin.ModelAdmin):
    list_display = ['id', 'user1', 'user2', 'created_at']
    inlines = [MessageInline]
    readonly_fields = ['created_at']
    search_fields = ['user1__username', 'user2__username']
    list_filter = ['created_at']

    # Override has_view_permission to restrict access to chat based on participants
    def has_view_permission(self, request, obj=None):
        if obj:
            if obj.user1 != request.user and obj.user2 != request.user:
                raise PermissionDenied("You do not have permission to view this chat.")
        return super().has_view_permission(request, obj)

# Registering the admin models (Only once for Chat)
admin.site.register(Chat, ChatAdmin)

class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'chat', 'sender', 'timestamp', 'content']
    readonly_fields = ['chat', 'sender', 'content', 'timestamp']
    search_fields = ['sender__username', 'content']
    list_filter = ['timestamp']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Only show messages where the logged-in user is either user1 or user2 of the chat
        return qs.filter(chat__user1=request.user) | qs.filter(chat__user2=request.user)

    def has_view_permission(self, request, obj=None):
        # Ensure the user has permission only if they are part of the chat
        if obj:
            if obj.chat.user1 != request.user and obj.chat.user2 != request.user:
                raise PermissionDenied("You do not have permission to view this chat.")
        return super().has_view_permission(request, obj)

# Registering the Message admin model
admin.site.register(Message, MessageAdmin)


