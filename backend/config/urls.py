from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def home(request):
    return JsonResponse(
        {
            "message": "Smart Farmer Assistant API is running.",
            "endpoints": {
                "auth": "/api/register/ , /api/login/ , /api/logout/ , /api/profile/",
                "chat_history": "/api/chat-history/",
                "sf_ai_chat": "/api/chat-history/ask/",
                "disease_history": "/api/disease-history/",
                "fertilizer_recommendations": "/api/fertilizer-recommendations/",
                "market_prices": "/api/market-prices/",
                "weather_data": "/api/weather-data/",
            },
        }
    )


def health(request):
    return JsonResponse(
        {
            "status": "ok",
            "message": "Backend server is running.",
        }
    )

urlpatterns = [
    path('', home, name='home'),
    path('api/health/', health, name='health'),
    path('api/', include('apps.users.urls')),
    path('api/chat-history/', include('apps.chatbot.urls')),
    path('api/disease-history/', include('apps.disease_detection.urls')),
    path('api/fertilizer-recommendations/', include('apps.fertilizer.urls')),
    path('api/market-prices/', include('apps.market.urls')),
    path('api/weather-data/', include('apps.weather.urls')),
    path('admin/', admin.site.urls),
]
