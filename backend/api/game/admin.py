from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Game)
admin.site.register(UserStats)
admin.site.register(GameInvite)
admin.site.register(UserAchievement)
