from django.views import generic

from exercises.models import Exercise


class IndexView(generic.ListView):
    template_name = "exercises/index.html"
    context_object_name = "exercises_list"

    def get_queryset(self):
        return Exercise.objects.all()


class DetailView(generic.DetailView):
    model = Exercise
    template_name = "exercises/detail.html"
