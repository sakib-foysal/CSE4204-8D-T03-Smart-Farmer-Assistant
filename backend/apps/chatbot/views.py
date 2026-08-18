from django.conf import settings
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.chatbot.sf_ai_service import SFAIServiceError, ask_sf_ai
from apps.chatbot.models import ChatConversation, ChatHistory
from apps.chatbot.serializers import ChatConversationSerializer, ChatHistorySerializer, SFAIChatSerializer
from apps.users.permissions import IsJWTAuthenticated


class ChatHistoryListCreateAPIView(ListCreateAPIView):
	serializer_class = ChatHistorySerializer
	permission_classes = [IsJWTAuthenticated]

	def get_queryset(self):
		return ChatHistory.objects.filter(user=self.request.user).order_by("-date")

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class ChatConversationListCreateAPIView(ListCreateAPIView):
    serializer_class = ChatConversationSerializer
    permission_classes = [IsJWTAuthenticated]

    def get_queryset(self):
        return ChatConversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatConversationMessagesAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def get(self, request, conversation_id):
        messages = ChatHistory.objects.filter(user=request.user, conversation_id=conversation_id).order_by("date")
        return Response(ChatHistorySerializer(messages, many=True).data)


class ChatConversationDetailAPIView(APIView):
    permission_classes = [IsJWTAuthenticated]

    def patch(self, request, conversation_id):
        conversation = ChatConversation.objects.filter(id=conversation_id, user=request.user).first()
        if conversation is None:
            return Response({"detail": "Chat conversation was not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChatConversationSerializer(conversation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SFAIChatAPIView(APIView):
    """Generate, validate, and persist one authenticated farming-assistant reply."""
    permission_classes = [IsJWTAuthenticated]

    def post(self, request):
        serializer = SFAIChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data["question"]
        conversation_id = serializer.validated_data.get("conversation_id")
        conversation = None
        if conversation_id:
            conversation = ChatConversation.objects.filter(id=conversation_id, user=request.user).first()
            if conversation is None:
                return Response({"detail": "Chat conversation was not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            conversation = ChatConversation.objects.create(user=request.user, title=question[:120])
        history = list(ChatHistory.objects.filter(user=request.user, conversation=conversation).order_by("-date")[:4])

        try:
            answer = ask_sf_ai(question, history=reversed(history))
        except SFAIServiceError as exc:
            return Response({"detail": str(exc)}, status=exc.status_code)

        if conversation.title == "New chat":
            conversation.title = question[:120]
            conversation.save(update_fields=["title", "updated_at"])
        else:
            conversation.save(update_fields=["updated_at"])
        saved = ChatHistory.objects.create(user=request.user, conversation=conversation, question=question, response=answer)
        return Response(
            {"id": str(saved.id), "conversation": str(conversation.id), "question": question, "response": answer, "date": saved.date, "model": "SF AI"},
            status=status.HTTP_201_CREATED,
        )
