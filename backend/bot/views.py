from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .permissions import IsOwner
from .serializers import BotSerializer, BotLogSerializer
from rest_framework import pagination
from .models import Bot, BotLog
from user_profile.models import UserProfile
from user_profile.serializers import UserProfileSerializer
import json
import os
import hmac
import hashlib
import time

def check_signature(client_nonce, client_signature, secret_key, message):
    server_nonce = int(time.time())
    nonce_difference = server_nonce - int(client_nonce)
    server_signature = hmac.new(bytes(secret_key.encode()), message.encode(), hashlib.sha256).hexdigest()
    if hmac.compare_digest(server_signature, client_signature) and nonce_difference < 10:
        return True
    else:
        return False


class BotList(APIView):
    serializer_class = BotSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        '''
        Get all bots belongs to user
        '''
        bot_list = Bot.objects.filter(owner=request.user)
        serializer = BotSerializer(bot_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        '''
        Create bot with provided data 
        '''
        serializer = BotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            f = open(f"/lib/systemd/system/bot{serializer.data['id']}.service", 'w+')
            f.write(
            f"""Description=bot{serializer.data['id']}
            After=multi-user.target
            Conflicts=getty@tty1.service

            [Service]
            Type=simple
            ExecStart=/insert/your/environment/path/bin/python3 /insert/your/project/path/scripts/bot{serializer.data['id']}.py
            StandardInput=tty-force

            [Install]
            WantedBy=multi-user.target"""
            )
            str_terminal = f'sudo systemctl daemon-reload'
            os.system(str_terminal)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BotDetails(APIView):
    permission_classes = [permissions.IsAuthenticated,]

    def get_object(self, bot_id, owner):
        try:
            return Bot.objects.get(id=bot_id, owner=owner)
        except Bot.DoesNotExist:
            return None
    # @extend_schema(request=None, responses=EmptyPayloadResponseSerializer)
    def get(self, request, bot_id, *args, **kwargs):
        '''
        Retrieve bot with given bot_id
        '''
        bot_to_retrieve = self.get_object(bot_id, owner=request.user)
        if not bot_to_retrieve:
            return Response(
                {"Failed": "Bot ID does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BotSerializer(bot_to_retrieve)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 4. Update
    def put(self, request, bot_id, *args, **kwargs):
        '''
        Updates bot with given bot_id if exists
        '''
        bot_to_update = self.get_object(bot_id, owner=request.user)
        if not bot_to_update:
            return Response(
                {"Failed": "Bot ID does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'botname': request.data['botname'],
            'bottype': request.data['bottype'],
            'description': request.data['description'],
            'variables': request.data['variables']
        }
        serializer = BotSerializer(instance=bot_to_update, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, bot_id, *args, **kwargs):
        '''
        Start or stop bot with given bot_id if exists
        '''
        bot_to_action = self.get_object(bot_id, owner=request.user)
        if not bot_to_action:
            return Response(
                {"Failed": "Bot ID does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if request.data['status'] == 'active':
            str_terminal = f'sudo systemctl start bot{bot_id}.service'
            os.system(str_terminal)
        if request.data['status'] == 'inactive':
            str_terminal = f'sudo systemctl stop bot{bot_id}.service'
            os.system(str_terminal)

        # if request.data['status'] == 'active' or request.data['status'] == 'inactive':
        serializer = BotSerializer(instance=bot_to_action, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, 
                status=status.HTTP_200_OK
            )
        else:                
            return Response(
                {"Failed": "Invalid status"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, bot_id, *args, **kwargs):
        '''
        Deletes bot with given bot_id if exists
        '''
        bot_to_delete = self.get_object(bot_id, owner=request.user)
        if not bot_to_delete:
            return Response(
                {"Failed": "Bot ID does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        bot_to_delete.delete()
        return Response(
            {"Success": "Bot deleted!"},
            status=status.HTTP_200_OK
        )

@api_view(['GET'])
def internal_bot_details(request, bot_id):
    """
    Get one bot internally.
    """
    if request.META['HTTP_API_SECRET'] == settings.API_SECRET:
        bot_to_retrieve = Bot.objects.get(id=bot_id)
        serializer = BotSerializer(bot_to_retrieve)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(
            {'Error': 'Bad request'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def internal_user_bot_details(request, bot_id, user_id):
    """
    Get one bot internally.
    """
    client_nonce = request.META['HTTP_NONCE']
    client_signature = request.META['HTTP_SIGNATURE']
    user_secret_to_retrieve = UserProfile.objects.values('secret_key').get(user_id=user_id)
    constructed_message = f'var-{bot_id}-{user_id}-{client_nonce}'
    signature_is_valid = check_signature(client_nonce, client_signature, user_secret_to_retrieve['secret_key'], constructed_message)
    if signature_is_valid: 
        bot_to_retrieve = Bot.objects.get(id=bot_id)
        serializer = BotSerializer(bot_to_retrieve)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(
            {'Error': 'Invalid signature'}, 
            status=status.HTTP_403_FORBIDDEN
        )

@api_view(['GET'])
def timestamp(request):
    """
    Timestamp
    """
    now = int(time.time())
    return Response({"timestamp": now}, status=status.HTTP_200_OK)

class BotLogList(APIView):
    """
    API to create bot log message
    """
    serializer_class = BotLogSerializer

    def post(self, request, format=None):
        '''
        Create new bot log message
        '''
        if request.META['HTTP_API_SECRET'] == settings.API_SECRET:
            serializer = BotLogSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"Success": "Log has been updated"}, 
                    status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {'Error': 'Bad request'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class BotLogDetails(APIView):
    """
    API to fetch bot log message
    """
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, bot_id, rows, *args, **kwargs):
        '''
        Get log for a specific bot
        '''
        try:
            if Bot.objects.get(id=bot_id, owner=request.user):
                bot_log_to_retrieve = BotLog.objects.filter(log_owner=bot_id).order_by('-id')[:rows]
                serializer = BotLogSerializer(bot_log_to_retrieve, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Bot.DoesNotExist:
            return Response(
                {'Error': 'Bad request or unauthorized request'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, format=None):
        if request.META['HTTP_API_SECRET'] == settings.API_SECRET:
            file_obj = request.FILES['file']
            destination = open('/insert/your/project/path/scripts/' + file_obj.name, 'wb+')
            for chunk in file_obj.chunks():
                destination.write(chunk)
            destination.close()
            # with open('/home/ubuntu/scripts', 'wb+') as destination:
            #     destination.save(file_obj)
            # ...
            # do some stuff with uploaded file
            # ...
            return Response(
                {'Success': 'File uploaded'}, 
                status=status.HTTP_202_ACCEPTED
            )
        else:
            return Response(
                {'Error': 'Bad request'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
