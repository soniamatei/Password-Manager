from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from passwords.models import *


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "user"):
            return request.user == obj.user
        return request.user == obj


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == User.Roles.ADMIN
        )