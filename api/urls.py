from django.urls import include, path
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import routers, serializers, viewsets

from exercises.models import Exercise
from programs.models import Program
from schedules.models import ExerciseWeights, Schedule, ScheduleExercise
from sessions.models import Session

ONE_WEEK_IN_SECONDS = 604800
CACHE_TIMEOUT = ONE_WEEK_IN_SECONDS


class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ["program_name", "pub_date"]


@method_decorator(cache_page(CACHE_TIMEOUT), "dispatch")
class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class ExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Exercise
        fields = ["exercise_name"]


@method_decorator(cache_page(CACHE_TIMEOUT), "dispatch")
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


# Session
class SessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Session
        fields = ["pub_date", "num_repetitions", "num_sets", "program"]


@method_decorator(cache_page(CACHE_TIMEOUT), "dispatch")
class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer


# Schedule
class ScheduleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "pub_date", "program", "day_of_week", "schedule_name"]


@method_decorator(cache_page(CACHE_TIMEOUT), "dispatch")
class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


# ScheduleExercise
class ScheduleExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ScheduleExercise
        fields = [
            "num_repetitions",
            "num_sets",
            "exercise_name",
            "schedule_name",
        ]


@method_decorator(cache_page(CACHE_TIMEOUT), "dispatch")
class ScheduleExerciseViewSet(viewsets.ModelViewSet):
    queryset = ScheduleExercise.objects.all()
    serializer_class = ScheduleExerciseSerializer


# ExerciseWeights
class ExerciseWeightsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ExerciseWeights
        fields = ["schedule_name", "weight", "last_modified", "exercise_name"]


@method_decorator(cache_page(CACHE_TIMEOUT), "dispatch")
class ExerciseWeightsViewSet(viewsets.ModelViewSet):
    queryset = ExerciseWeights.objects.all()
    serializer_class = ExerciseWeightsSerializer


router = routers.DefaultRouter()
router.register(r"programs", ProgramViewSet)
router.register(r"exercises", ExerciseViewSet)
router.register(r"sessions", SessionViewSet)
router.register(r"schedules", ScheduleViewSet)
router.register(r"schedule-exercises", ScheduleExerciseViewSet)
router.register(r"exercise-weights", ExerciseWeightsViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
