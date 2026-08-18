from django.urls import path

from apps.chatbot.views import ChatConversationDetailAPIView, ChatConversationListCreateAPIView, ChatConversationMessagesAPIView, ChatHistoryListCreateAPIView, SFAIChatAPIView


urlpatterns = [
    path("conversations/", ChatConversationListCreateAPIView.as_view(), name="chat-conversations"),
    path("conversations/<uuid:conversation_id>/messages/", ChatConversationMessagesAPIView.as_view(), name="chat-conversation-messages"),
    path("conversations/<uuid:conversation_id>/", ChatConversationDetailAPIView.as_view(), name="chat-conversation-detail"),
    path("", ChatHistoryListCreateAPIView.as_view(), name="chat-history"),
    path("ask/", SFAIChatAPIView.as_view(), name="sf-ai-chat"),
]
