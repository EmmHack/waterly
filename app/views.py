import random, csv

from datetime import datetime, timedelta

from django.shortcuts import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from app.models import Post
from forms import *
from django.contrib.auth.models import User
from django.views import View
from rest_framework.test import APIClient
from api.models import Consumer, Address, Consumption


class Home(View):
    template_name = 'app/index.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)


class Registration(View):
    template_name = 'app/register.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)


class GenerateRandomData(View):
    """Generate random data which simulates smart meters.
    
    """

    def get(self, *args, **kwargs):
        """Read last date in the database and generate meter readings
        for the following day.
        
        """

        last_date = Consumption.objects.filter().order_by('-id')[0].date
        new_date = datetime.strptime(str(last_date), '%Y-%m-%d') + timedelta(
            days=1)

        consumers = Consumer.objects.all()

        for consumer in consumers:
            rand = random.randrange(150, 400)

            Consumption.objects.create(consumer=consumer,
                                       date=new_date, reading=rand)

            return JsonResponse({'result': 'data generate successfully'})


class UploadFixture(View):
    def get(self, request, *args, **kwargs):

        with open('datafiles/consumers10.csv', 'rb') as consumers:
            reader = csv.reader(consumers, delimiter=',', quotechar='|')
            next(reader, None)
            for row in reader:
                name = row[0]
                meter_no = row[1]
                Consumer.objects.create(name=name, meter_no=meter_no)

        with open('datafiles/addresses10.csv', 'rb') as addresses:
            reader = csv.reader(addresses, delimiter=',', quotechar='|')
            next(reader, None)
            for row in reader:
                meter_no = row[0]
                building_name = row[1]
                street_no = row[2]
                street_name = row[3]
                suburb_name = row[4]
                municipality_name = row[5]
                province_name = row[6]

                consumer = Consumer.objects.filter(meter_no=meter_no)[0]
                Address.objects.create(consumer=consumer,
                                       building_name=building_name,
                                       street_no=street_no,
                                       street_name=street_name,
                                       suburb_name=suburb_name,
                                       municipality_name=municipality_name,
                                       province_name=province_name)

        response = {'result': 'data uploaded successfully'}
        return JsonResponse(response)

class GeneratePlotData(View):

    def get(self, request, *args, **kwargs):

        start_date = datetime(year=2016, month=9, day=1, hour=0, minute=0,
                              second=0)
        end_date = datetime.now()
        consumers = Consumer.objects.all()
        url = reverse('create_consumption_reading')
        client = APIClient()

        while start_date < end_date:
            for  hour in range(24):
                date = str(start_date).replace(' ', 'T') + 'Z'

                for consumer in consumers:
                    reading = self.get_random()
                    meter_no = consumer.meter_no 
                    data = {'reading': reading, 'consumer': meter_no,
                            'date': date}
                    client.post(url, data)

                start_date += timedelta(hours=1)

        return JsonResponse({'result': 'success'})

   
    def get_random(self):
        return random.randrange(150, 400)
