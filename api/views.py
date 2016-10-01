from django.shortcuts import render
from rest_framework.test import APIClient
from rest_framework import generics
from rest_framework.response import Response
from django.db.models import Q
from django.db.models.query import QuerySet

from api.models import Consumer, Address, Consumption
from api.serialisers import ConsumerSerialiser, ConsumptionSerialiser, \
    AddressSerialiser, AvgMunicConsumptionSerialiser, AvgMunicConsumption


class ListCreateConsumptionReadings(generics.ListCreateAPIView):
    """Get consumption data for particular consumer in the city.
    
    """

    serializer_class = ConsumptionSerialiser

    def get(self, *args, **kwargs):
        """Given identifier for the consumer get their consumption data
        
        Kwargs:
            kwargs['meter_no'] (str): Meter number for the consumer.

        """

        meter_no = kwargs['meter_no']
        queryset = self.get_queryset(meter_no)
        serializer = ConsumptionSerialiser(queryset, many=True)

        return Response(serializer.data)

    def get_queryset(self, meter_no):
        """Construct queryset based on the given consumer.
        
        Args:
            meter_no (str): Meter number.

        Returns:
           QuerySet: All the consumption records for the consumer.

        """

        # TODO: Specify the start date to read from

        queryset = Consumption.objects.filter(meter_no=meter_no)
        return queryset


class ListAvgMunicConsumption(generics.ListAPIView):
    
    serializer_class = AvgMunicConsumptionSerialiser

    def get(self, *args, **kwargs):
        """Given municipality calculate and return the average
        municipality water consumption for given day.
        
        Kwargs:
            kwargs['munic_name'] (str): Municipality name.
            kwargs['date'] (str): Date to get average on.

        """

        munic_name = kwargs['munic_name']
        date = kwargs['date']
        queryset = self.get_queryset(munic_name, date)
        serializer = AvgMunicConsumptionSerialiser(queryset, many=False)

        return Response(serializer.data)

    def get_queryset(self, munic_name, date):
        """Construct queryset based on municipality and date.
        
        Args:
            munic_name (str): Municipality name.
            date (str): Date to get average on.

        Returns:
           model: Average consumption of the municipality for the given
            day.

        """
        addresses = Address.objects.filter(municipality_name=munic_name)
        consumptions = Consumption.objects.filter(date = date)
        
        sum_readings = 0.0
        count = 0

        for address in addresses:
            for consumption in consumptions:
                if consumption.consumer == address.consumer:
                    sum_readings = sum_readings + consumption.reading
                    count += 1

        average = sum_readings / count
        queryset = AvgMunicConsumption.objects.create(munic_name=munic_name, 
                                                      date=date,
                                                      avg_reading=average)

        return queryset


class GetConsumers(generics.ListAPIView):
    """Get consumer entries from the api.
    
    Attributes:
        queryset (models): All consumers.
        serializer_class (object): Serializer (json)
            
    """

    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerialiser


class AddListConsumers(generics.ListCreateAPIView):
    """Add consumer consumption for the day. 
    
    Attributes:
        queryset (models): All Consumers.
        serializer_class (object): Serializer (json)
            
    """

    queryset = Consumer.objects.all()
    serializer_class = ConsumerSerialiser


class ListCreateConsumerAddress(generics.ListCreateAPIView):
    """Create or List consumer addres given meter_no.
    
    Attributes:
        queryset (models): All Addresses.
        serializer_class (object): Serializer (json)
            
    """

    queryset = Address.objects.all()
    serializer_class = AddressSerialiser


class GetConsumerAddress(generics.ListCreateAPIView):
    """Get consumer address given the meter number.
    
    """

    def get(self, *args, **kwargs):
        """Given meter number get consumer address as model
        
        Kwargs:
            kwargs['meter_no'] (str): Meter number for the consumer.

        """

        meter_no = int(kwargs['meter_no'])
        queryset = self.get_queryset(meter_no)
        serializer = AddressSerialiser(queryset, many=False)

        return Response(serializer.data)

    def get_queryset(self, meter_no):
        """Construct queryset based on the given consumer.
        
        Args:
            meter_no (str): Meter number.

        Returns:
           model: The address of a give consumer.

        """

        queryset = Address.objects.filter(meter_no=meter_no)[0]
        return queryset
