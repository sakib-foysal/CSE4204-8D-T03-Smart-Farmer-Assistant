from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("disease_detection", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="diseasehistory",
            name="image_hash",
            field=models.CharField(blank=True, db_index=True, default="", max_length=64),
        ),
        migrations.AddField(
            model_name="diseasehistory",
            name="prediction_key",
            field=models.CharField(blank=True, db_index=True, default="", max_length=150),
        ),
    ]
