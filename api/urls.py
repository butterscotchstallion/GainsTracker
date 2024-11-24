from django.urls import path

from .views import program_list

urlpatterns = [
    path("programs/", program_list, name="program_list"),
]
