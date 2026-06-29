from rest_framework.generics import ListCreateAPIView

from apps.disease_detection.models import DiseaseHistory
from apps.disease_detection.serializers import DiseaseHistorySerializer
from apps.users.permissions import IsJWTAuthenticated


class DiseaseHistoryListCreateAPIView(ListCreateAPIView):
	serializer_class = DiseaseHistorySerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return DiseaseHistory.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
