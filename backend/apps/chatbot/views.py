from rest_framework.generics import ListCreateAPIView

from apps.chatbot.models import ChatHistory
from apps.chatbot.serializers import ChatHistorySerializer
from apps.users.permissions import IsJWTAuthenticated


class ChatHistoryListCreateAPIView(ListCreateAPIView):
	serializer_class = ChatHistorySerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return ChatHistory.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
