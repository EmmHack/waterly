import json

from django.core.urlresolvers import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APIClient

from api.models import Consumer, Address, Consumption

class APITests(APITestCase):
    
    def test_create_consumer(self):
        url = reverse('get_create_consumer')
        meter_no = '12345678901'
        name = 'Test User'
        data  = {'meter_no': meter_no, 'name': name}
        response = self.client.post(url, data, format='multipart')
        results = json.loads(response.content)

        self.assertEqual(results['name'], name)
        self.assertEqual(results['meter_no'], meter_no)

    def test_add_consumer_address(self):
        url = reverse('get_create_consumer')
        meter_no = '12345678901'
        name = 'Test User'
        data  = {'meter_no': meter_no, 'name': name}
        response = self.client.post(url, data)
        results = json.loads(response.content)

        meter_no = results['meter_no']
        url = reverse('set_consumer_address')

        consumer = Consumer.objects.filter(meter_no=meter_no)
        building_name = 'Building 1'
        street_no = 1342
        suburb_name = 'Alberton'
        municipality_name = 'Ekurhuleni'
        province_name = 'Gauteng'
        street_name = 'Test Street'

        data = {'building_name': building_name, 'street_no': street_no,
                'suburb_name': suburb_name,
                'municipality_name': municipality_name,
                'province_name': province_name,
                'street_name': street_name,
                'consumer': meter_no}

        response = self.client.post(url, data)
        results = json.loads(response.content)

        self.assertEqual(results['building_name'], building_name)
        self.assertEqual(results['street_no'], street_no)
        self.assertEqual(results['suburb_name'], suburb_name)
        self.assertEqual(results['municipality_name'], municipality_name)
        self.assertEqual(results['province_name'], province_name)
        self.assertEqual(results['street_name'], street_name)
        self.assertEqual(results['consumer'], meter_no)

    def test_create_consumption(self):
        url = reverse('get_create_consumer')
        meter_no = '12345678901'
        name = 'Test User'
        data  = {'meter_no': meter_no, 'name': name}
        response = self.client.post(url, data)
        results = json.loads(response.content)

        meter_no = results['meter_no']

        url = reverse('create_consumption_reading')

        reading = 50.9
        date = '2016-09-30'

        data = {'reading': reading, 'consumer': meter_no, 'date': date}
        response = self.client.post(url, data)
        results = json.loads(response.content)
        
        self.assertEqual(results['reading'], reading)
        self.assertEqual(results['consumer'], meter_no)
        self.assertEqual(results['date'], date)

    def test_get_avg_munic_consumption(self):
        url = reverse('upload_fixture')  
        response = self.client.get(url)
        
        munic_name = 'Ekurhuleni'
        date = '2016-10-01'
        url = reverse('avg_munic_consumption',
                      kwargs={'munic_name': munic_name, 'date': date})
        response = self.client.get(url)
        results = json.loads(response.content)
        
        self.assertEqual(results['munic_name'], munic_name)
        self.assertEqual(results['date'], date)
