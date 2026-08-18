from rest_framework import serializers
import base64

from apps.disease_detection.models import DiseaseHistory


class DiseaseHistorySerializer(serializers.ModelSerializer):
    fertilizer_recommendations = serializers.SerializerMethodField()

    def get_fertilizer_recommendations(self, instance):
        return [recommendation.suggestion for recommendation in instance.fertilizer_recommendations.all()]

    class Meta:
        model = DiseaseHistory
        fields = ["id", "image_url", "crop_name", "prediction", "confidence", "treatment", "disclaimer", "fertilizer_recommendations", "date"]
        read_only_fields = ["id", "date"]


class DiseaseAnalyzeSerializer(serializers.Serializer):
    image_data = serializers.CharField(max_length=7_200_000)
    crop_hint = serializers.CharField(max_length=100, required=False, allow_blank=True)
    language = serializers.ChoiceField(choices=["en", "bn"], required=False, default="en")

    def validate_image_data(self, value):
        if not value.startswith("data:image/") or ";base64," not in value:
            raise serializers.ValidationError("Upload a PNG, JPG, or WEBP crop image.")
        header, encoded = value.split(",", 1)
        mime_type = header[5:].split(";", 1)[0].lower()
        if mime_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise serializers.ValidationError("Only PNG, JPG, and WEBP images are supported.")
        try:
            raw = base64.b64decode(encoded, validate=True)
        except (ValueError, base64.binascii.Error) as exc:
            raise serializers.ValidationError("The selected image is invalid.") from exc
        if len(raw) > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image must be 5 MB or smaller.")
        self.context["mime_type"] = mime_type
        self.context["image_base64"] = encoded
        return value
