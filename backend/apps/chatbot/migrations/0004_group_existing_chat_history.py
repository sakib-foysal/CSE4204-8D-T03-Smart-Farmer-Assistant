from django.db import migrations


def group_existing_messages(apps, schema_editor):
    ChatConversation = apps.get_model("chatbot", "ChatConversation")
    ChatHistory = apps.get_model("chatbot", "ChatHistory")
    user_ids = ChatHistory.objects.filter(conversation__isnull=True).values_list("user_id", flat=True).distinct()
    for user_id in user_ids:
        conversation = ChatConversation.objects.create(user_id=user_id, title="Previous chat history")
        ChatHistory.objects.filter(user_id=user_id, conversation__isnull=True).update(conversation=conversation)


class Migration(migrations.Migration):
    dependencies = [("chatbot", "0003_chatconversation_chathistory_conversation")]
    operations = [migrations.RunPython(group_existing_messages, migrations.RunPython.noop)]
