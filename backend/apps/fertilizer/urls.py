from django.urls import path

from apps.fertilizer.views import FertilizerRecommendationListCreateAPIView


urlpatterns = [
    path("", FertilizerRecommendationListCreateAPIView.as_view(), name="fertilizer-recommendations"),
]