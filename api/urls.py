from django.urls import include, path
from rest_framework import routers, serializers, viewsets

from exercises.models import Exercise
from programs.models import Program


# Serializers define the API representation.
class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ["program_name", "pub_date"]


# ViewSets define the view behavior.
class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


# Serializers define the API representation.
class ExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Exercise
        fields = ["exercise_name"]


# ViewSets define the view behavior.
class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


router = routers.DefaultRouter()
router.register(r"programs", ProgramViewSet)
router.register(r"exercises", ExerciseViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
