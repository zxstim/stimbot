from rest_framework import serializers
from .models import Bot, BotLog
    
class BotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bot
        fields = ["id", "botname", "bottype", "description", "status", "variables"]

class BotLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = BotLog
        fields = ["id", "log_owner", "log_message", "description", "log_type", "created_at"]