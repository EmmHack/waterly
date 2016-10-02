# Create your views here.
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from Thread.models import Post
from forms import *
from django.contrib.auth.models import User

def home(request):
    return render(request,'Thread/index.html')

def login(request):
    error = ""
    if request.method =='POST':
        #username = request.POST.get('username', '')
        #password = request.POST.get('password', '')
        #user = auth.authenticate(username=username, password=password)
        #if user is not None and user.is_active:
        #    auth.login(request, user)
        return render(request,'Thread/index.html')
        #else:
        #  error = "invalid password or username"
        #  auth.logout(request)
    return render(request, 'Thread/login.html',{'error':error})


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
    return render(request, 'Thread/register.html', {'form': form, 'duplicate': duplicate})

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
    return render(request, 'Thread/index.html',
                  {'posts': posts, 'form': form, 'user': request.user, 'anon': request.user.is_anonymous()})

