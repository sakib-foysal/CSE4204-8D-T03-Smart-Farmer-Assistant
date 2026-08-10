from django.urls import path

from apps.market.views import MarketPriceListCreateAPIView


urlpatterns = [
    path("", MarketPriceListCreateAPIView.as_view(), name="market-prices"),
]