from django.urls import path

from apps.chatbot.views import ChatHistoryListCreateAPIView, SFAIChatAPIView


urlpatterns = [
    path("", ChatHistoryListCreateAPIView.as_view(), name="chat-history"),
    path("ask/", SFAIChatAPIView.as_view(), name="sf-ai-chat"),
]
