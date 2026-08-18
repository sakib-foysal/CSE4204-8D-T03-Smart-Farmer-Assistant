from rest_framework import serializers

from apps.market.models import MarketPrice


class MarketPriceSerializer(serializers.ModelSerializer):
    trend = serializers.SerializerMethodField()

    def get_trend(self, instance):
        previous = MarketPrice.objects.filter(
            crop_name__iexact=instance.crop_name,
            region__iexact=instance.region,
            unit__iexact=instance.unit,
            date__lt=instance.date,
        ).order_by("-date").first()
        if previous is None:
            return "new"
        if instance.price > previous.price:
            return "up"
        if instance.price < previous.price:
            return "down"
        return "same"

    class Meta:
        model = MarketPrice
        fields = ["id", "crop_name", "price", "unit", "region", "date", "trend"]
        read_only_fields = ["id", "date"]
