from django.shortcuts import render
from django.views import View


class AdminDashboard(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'adminapp/index.html')


class AdminLogin(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'adminapp/login.html')


class Maintenance(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'adminapp/maintenance.html')


class Reports(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'adminapp/reports.html')


class Predictions(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'adminapp/reports.html')
