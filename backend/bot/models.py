from django.db import models
from django.db.models import JSONField
from django.contrib.auth.models import User
from django_cryptography.fields import encrypt

# Create your models here.

STATUS_CHOICES = [
    ('active', 'Active'),
    ('inactive', 'Inactive'),
]

class Bot(models.Model):
    """Class for create bot and control bot"""
    botname = models.CharField(max_length=255, db_index=True)
    bottype = models.CharField(max_length=255, db_index=True)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(choices=STATUS_CHOICES, max_length=255, default='inactive')
    variables = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner}, {self.botname}, {self.bottype}, {self.status}"

class BotLog(models.Model):
    log_owner = models.ForeignKey(Bot, on_delete=models.CASCADE)
    log_message = models.JSONField()
    description = models.TextField(default="")
    log_type = models.CharField(default="", max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)