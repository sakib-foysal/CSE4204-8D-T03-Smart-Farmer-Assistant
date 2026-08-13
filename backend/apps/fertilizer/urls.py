from django.urls import path

<<<<<<< HEAD
from apps.fertilizer.views import FertilizerRecommendationListCreateAPIView
=======
from apps.fertilizer.views import FertilizerGenerateAPIView, FertilizerRecommendationListCreateAPIView
>>>>>>> ai-integration


urlpatterns = [
    path("", FertilizerRecommendationListCreateAPIView.as_view(), name="fertilizer-recommendations"),
<<<<<<< HEAD
]
=======
    path("generate/", FertilizerGenerateAPIView.as_view(), name="fertilizer-generate"),
]
>>>>>>> ai-integration
