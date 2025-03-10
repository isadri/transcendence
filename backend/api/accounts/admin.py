from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = [
        'username', 'email', 'avatar', 'remote_id', 'register_complete', 'email_verified',
         'from_remote_api'
    ]
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('avatar',)}),
        ('Permissions', {'fields': ('is_staff',)}),
    )


admin.site.register(User, UserAdmin)
