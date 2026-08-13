from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("fertilizer", "0002_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="fertilizerrecommendation",
            name="disease",
            field=models.ForeignKey(blank=True, null=True, on_delete=models.deletion.CASCADE, related_name="fertilizer_recommendations", to="disease_detection.diseasehistory"),
        ),
    ]
