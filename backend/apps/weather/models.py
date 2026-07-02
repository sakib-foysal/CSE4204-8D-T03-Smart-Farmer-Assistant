import uuid
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class WeatherData(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    temperature = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(-50),
            MaxValueValidator(60)
        ]
    )

    humidity = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ]
    )

    rainfall = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    flood_risk = models.CharField(
        max_length=20,
        choices=[
            ("low", "Low"),
            ("medium", "Medium"),
            ("high", "High"),
        ]
    )

    date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "weather_data"
        ordering = ["-date"]

    def __str__(self):
        return f"WeatherData {self.id}"