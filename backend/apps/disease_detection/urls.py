from django.urls import path

from apps.disease_detection.views import DiseaseAnalyzeAPIView, DiseaseHistoryListCreateAPIView, DiseaseVideoAnalyzeAPIView


urlpatterns = [
    path("", DiseaseHistoryListCreateAPIView.as_view(), name="disease-history"),
    path("analyze/", DiseaseAnalyzeAPIView.as_view(), name="disease-analyze"),
    path("analyze-video/", DiseaseVideoAnalyzeAPIView.as_view(), name="disease-video-analyze"),
]
