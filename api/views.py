from typing import Type

from django.core import serializers
from django.core.handlers.wsgi import WSGIRequest
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

from programs import models
from programs.models import Program


@api_view(["GET"])
def program_list(request: WSGIRequest) -> JsonResponse:
    return JsonResponse({"programs": list(models.Program.objects.all().values())})


@api_view(["GET"])
def program_detail(
    request: WSGIRequest, program_id: int
) -> Type[Http404] | JsonResponse:
    program = get_object_or_404(Program, id=program_id)
    return JsonResponse({"program": serializers.serialize("json", program)})
