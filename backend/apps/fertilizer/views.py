from rest_framework.generics import ListCreateAPIView

from apps.fertilizer.models import FertilizerRecommendation
from apps.fertilizer.serializers import FertilizerRecommendationSerializer
from apps.users.permissions import IsJWTAuthenticated


class FertilizerRecommendationListCreateAPIView(ListCreateAPIView):
	serializer_class = FertilizerRecommendationSerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return FertilizerRecommendation.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
