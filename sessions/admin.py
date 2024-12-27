from django.contrib import admin

from sessions.models import Session, SessionExercise

# Register your models here.
admin.site.register(Session)
admin.site.register(SessionExercise)
