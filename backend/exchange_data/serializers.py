from rest_framework import serializers
from .models import BinanceKline

class BinanceKlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinanceKline
        fields = ["pair", "klinestart", "klineend", "intervl", "ftradeid", "ltradeid", "op", "cl", "hi", "lo", "bassetvol", "numoftrades", "klineclosed", "qassetvol", "takerbuybassetvol", "takerbuyqassetvol", "b"]