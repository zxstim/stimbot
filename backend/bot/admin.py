from django.contrib import admin
from .models import Bot
# Register your models here.

class BotAdmin(admin.ModelAdmin):
    list_display = ('owner', 'botname', 'bottype', 'status')
    search_fields = ('owner__id',)
    
admin.site.register(Bot, BotAdmin)
