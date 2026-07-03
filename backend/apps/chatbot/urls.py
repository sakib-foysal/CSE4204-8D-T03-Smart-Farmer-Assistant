from django.urls import path

from apps.chatbot.views import ChatHistoryListCreateAPIView


urlpatterns = [
    path("", ChatHistoryListCreateAPIView.as_view(), name="chat-history"),
]