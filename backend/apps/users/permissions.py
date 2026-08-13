from rest_framework.exceptions import NotAuthenticated
from rest_framework.permissions import BasePermission


class IsJWTAuthenticated(BasePermission):

    message = "Authentication credentials were not provided."

    def has_permission(self, request, view):
        authorization = request.headers.get("Authorization", "")
        if not authorization.startswith("Bearer "):
            raise NotAuthenticated(self.message)
        return bool(request.user and request.user.is_authenticated)


class IsAdminUser(IsJWTAuthenticated):
    """Allow administrative account management only to application admins."""

    message = "Administrator access is required."

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == "admin"
