from django.utils import timezone
from datetime import timedelta
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.authentication import JWTAuthentication
from apps.users.jwt import encode_token
from apps.users.models import RevokedToken
from apps.users.permissions import IsAdminUser, IsJWTAuthenticated
from apps.users.serializers import (
    UserLoginSerializer,
    AdminUserSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
)
from django.contrib.auth import get_user_model
from apps.chatbot.models import ChatHistory
from apps.disease_detection.models import DiseaseHistory


User = get_user_model()


def revoke_token(token):
    """Add a valid JWT to the deny-list until its natural expiry."""
    expires_at = timezone.datetime.fromtimestamp(
        token["exp"], tz=timezone.get_current_timezone()
    )
    RevokedToken.objects.get_or_create(
        jti=token["jti"],
        defaults={"expires_at": expires_at},
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
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
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

        revoke_token(token)

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


class AdminUserListAPIView(ListAPIView):
    """Return the actual database users for the admin user-management page."""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all().order_by("-created_at")


class AdminUserDetailAPIView(RetrieveUpdateDestroyAPIView):
    """Let an admin view, edit, or remove a user account."""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()
    lookup_field = "id"

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.pk == request.user.pk:
            return Response(
                {"detail": "You cannot delete your own administrator account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class AdminDashboardAPIView(APIView):
    """Aggregate live application activity for the administrative dashboard."""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.localdate()
        start_date = today - timedelta(days=6)
        activity = []

        for offset in range(7):
            day = start_date + timedelta(days=offset)
            activity.append(
                {
                    "date": day.isoformat(),
                    "name": day.strftime("%a"),
                    "users": User.objects.filter(created_at__date=day).count(),
                    "detections": DiseaseHistory.objects.filter(date__date=day).count(),
                    "chats": ChatHistory.objects.filter(date__date=day).count(),
                }
            )

        recent_users = User.objects.all().order_by("-created_at")[:5]
        return Response(
            {
                "stats": {
                    "total_users": User.objects.count(),
                    "total_detections": DiseaseHistory.objects.count(),
                    "total_chats": ChatHistory.objects.count(),
                    "active_today": User.objects.filter(last_login__date=today).count(),
                },
                "activity": activity,
                "recent_users": AdminUserSerializer(recent_users, many=True).data,
            },
            status=status.HTTP_200_OK,
        )
