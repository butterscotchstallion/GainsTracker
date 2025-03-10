# Generated by Django 5.1.3 on 2024-12-18 03:56

import programs.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("programs", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Schedule",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("schedule_name", models.CharField(max_length=50)),
                ("pub_date", models.DateTimeField(verbose_name="date published")),
                ("day_of_week", models.IntegerField()),
                (
                    "program",
                    models.ForeignKey(
                        null=True,
                        on_delete=models.SET(programs.models.Program),
                        to="programs.program",
                    ),
                ),
            ],
        ),
    ]
