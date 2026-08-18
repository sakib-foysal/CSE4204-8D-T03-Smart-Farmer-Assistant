from rest_framework import serializers

from apps.chatbot.models import ChatConversation, ChatHistory


class ChatConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatConversation
        fields = ["id", "title", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ["id", "conversation", "question", "response", "date"]
        read_only_fields = ["id", "date"]


class SFAIChatSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=1200, trim_whitespace=True)
    conversation_id = serializers.UUIDField(required=False, allow_null=True)

    def validate_question(self, value):
        if not value:
            raise serializers.ValidationError("Please enter a farming question.")
        return value
