from django.db import migrations


def merge_duplicate_legacy_conversations(apps, schema_editor):
    ChatConversation = apps.get_model("chatbot", "ChatConversation")
    ChatHistory = apps.get_model("chatbot", "ChatHistory")
    user_ids = ChatConversation.objects.filter(title="Previous chat history").values_list("user_id", flat=True).distinct()
    for user_id in user_ids:
        conversations = list(ChatConversation.objects.filter(user_id=user_id, title="Previous chat history").order_by("created_at"))
        if len(conversations) > 1:
            primary, duplicates = conversations[0], conversations[1:]
            ChatHistory.objects.filter(conversation_id__in=[item.id for item in duplicates]).update(conversation=primary)
            ChatConversation.objects.filter(id__in=[item.id for item in duplicates]).delete()


class Migration(migrations.Migration):
    dependencies = [("chatbot", "0004_group_existing_chat_history")]
    operations = [migrations.RunPython(merge_duplicate_legacy_conversations, migrations.RunPython.noop)]
