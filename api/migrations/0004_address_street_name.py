# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-01 10:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20161001_0318'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='street_name',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]