from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.conf import settings
from .serializers import BinanceKlineSerializer
from .models import BinanceKline
from django.core.cache import cache


class BinanceKlineList(APIView):
    """
    API to create binance kline
    """
    serializer_class = BinanceKlineSerializer

    def post(self, request, format=None):
        '''
        Create new kline with provided data
        '''
        if request.META['HTTP_API_SECRET'] == settings.API_SECRET:
            serializer = BinanceKlineSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"Success": "Data has been updated"}, 
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {'Error': 'Bad request'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class BinanceKlineDetails(APIView):
    """
    API to fetch binance kline
    """
    serializer_class = BinanceKlineSerializer

    def get(self, request, pair, rows, *args, **kwargs):
        '''
        Get kline with provided data
        '''
        if request.META['HTTP_API_SECRET'] == settings.API_SECRET:
            kline_to_retrieve = BinanceKline.objects.filter(pair=pair).order_by('-id')[:rows]
            serializer = BinanceKlineSerializer(kline_to_retrieve, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {'Error': 'Bad request'}, 
                status=status.HTTP_400_BAD_REQUEST
            )