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
    num_repetitions = models.IntegerField(default=5)
    num_sets = models.IntegerField(default=5)

    @property
    def exercise_name(self) -> str:
        return self.exercise.exercise_name

    @property
    def schedule_name(self) -> str:
        return self.schedule.schedule_name

    @property
    def schedule_id(self) -> int:
        return self.schedule.id

    def __str__(self) -> str:
        return f"{self.schedule.schedule_name} - {self.exercise.exercise_name}"


# This causes a circular import if we put it in Exercises
class ExerciseWeights(models.Model):
    schedule = models.ForeignKey(Schedule, null=True, on_delete=models.SET(Schedule))
    exercise = models.ForeignKey(
        Exercise, null=True, on_delete=models.SET("exercises.Exercise")
    )
    weight = models.IntegerField(default=10)
    last_modified = models.DateTimeField(auto_now=True)

    @property
    def exercise_name(self) -> str:
        return self.exercise.exercise_name

    @property
    def schedule_name(self) -> str:
        return self.schedule.schedule_name

    def __str__(self) -> str:
        return f"{self.schedule.schedule_name} - {self.exercise.exercise_name} ({self.weight})"
