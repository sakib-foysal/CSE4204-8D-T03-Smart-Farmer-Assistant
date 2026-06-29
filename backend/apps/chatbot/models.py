import uuid

from django.db import models
from apps.users.models import User


class ChatHistory(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chat_histories"
    )

    question = models.TextField()

    response = models.TextField()

    date = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "chat_history"
        ordering = ["-date"]

    def __str__(self):
        return f"ChatHistory {self.id}"