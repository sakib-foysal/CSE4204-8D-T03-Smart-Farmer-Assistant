from django.urls import path

<<<<<<< HEAD
from apps.disease_detection.views import DiseaseHistoryListCreateAPIView
=======
from apps.disease_detection.views import DiseaseAnalyzeAPIView, DiseaseHistoryListCreateAPIView
>>>>>>> ai-integration


urlpatterns = [
    path("", DiseaseHistoryListCreateAPIView.as_view(), name="disease-history"),
<<<<<<< HEAD
]
=======
    path("analyze/", DiseaseAnalyzeAPIView.as_view(), name="disease-analyze"),
]
>>>>>>> ai-integration
