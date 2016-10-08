from django.test import TestCase
from django.shortcuts import reverse

from api.models import Consumption


class AppTests(TestCase):

    def test_generate_random_data(self):
        url = reverse('upload_fixture')
        response = self.client.get(url)

        url = reverse('gen_rand_data')
        response = self.client.get(url)

        last = '2016-10-02'

        l = Consumption.objects.filter().order_by('-id')[0]

        self.assertEqual(last, str(l.date))
