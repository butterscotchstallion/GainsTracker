from django.db import models

from programs.models import Program


class Schedule(models.Model):
    schedule_name = models.CharField(max_length=50)
    pub_date = models.DateTimeField("date published")
    day_of_week = models.IntegerField()
    program = models.ForeignKey(Program, null=True, on_delete=models.SET(Program))

    def __str__(self) -> str:
        return self.schedule_name
