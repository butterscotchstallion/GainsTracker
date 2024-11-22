# Create your views here.
from django.views import generic


class IndexView(generic.ListView):
    template_name = "index.html"


class DetailView(generic.DetailView):
    template_name = "details.html"
