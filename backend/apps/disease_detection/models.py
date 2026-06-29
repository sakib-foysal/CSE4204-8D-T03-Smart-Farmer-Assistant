import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from apps.users.models import User


class DiseaseHistory(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="disease_histories"
    )

    image_url = models.TextField(
        blank=False
    )

    prediction = models.CharField(
        max_length=150
    )

    confidence = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ]
    )

    treatment = models.TextField()

    date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "disease_history"
        ordering = ["-date"]

    def __str__(self):
        return f"DiseaseHistory {self.prediction}"