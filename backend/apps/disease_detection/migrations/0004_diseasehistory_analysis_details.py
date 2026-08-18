from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("disease_detection", "0002_diseasehistory_deduplication_fields")]
    operations = [
        migrations.AddField(model_name="diseasehistory", name="crop_name", field=models.CharField(blank=True, default="", max_length=100)),
        migrations.AddField(model_name="diseasehistory", name="disclaimer", field=models.TextField(blank=True, default="")),
    ]
