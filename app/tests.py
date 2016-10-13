import random
from datetime import datetime, timedelta

from django.test import TestCase
from django.shortcuts import reverse

from api.models import Consumption, Consumer


class AppTests(TestCase):

    def setUp(self):
       pass 

    def generate_random_data(self):
        url = reverse('upload_fixture')
        response = self.client.get(url)

        url = reverse('gen_rand_data')
        response = self.client.get(url)

        last = '2016-10-02'

        l = Consumption.objects.filter().order_by('-id')[0]

        self.assertEqual(last, str(l.date))

    def test_generate_plot_data(self):
        url = reverse('upload_fixture')
        response = self.client.get(url)
        
        url = reverse('get_plot_data')
        response = self.client.get(url)
        count1 = Consumption.objects.count()

        url = reverse('get_plot_data')
        response = self.client.get(url)
        count2 = Consumption.objects.count()

        self.assertEqual(count1, count2)
