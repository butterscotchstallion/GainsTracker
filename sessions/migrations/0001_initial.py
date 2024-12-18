# Generated by Django 5.1.3 on 2024-12-17 03:43

import programs.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("programs", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Session",
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
                ("num_repetitions", models.IntegerField()),
                ("num_sets", models.IntegerField()),
                ("pub_date", models.DateTimeField(verbose_name="date published")),
                (
                    "program_id",
                    models.ForeignKey(
                        null=True,
                        on_delete=models.SET(programs.models.Program),
                        to="programs.program",
                    ),
                ),
            ],
            options={
                "db_table": "gt_sessions_session",
            },
        ),
    ]