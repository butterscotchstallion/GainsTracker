from django.db import models

from exercises.models import Exercise
from programs.models import Program


class Schedule(models.Model):
    schedule_name = models.CharField(max_length=50)
    pub_date = models.DateTimeField("date published")
    day_of_week = models.IntegerField()
    program = models.ForeignKey(Program, null=True, on_delete=models.SET(Program))
    exercises = models.ManyToManyField(Exercise, through="ScheduleExercise")

    def __str__(self) -> str:
        return self.schedule_name


class ScheduleExercise(models.Model):
    schedule = models.ForeignKey(Schedule, null=True, on_delete=models.SET(Schedule))
    exercise = models.ForeignKey(
        Exercise, null=True, on_delete=models.SET("exercises.Exercise")
    )
    num_repetitions = models.IntegerField()
    num_sets = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.schedule.schedule_name} - {self.exercise.exercise_name}"
