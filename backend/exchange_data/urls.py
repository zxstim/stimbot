from django.urls import path
from . import views

urlpatterns = [
    # path('binanceethusdtkline/', views.BinanceEthUsdtKlineList.as_view(), name="binance-ethusdt-kline"),
    path('binancekline/<str:pair>/<int:rows>/', views.BinanceKlineDetails.as_view(), name="binance-kline-details"),
    path('binancekline/', views.BinanceKlineList.as_view(), name="binance-kline-list"),
] 