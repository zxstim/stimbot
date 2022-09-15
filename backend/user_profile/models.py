from django.db import models
from django.contrib.auth.models import User
import secrets
import uuid

def create_user_secret_key():
    return secrets.token_hex(30)

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='userprofile', on_delete=models.CASCADE)
    # custom fields for user
    about = models.TextField(default="", blank=True)
    secret_key = models.CharField(max_length=255, default=create_user_secret_key, blank=False)


class TradeSpotAccount(models.Model):
    """Class for monitoring spot trade account"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_balance = models.CharField(default="", max_length=255)
    coins_balance = models.JSONField()
    wallet_type = models.CharField(default="", max_length=255)
    exchange_name = models.CharField(default="", max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class BinanceSpotAccountData(models.Model):
    """Class to collect binance spot account data"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event_type = models.CharField(default="", max_length=255)
    event_time = models.CharField(default="", max_length=255)
    symbol = models.CharField(default="", max_length=255)
    event_message = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)