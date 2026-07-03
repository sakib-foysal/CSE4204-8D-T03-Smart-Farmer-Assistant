import base64
import hashlib
import hmac
import json
import secrets
from datetime import timedelta

from django.conf import settings
from django.utils import timezone


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _base64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _sign(message: str) -> str:
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _base64url_encode(signature)


def encode_token(user, expires_in_minutes: int = 60 * 24 * 7) -> dict:
    issued_at = timezone.now()
    expires_at = issued_at + timedelta(minutes=expires_in_minutes)
    payload = {
        "sub": str(user.id),
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "jti": secrets.token_urlsafe(24),
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
    }

    header = {"alg": "HS256", "typ": "JWT"}
    header_segment = _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_segment = _base64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_segment}.{payload_segment}"
    token = f"{signing_input}.{_sign(signing_input)}"
    return {"token": token, "payload": payload}


def decode_token(token: str) -> dict:
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError as exc:
        raise ValueError("Invalid token format.") from exc

    signing_input = f"{header_segment}.{payload_segment}"
    expected_signature = _sign(signing_input)
    if not hmac.compare_digest(expected_signature, signature_segment):
        raise ValueError("Invalid token signature.")

    header = json.loads(_base64url_decode(header_segment).decode("utf-8"))
    if header.get("alg") != "HS256":
        raise ValueError("Unsupported token algorithm.")

    payload = json.loads(_base64url_decode(payload_segment).decode("utf-8"))
    expires_at = timezone.datetime.fromtimestamp(payload["exp"], tz=timezone.get_current_timezone())
    if timezone.now() >= expires_at:
        raise ValueError("Token has expired.")

    return payload