from django.db import models

# Create your models here.

class BinanceKline(models.Model):
    """Kline for ETH-USDT from Binance"""
    pair = models.CharField(default='NA', max_length=255)
    klinestart = models.CharField(default='NA', max_length=255)
    klineend =  models.CharField(default='NA', max_length=255)
    intervl = models.CharField(default='NA', max_length=255)
    ftradeid = models.CharField(default='NA', max_length=255)
    ltradeid = models.CharField(default='NA', max_length=255)
    op = models.CharField(default='NA', max_length=255)
    cl = models.CharField(default='NA', max_length=255)
    hi = models.CharField(default='NA', max_length=255)
    lo = models.CharField(default='NA', max_length=255)
    bassetvol = models.CharField(default='NA', max_length=255)
    numoftrades = models.CharField(default='NA', max_length=255)
    klineclosed = models.CharField(default='NA', max_length=255)
    qassetvol = models.CharField(default='NA', max_length=255)
    takerbuybassetvol = models.CharField(default='NA', max_length=255)
    takerbuyqassetvol = models.CharField(default='NA', max_length=255)
    b = models.CharField(default='NA', max_length=255)