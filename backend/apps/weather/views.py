from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsJWTAuthenticated
from apps.weather.models import WeatherData
from apps.weather.serializers import WeatherDataSerializer
from apps.weather.forecast_service import WeatherServiceError, get_seven_day_forecast


class WeatherDataListCreateAPIView(ListCreateAPIView):
	serializer_class = WeatherDataSerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return WeatherData.objects.all().order_by("-date")


class LiveWeatherForecastAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def get(self, request):
        try:
            return Response(get_seven_day_forecast(request.query_params.get("lang", "bn")))
        except WeatherServiceError as exc:
            return Response({"detail": str(exc)}, status=503)
