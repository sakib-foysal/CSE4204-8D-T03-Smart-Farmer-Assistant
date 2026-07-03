from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.authentication import JWTAuthentication
from apps.users.jwt import encode_token
from apps.users.models import RevokedToken
from apps.users.permissions import IsJWTAuthenticated
from apps.users.serializers import (
    UserLoginSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token_data = encode_token(user)

        return Response(
            {
                "message": "Registration successful.",
                "user": UserProfileSerializer(user).data,
                "access_token": token_data["token"],
                "token_type": "Bearer",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token_data = encode_token(user)

        return Response(
            {
                "message": "Login successful.",
                "user": UserProfileSerializer(user).data,
                "access_token": token_data["token"],
                "token_type": "Bearer",
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        token = request.auth
        if not token:
            return Response(
                {"detail": "No token provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        expires_at = timezone.datetime.fromtimestamp(
            token["exp"], tz=timezone.get_current_timezone()
        )
        RevokedToken.objects.get_or_create(
            jti=token["jti"],
            defaults={"expires_at": expires_at},
        )

        return Response(
            {"message": "Logout successful."},
            status=status.HTTP_200_OK,
        )


class ProfileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsJWTAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Profile updated successfully.",
                "user": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
