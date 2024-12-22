from django.contrib import admin

from .models import ExerciseWeights, Schedule, ScheduleExercise

admin.site.register(Schedule)
admin.site.register(ScheduleExercise)
admin.site.register(ExerciseWeights)
