from rest_framework.generics import ListCreateAPIView

from apps.market.models import MarketPrice
from apps.market.serializers import MarketPriceSerializer
from apps.users.permissions import IsJWTAuthenticated


class MarketPriceListCreateAPIView(ListCreateAPIView):
	serializer_class = MarketPriceSerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return MarketPrice.objects.all().order_by("-date")
