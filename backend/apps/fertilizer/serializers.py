from rest_framework import serializers

from apps.fertilizer.models import FertilizerRecommendation


class FertilizerRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FertilizerRecommendation
        fields = ["id", "disease", "crop_name", "suggestion", "date"]
        read_only_fields = ["id", "date"]