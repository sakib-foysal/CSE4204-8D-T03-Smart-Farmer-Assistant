from django.urls import path

<<<<<<< HEAD
from apps.chatbot.views import ChatHistoryListCreateAPIView
=======
from apps.chatbot.views import ChatHistoryListCreateAPIView, SFAIChatAPIView
>>>>>>> ai-integration


urlpatterns = [
    path("", ChatHistoryListCreateAPIView.as_view(), name="chat-history"),
<<<<<<< HEAD
]
=======
    path("ask/", SFAIChatAPIView.as_view(), name="sf-ai-chat"),
]
>>>>>>> ai-integration
