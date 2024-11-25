from django.core.handlers.wsgi import WSGIRequest
from django.urls import include, path
from rest_framework import routers, serializers, viewsets
from rest_framework.response import Response

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

    def get(self, request: WSGIRequest) -> Response:

        return Response(self.serializer_class.data)

    def post(self):
        pass


router = routers.DefaultRouter()
router.register(r"programs", ProgramViewSet)

urlpatterns = [
    # path("programs/", program_list, name="program_list"),
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
