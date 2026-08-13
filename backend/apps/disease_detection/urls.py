from django.urls import path

from apps.disease_detection.views import DiseaseAnalyzeAPIView, DiseaseHistoryListCreateAPIView


urlpatterns = [
    path("", DiseaseHistoryListCreateAPIView.as_view(), name="disease-history"),
    path("analyze/", DiseaseAnalyzeAPIView.as_view(), name="disease-analyze"),
]
