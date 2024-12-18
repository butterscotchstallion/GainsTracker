from django.db import models

from programs.models import Program


class Session(models.Model):
    program_id = models.ForeignKey(Program, null=True, on_delete=models.SET(Program))
    num_repetitions = models.IntegerField()
    num_sets = models.IntegerField()
    pub_date = models.DateTimeField("date published")

    class Meta:
        db_table = "gt_sessions_session"

    def __str__(self):
        return self.pub_date