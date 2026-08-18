from rest_framework import serializers

from apps.fertilizer.models import FertilizerRecommendation


class FertilizerRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FertilizerRecommendation
        fields = ["id", "disease", "crop_name", "suggestion", "date"]
        read_only_fields = ["id", "date"]


class FertilizerGenerateSerializer(serializers.Serializer):
    crop_name = serializers.CharField(max_length=100, trim_whitespace=True)
    farm_context = serializers.CharField(max_length=500, required=False, allow_blank=True)
    language = serializers.ChoiceField(choices=["en", "bn"], required=False, default="en")
    disease_id = serializers.UUIDField(required=False, allow_null=True)
