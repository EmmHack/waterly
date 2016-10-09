from django.conf.urls import url

from api.views import AddListConsumers, ListCreateConsumerAddress, \
    ListCreateConsumptionReadings, CreateAvgMunicConsumption, \
    CreateConsumptionReadings, ListAvgMunicConsumption, CreateConsumption

urlpatterns = [
    url(r'^consumers/$', AddListConsumers.as_view(), name='get_create_consumer'),
    url(r'^set_consumers_address/$', ListCreateConsumerAddress.as_view(),
        name='set_consumer_address'),
    url(r'^create_consumption_reading/$', CreateConsumptionReadings.as_view(),
        name='create_consumption_reading'),
    url(r'^read_consumption_readings/$', ListCreateConsumptionReadings.as_view(),
        name='read_consumption_readings'),
    url(r'^avg_munic_consumption/(?P<munic_name>[a-zA-Z]+[a-zA-Z0-9]?)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z)/$',
        CreateAvgMunicConsumption.as_view(), name='avg_munic_consumption'),
    url(r'^list_avg_consumption/$', ListAvgMunicConsumption.as_view(), 
        name='list_avg_consumption'),
    url(r'^create_random_consumption/$', CreateConsumption.as_view(), 
        name='create_random_consumption'),
]
