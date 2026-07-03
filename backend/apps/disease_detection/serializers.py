from rest_framework import serializers

from apps.disease_detection.models import DiseaseHistory


class DiseaseHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseHistory
        fields = ["id", "image_url", "prediction", "confidence", "treatment", "date"]
        read_only_fields = ["id", "date"]