# Create your views here.

from django.views import generic

from programs.models import Program


class IndexView(generic.ListView):
    template_name = "index.html"
    context_object_name = "programs_list"

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        return Program.objects.all()


class DetailView(generic.DetailView):
    template_name = "details.html"
