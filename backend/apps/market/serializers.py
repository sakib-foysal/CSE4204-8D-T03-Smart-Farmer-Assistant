from rest_framework import serializers

from apps.market.models import MarketPrice


class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = ["id", "crop_name", "price", "unit", "region", "date"]
        read_only_fields = ["id", "date"]