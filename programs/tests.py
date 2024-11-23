from django.test import TestCase
from django.urls import reverse


class ProgramsIndexViewTests(TestCase):
    def test_no_programs(self):
        """
        If no programs exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse("programs:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No programs are available.")
        self.assertQuerySetEqual(response.context["programs_list"], [])
