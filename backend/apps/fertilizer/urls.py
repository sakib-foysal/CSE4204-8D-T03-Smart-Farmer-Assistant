from django.urls import path

from apps.fertilizer.views import FertilizerGenerateAPIView, FertilizerRecommendationListCreateAPIView


urlpatterns = [
    path("", FertilizerRecommendationListCreateAPIView.as_view(), name="fertilizer-recommendations"),
    path("generate/", FertilizerGenerateAPIView.as_view(), name="fertilizer-generate"),
]
