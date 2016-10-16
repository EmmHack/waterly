"""waterly URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from app.views import Home, Login, Competitions, Activities, Tips, Profile
from adminapp.views import AdminDashboard, Predictions, Reports, AdminLogin, \
    Maintenance
from app.views import GenerateRandomData, UploadFixture, GeneratePlotData

urlpatterns = [

    url(r'^()$',Home.as_view()),
    url(r'^app', Home.as_view()),
    url(r'^adminapp', AdminDashboard.as_view()),
    url(r'^adminlogin', AdminLogin.as_view()),
    url(r'^reports', Reports.as_view()),
    url(r'^maintenance', Maintenance.as_view()),
    url(r'^predictions', Predictions.as_view()),
    url(r'^app/generate_plot_data/$', GeneratePlotData.as_view()),
    url(r'^api/', include('api.urls')),
    url(r'^app/gen_rand_data$', GenerateRandomData.as_view(),
        name='gen_rand_data'),
    url(r'^app/upload_fixture$', UploadFixture.as_view(),
        name='upload_fixture'),
    url(r'^admin/', admin.site.urls),
    url(r'^login', Login.as_view()),
    url(r'^competitions', Competitions.as_view()),
    url(r'^activities', Activities.as_view()),
    url(r'^tips', Tips.as_view()),
    url(r'^profile', Profile.as_view()),

]