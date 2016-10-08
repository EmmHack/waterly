import random, csv

from datetime import datetime, timedelta

from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from app.models import Post
from forms import *
from django.contrib.auth.models import User
from django.views import View

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

        print new_date

        consumers = Consumer.objects.all()

        for consumer in consumers:
           rand = random.randrange(150, 400) 

           Consumption.objects.create(consumer=consumer, 
                                      date=new_date, reading=rand)

           return JsonResponse({'result': 'data generate successfully'})


class UploadFixture(View):

    def get(self, request, *args, **kwargs):

        with open('datafiles/consumers.csv', 'rb') as consumers:
            reader = csv.reader(consumers, delimiter=',', quotechar='|')
            next(reader, None) 
            for row in reader:
                name = row[0]
                meter_no = row[1]
                Consumer.objects.create(name=name, meter_no=meter_no)

        with open('datafiles/addresses.csv', 'rb') as addresses:
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

        with open('datafiles/consumption.csv', 'rb') as consumption:
            reader = csv.reader(consumption, delimiter=',', quotechar='|')
            next(reader, None) 
            for row in reader:
                meter_no = row[0]
                reading = row[1]
                date = row[2].replace('/', '-')

                consumer = Consumer.objects.filter(meter_no=meter_no)[0]
                Consumption.objects.create(consumer=consumer, reading=reading,
                                           date=date)

        response =  {'result': 'data uploaded successfully'}
        return JsonResponse(response)

