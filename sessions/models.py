from django.db import models

from exercises.models import Exercise
from programs.models import Program


class Session(models.Model):
    """
    Represents a session of training
    """

    program = models.ForeignKey(Program, null=True, on_delete=models.SET(Program))
    start_timestamp = models.DateTimeField(null=True, auto_now_add=True)
    end_timestamp = models.DateTimeField(null=True)

    class Meta:
        db_table = "gt_sessions_session"

    def __str__(self) -> str:
        return str(self.start_timestamp)


class SessionExercise(models.Model):
    """
    Represents the relationship between a session and the exercises for that
    session
    """

    session = models.ForeignKey(Session, null=True, on_delete=models.SET(Session))
    exercise = models.ForeignKey(Exercise, null=True, on_delete=models.SET(Exercise))
    num_repetitions = models.IntegerField()
    num_sets = models.IntegerField()
    weight = models.IntegerField()

    @property
    def session_id(self) -> int:
        return self.session.id

    @property
    def exercise_id(self) -> int:
        return self.exercise.id
