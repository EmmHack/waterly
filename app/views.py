import random, csv
import numpy as np, numpy.random
from pyswarm import pso
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
from api.models import Consumer, Address, Consumption, ConsumerDynamicData

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

class Login(View):
    template_name = 'app/login.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)
    
class Activities(View):
    template_name = 'app/activities.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        activities = ["Shower/Bath", "Laundry", "Car Wash", "Water the Gardern", "Fill the Pool"]
        return render(request, self.template_name, {"activities": activities})

class Competitions(View):
    template_name = 'app/competitions.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        items = [1,2,3,4,5]
        rankings = ["Hourly", "Daily", "Weekly", "Monthly", "Yearly"]
        return render(request, self.template_name, {"items":items,"rankings":rankings})
    
class Tips(View):
    template_name = 'app/tips.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)

class Profile(View):
    template_name = 'app/profile.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)

class AdminLogin(View):
    template_name = 'app/login.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)


class Maintenance(View):
    template_name = 'app/maintenance.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)


class Reports(View):
    template_name = 'app/reports.html'

    def get(self, request, *args, **kwargs):
        """

        Args:
            *args:
            **kwargs:

        Returns:

        """
        return render(request, self.template_name)


class Predictions(View):
    template_name = 'app/prediction.html'

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

        start_date = datetime(year=2016, month=1, day=1, hour=0, minute=0,
                              second=0)
        end_date = datetime.now()

        if Consumption.objects.count() != 0:
            start_date = Consumption.objects.latest('date').date
            start_date = start_date.replace(tzinfo=None)

        diff = end_date - start_date 
        diff_hours = divmod(diff.days * 86400 + diff.seconds, 60)[0] / 60

        consumers = Consumer.objects.all()
        url = reverse('create_consumption_reading')

        client = APIClient()

        while diff_hours >= 1:
            for  hour in range(24):
                date = str(start_date).replace(' ', 'T') + 'Z'

                for consumer in consumers:
                    reading = self.get_random(consumer)
                    meter_no = consumer.meter_no 
                    data = {'reading': reading, 'consumer': meter_no,
                            'date': date}
                    client.post(url, data)

                end_date = datetime.now()
                diff = end_date - start_date 
                diff_hours = divmod(diff.days * 86400 + diff.seconds, 60)[0] / 60

                if diff_hours >= 1:
                    start_date += timedelta(hours=1)
                else:
                    break;
            print start_date

        return JsonResponse({'result': 'success'})

   
    def get_random(self, consumer):
        lb = [0] * 250
        ub = [1] * 250
        
        data_model = ConsumerDynamicData.objects.filter(consumer=consumer)

        if (len(data_model) == 0):
            rand = random.uniform(150.0, 400.0) 
            data_model = ConsumerDynamicData.objects.create(
                            consumer=consumer,
                            average=rand,
                            optimal_point=rand,
                         )
        else:
            data_model = data_model[0]
        
        average = data_model.average
        optimal_point = data_model.optimal_point
        
        xopt, fopt = pso(self.evaluate, lb, ub,
                         args=[data_model.optimal_point])
        consumption = xopt.argmax() + 150
        diff = data_model.optimal_point - consumption

        if data_model.n % 24 == 0:
            data_model.optimal_point =  data_model.optimal_point - \
                                        data_model.average_diff * 2

        data_model.n = data_model.n + 1
        data_model.average_diff = (data_model.average_diff * \
                                    (data_model.n - 1) + diff) / data_model.n
        
        data_model.average = (data_model.average * (data_model.n - 1) + 
                              consumption) / data_model.n
        data_model.average_fopt = (data_model.average_fopt * \
                                    (data_model.n - 1) + fopt) / data_model.n
        data_model.save()

        return consumption

    def evaluate(self, probabilities, optimal_point):
        sum = probabilities.sum()
        probabilities =  probabilities / sum    # normalise to have sum 1
        consumption = probabilities.argmax() + 150
        result = abs(consumption - optimal_point)
        
        return result
