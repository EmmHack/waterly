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

def home(request):
    return render(request,'app/index.html')

def login(request):
    error = ""
    if request.method =='POST':
        #username = request.POST.get('username', '')
        #password = request.POST.get('password', '')
        #user = auth.authenticate(username=username, password=password)
        #if user is not None and user.is_active:
        #    auth.login(request, user)
        return render(request,'app/index.html')
        #else:
        #  error = "invalid password or username"
        #  auth.logout(request)
    return render(request, 'app/login.html',{'error':error})


def register(request):
    duplicate = False
    if request.POST:
        username = request.POST.get('username')
        if User.objects.filter(username=username):
            duplicate = True
        else:
            user = User.objects.create_user(username=username, password=request.POST.get('password'),
                                            email=request.POST.get('email'))
            user.firstname = request.POST.get('first_name')
            user.lastname = request.POST.get('last_name'),
            user.save()
            return HttpResponseRedirect("/login/?reg=1")
    form = register_form()
    return render(request, 'app/register.html', {'form': form, 'duplicate': duplicate})

def thread(request):
    if request.POST:
        if not request.user.is_anonymous():
            if request.POST['todo'] == 'add':
                Post.objects.create(username=request.user.username, text=request.POST['text'])
            elif request.POST['todo'] == 'del':
                id_to_delete = request.POST['del_id']
                if Post.objects.filter(id=id_to_delete):
                    post_to_delete = Post.objects.filter(id=id_to_delete)[0]
                    if request.user.username == post_to_delete.username:
                        post_to_delete.delete()
    posts = Post.objects.order_by('time')
    form = submit_post()
    return render(request, 'app/index.html',
                  {'posts': posts, 'form': form, 'user': request.user, 'anon': request.user.is_anonymous()})


class GenerateRandomData(View):
    """Generate random data which simulates smart meters.
    
    """

    def get(self, *args, **kwargs):
        """Read last date in the database and generate meter readings
        for the following day.
        
        """

        last_date = Consumption.objects.filter().order_by('-id')[0].date
        new_date = datetime.strptime(str(last_date), '%Y-%m-%d') + timedelta(days=1)

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

        response =  {'result': 'data uploaded successfully'}
        return JsonResponse(response)

class GeneratePlotData(View):

    def get(self, request, *args, **kwargs):

        start_date = datetime(year=2016, month=9, day=7, hour=0, minute=0, 
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
