from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.db.models import Q
from rest_framework import serializers
import base64
import re


User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "role",
        ]
        read_only_fields = ["id"]

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_phone(self, value):
        phone_rules = {
            "+880": 10,
            "+1": 10,
            "+91": 10,
            "+92": 10,
            "+44": 10,
            "+81": 10,
            "+61": 9,
            "+971": 9,
            "+966": 9,
            "+65": 8,
        }
        normalized_phone = re.sub(r"[\s-]", "", value)
        for country_code, digit_count in phone_rules.items():
            if normalized_phone.startswith(country_code):
                national_number = normalized_phone[len(country_code):]
                if national_number.isdigit() and len(national_number) == digit_count:
                    return normalized_phone
                raise serializers.ValidationError(
                    f"Enter exactly {digit_count} digits after {country_code}."
                )
        raise serializers.ValidationError("Select a supported country code and enter a valid phone number.")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier", "").strip()
        password = attrs.get("password", "")

        user = User.objects.filter(
            Q(username__iexact=identifier) | Q(email__iexact=identifier)
        ).first()
        if user is None or not check_password(password, user.password):
            raise serializers.ValidationError("Invalid username/email or password.")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        attrs["user"] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "avatar",
            "role",
            "created_at",
        ]
        read_only_fields = ["id", "username", "created_at"]

    def validate_avatar(self, value):
        if not value:
            return ""
        if not value.startswith("data:image/") or ";base64," not in value:
            raise serializers.ValidationError("Upload a PNG, JPG, or WEBP profile image.")
        header, encoded = value.split(",", 1)
        mime_type = header[5:].split(";", 1)[0].lower()
        if mime_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise serializers.ValidationError("Only PNG, JPG, and WEBP images are supported.")
        try:
            image = base64.b64decode(encoded, validate=True)
        except (ValueError, base64.binascii.Error) as exc:
            raise serializers.ValidationError("The selected profile image is invalid.") from exc
        if len(image) > 5 * 1024 * 1024:
            raise serializers.ValidationError("Profile image must be 5 MB or smaller.")
        return value


class AdminUserSerializer(serializers.ModelSerializer):
    """Editable user representation exposed only through admin endpoints."""

    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "created_at",
            "password",
        ]
        read_only_fields = ["id", "username", "created_at"]

    def validate_email(self, value):
        queryset = User.objects.filter(email__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if value and queryset.exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
