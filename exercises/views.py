from django.utils import timezone
from django.views import generic

from exercises.models import Exercise


class IndexView(generic.ListView):
    template_name = "index.html"
    context_object_name = "exercises_list"

    def get_queryset(self):
        return Exercise.objects.filter(pub_date__lte=timezone.now()).order_by(
            "-pub_date"
        )


class DetailView(generic.DetailView):
    model = Exercise
    template_name = "detail.html"
