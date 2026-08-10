from django.urls import path

from apps.weather.views import WeatherDataListCreateAPIView


urlpatterns = [
    path("", WeatherDataListCreateAPIView.as_view(), name="weather-data"),
]