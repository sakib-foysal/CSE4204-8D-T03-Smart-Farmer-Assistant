from django.urls import path

from apps.weather.views import LiveWeatherForecastAPIView, WeatherDataListCreateAPIView


urlpatterns = [
    path("forecast/", LiveWeatherForecastAPIView.as_view(), name="weather-forecast"),
    path("", WeatherDataListCreateAPIView.as_view(), name="weather-data"),
]
