from django.contrib import admin
from .models import Chat, Message

# Define the inline to display related messages in the Chat admin
# class MessageInline(admin.TabularInline):
#     model = Message
#     extra = 1
#     readonly_fields = ['sender', 'content', 'timestamp']  # Make fields readonly

# # Define the Chat admin to manage Chat objects in the admin interface
# class ChatAdmin(admin.ModelAdmin):
#     list_display = ['id', 'user1', 'user2', 'created_at']  # Display fields in the list view
#     inlines = [MessageInline]  # Use MessageInline to show related messages within a chat
#     readonly_fields = ['created_at']  # Make created_at readonly
#     search_fields = ['user1__username', 'user2__username']

# # Define the Message admin to manage Message objects in the admin interface
# class MessageAdmin(admin.ModelAdmin):
#     list_display = ['id', 'chat', 'sender', 'timestamp', 'content']
#     readonly_fields = ['chat', 'sender', 'content', 'timestamp']  # Make all fields readonly
#     search_fields = ['sender__username', 'content']

# Register models with their respective ModelAdmin classes
# admin.site.register(Chat, ChatAdmin)
# admin.site.register(Message, MessageAdmin)
admin.site.register(Chat)
admin.site.register(Message)
