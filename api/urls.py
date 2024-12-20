from django.urls import include, path
from rest_framework import routers, serializers, viewsets

from exercises.models import Exercise
from programs.models import Program
from schedules.models import Schedule, ScheduleExercise
from sessions.models import Session


# Serializers define the API representation.
class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ["program_name", "pub_date"]


# ViewSets define the view behavior.
class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Exercise
        fields = ["exercise_name"]


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


class SessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Session
        fields = ["pub_date", "num_repetitions", "num_sets", "program"]


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer


class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "pub_date", "program", "day_of_week", "schedule_name"]


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


class ScheduleExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ScheduleExercise
        fields = [
            "num_repetitions",
            "num_sets",
            "exercise_name",
            "schedule_id",
        ]


class ScheduleExerciseViewSet(viewsets.ModelViewSet):
    # queryset = ScheduleExercise.objects.all()
    queryset = ScheduleExercise.objects.select_related("schedule").prefetch_related(
        "schedule"
    )
    serializer_class = ScheduleExerciseSerializer


router = routers.DefaultRouter()
router.register(r"programs", ProgramViewSet)
router.register(r"exercises", ExerciseViewSet)
router.register(r"sessions", SessionViewSet)
router.register(r"schedules", ScheduleViewSet)
router.register(r"schedule-exercises", ScheduleExerciseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
