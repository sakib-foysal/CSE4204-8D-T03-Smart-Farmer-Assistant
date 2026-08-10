from django.conf import settings
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, ask_sf_ai
from apps.chatbot.models import ChatHistory
from apps.chatbot.serializers import ChatHistorySerializer, SFAIChatSerializer
from apps.users.permissions import IsJWTAuthenticated


class ChatHistoryListCreateAPIView(ListCreateAPIView):
	serializer_class = ChatHistorySerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return ChatHistory.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class SFAIChatAPIView(APIView):
    """Generate, validate, and persist one authenticated farming-assistant reply."""
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        serializer = SFAIChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data["question"]
        history = list(ChatHistory.objects.filter(user=request.user).order_by("-date")[:4])

        try:
            answer = ask_sf_ai(question, history=reversed(history))
        except SFAIServiceError as exc:
            return Response({"detail": str(exc)}, status=exc.status_code)

        saved = ChatHistory.objects.create(user=request.user, question=question, response=answer)
        return Response(
            {"id": str(saved.id), "question": question, "response": answer, "date": saved.date, "model": "SF AI"},
            status=status.HTTP_201_CREATED,
        )
