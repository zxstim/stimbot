from rest_framework import serializers
from .models import UserProfile, TradeSpotAccount, BinanceSpotAccountData

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['about', 'secret_key']

class TradeSpotAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeSpotAccount
        fields = ['user', 'total_balance', 'coins_balance', 'wallet_type', 'exchange_name']

class BinanceSpotAccountDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinanceSpotAccountData
        fields = ['user', 'event_type', 'event_time', 'symbol', 'event_message']