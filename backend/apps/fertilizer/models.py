import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.users.models import User
from apps.disease_detection.models import DiseaseHistory


class FertilizerRecommendation(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    disease = models.ForeignKey(
        DiseaseHistory,
        on_delete=models.CASCADE,
        related_name="fertilizer_recommendations"
<<<<<<< HEAD
=======
        , null=True,
        blank=True,
>>>>>>> ai-integration
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="fertilizer_recommendations"
    )

    crop_name = models.CharField(
        max_length=100
    )

    suggestion = models.TextField()

    date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "fertilizer_recommendations"
        ordering = ["-date"]

    def __str__(self):
<<<<<<< HEAD
        return f"FertilizerRecommendation {self.crop_name}"
=======
        return f"FertilizerRecommendation {self.crop_name}"
>>>>>>> ai-integration
