from django.urls import path

from apps.disease_detection.views import DiseaseHistoryListCreateAPIView


urlpatterns = [
    path("", DiseaseHistoryListCreateAPIView.as_view(), name="disease-history"),
]