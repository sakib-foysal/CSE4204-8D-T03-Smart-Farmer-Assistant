from rest_framework import serializers

from apps.weather.models import WeatherData


class WeatherDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = ["id", "temperature", "humidity", "rainfall", "flood_risk", "date"]
        read_only_fields = ["id", "date"]