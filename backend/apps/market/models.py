import uuid

from django.core.validators import MinValueValidator
from django.db import models


class MarketPrice(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    crop_name = models.CharField(
        max_length=100
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    unit = models.CharField(
        max_length=20
    )

    region = models.CharField(
        max_length=100
    )

    date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "market_prices"
        ordering = ["-date"]

    def __str__(self):
        return f"MarketPrice {self.crop_name}"