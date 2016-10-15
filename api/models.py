from __future__ import unicode_literals

from django.db import models


class Consumer(models.Model):
    meter_no = models.CharField(max_length=15, primary_key=True)
    name = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class ConsumerDynamicData(models.Model):
    consumer = models.OneToOneField(
        Consumer,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    average = models.FloatField()
    optimal_point = models.FloatField()
    average_fopt = models.FloatField(default=0.0)
    average_diff = models.FloatField(default=0.0)
    n = models.IntegerField(default=1)


class Address(models.Model):
    building_name = models.CharField(max_length=30)
    street_name = models.CharField(max_length=50)
    street_no = models.IntegerField()
    suburb_name = models.CharField(max_length=30)
    municipality_name = models.CharField(max_length=30)
    province_name = models.CharField(max_length=30)
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)


class Consumption(models.Model):
    reading = models.FloatField()
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    date = models.DateTimeField()


class AvgMunicConsumption(models.Model):
    munic_name = models.CharField(max_length=30, primary_key=True)
    date = models.DateTimeField()
    avg_reading = models.FloatField()
