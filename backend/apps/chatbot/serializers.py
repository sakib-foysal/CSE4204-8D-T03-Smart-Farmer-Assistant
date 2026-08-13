from rest_framework import serializers

from apps.chatbot.models import ChatHistory


class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ["id", "question", "response", "date"]
<<<<<<< HEAD
        read_only_fields = ["id", "date"]
=======
        read_only_fields = ["id", "date"]


class SFAIChatSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=1200, trim_whitespace=True)

    def validate_question(self, value):
        if not value:
            raise serializers.ValidationError("Please enter a farming question.")
        return value
>>>>>>> ai-integration
