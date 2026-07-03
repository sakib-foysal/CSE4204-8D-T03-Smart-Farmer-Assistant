from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from apps.users.jwt import decode_token
from apps.users.models import RevokedToken


User = get_user_model()


class JWTAuthentication(authentication.BaseAuthentication):

    keyword = "Bearer"

    def authenticate(self, request):
        authorization = authentication.get_authorization_header(request).decode("utf-8")
        if not authorization:
            return None

        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != self.keyword.lower():
            return None

        token = parts[1].strip()
        try:
            payload = decode_token(token)
        except ValueError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        if RevokedToken.objects.filter(jti=payload["jti"], expires_at__gt=timezone.now()).exists():
            raise AuthenticationFailed("Token has been revoked.")

        try:
            user = User.objects.get(id=payload["sub"])
        except User.DoesNotExist as exc:
            raise AuthenticationFailed("User not found.") from exc

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled.")

        return (user, payload)