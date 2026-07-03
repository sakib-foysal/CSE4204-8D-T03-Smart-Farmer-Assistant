from rest_framework.generics import ListCreateAPIView

from apps.users.permissions import IsJWTAuthenticated
from apps.weather.models import WeatherData
from apps.weather.serializers import WeatherDataSerializer


class WeatherDataListCreateAPIView(ListCreateAPIView):
	serializer_class = WeatherDataSerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return WeatherData.objects.all().order_by("-date")
