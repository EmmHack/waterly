from rest_framework import serializers

from api.models import Consumer, Consumption, Address, AvgMunicConsumption

class ConsumerSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Consumer
        fields = ['meter_no', 'name', 'created_at', 'modified_at']

class ConsumptionSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Consumption
        fields = ['reading', 'consumer', 'date']


class AddressSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['consumer', 'building_name', 'street_name', 'street_no',
                  'suburb_name', 'municipality_name', 'province_name']


class AvgMunicConsumptionSerialiser(serializers.ModelSerializer):
    class Meta:
        model = AvgMunicConsumption
        fields = ['munic_name', 'date', 'avg_reading']
