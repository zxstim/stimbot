from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """Class set permission for owner of bot"""
    def has_object_permission(self,request,view, obj):
        return obj.owner == request.user