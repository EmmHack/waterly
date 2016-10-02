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
from Thread.views import login, register,thread,home
from django.contrib import admin

urlpatterns = [

    url(r'^$',home),
    url(r'^app',thread),
    url(r'^(?:accounts/){0,1}log((?:in)|(?:out))/{0,1}$', login),
    url(r'^(?:app)|(?:thread)/{0,1}$', thread),
    url(r'^signup/{0,1}$', register),
    url(r'^api/',include('api.urls')),
    url(r'^admin/', admin.site.urls),
]