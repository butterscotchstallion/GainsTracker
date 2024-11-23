from django.utils import timezone
from django.views import generic

from programs.models import Program


class IndexView(generic.ListView):
    template_name = "programs/index.html"
    context_object_name = "programs_list"

    def get_queryset(self):
        return Program.objects.filter(pub_date__lte=timezone.now()).order_by(
            "-pub_date"
        )


class DetailView(generic.DetailView):
    model = Program
    template_name = "programs/detail.html"
