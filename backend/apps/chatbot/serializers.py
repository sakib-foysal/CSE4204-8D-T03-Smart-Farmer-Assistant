from rest_framework import serializers

from apps.chatbot.models import ChatHistory


class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ["id", "question", "response", "date"]
        read_only_fields = ["id", "date"]