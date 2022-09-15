from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework import pagination
from .models import UserProfile
from .serializers import UserProfileSerializer
import time
import secrets
from django.contrib.auth.models import User

# Create your views here.


def create_user_secret_key():
    return secrets.token_hex(30)

@api_view(['GET'])
def generate_secret_key_for_user(request):
    """
    Timestamp
    """
    secret_key = create_user_secret_key()
    nonce = str(int(time.time()))
    return Response({"secret_key": secret_key + nonce}, status=status.HTTP_200_OK)


class UserProfileDetails(APIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, user):
        try:
            return UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return None

    def get(self, request, format=None):
        '''
        Retrieve bot with given bot_id
        '''
        user_to_retrieve = self.get_object(user=request.user)
        if not user_to_retrieve:
            return Response(
                {"Failed": "User does not exists"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserProfileSerializer(user_to_retrieve)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        '''
        Create user profile 
        '''
        user_to_retrieve = self.get_object(user=request.user)
        if not user_to_retrieve:
            serializer = UserProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(
                    serializer.data, 
                    status=status.HTTP_201_CREATED
                )
        else:
            return Response(
                {"Failed": "User profile exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, format=None):
        '''
        Change user profile 
        '''
        user_to_retrieve = self.get_object(user=request.user)
        if not user_to_retrieve:
            return Response(
                {"Failed": "User does not exists"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserProfileSerializer(instance=user_to_retrieve, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


