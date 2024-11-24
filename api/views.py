from django.http import JsonResponse
from rest_framework.decorators import api_view

from programs import models


@api_view(["GET"])
def program_list(request):
    return JsonResponse({"programs": list(models.Program.objects.all().values())})
