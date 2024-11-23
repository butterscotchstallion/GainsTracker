from django.db import models

from programs.models import Program


class Exercise(models.Model):
    exercise_name = models.CharField(max_length=50)
    pub_date = models.DateTimeField("date published")
    program = models.ForeignKey(Program, null=True, on_delete=models.SET(Program))

    def __str__(self):
        return self.exercise_name
