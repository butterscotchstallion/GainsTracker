from django.db import models


class Program(models.Model):
    program_name = models.CharField(max_length=50)
    pub_date = models.DateTimeField("date published")

    def __str__(self):
        return self.program_name
