from django.conf.urls import url

from api.views import AddListConsumers, ListCreateConsumerAddress, \
    ListCreateConsumptionReadings, ListAvgMunicConsumption, \
    CreateConsumptionReadings, Hope

urlpatterns = [
    url(r'^consumers/$', AddListConsumers.as_view(), name='get_create_consumer'),
    url(r'^set_consumers_address/$', ListCreateConsumerAddress.as_view(),
        name='set_consumer_address'),
    url(r'^create_consumption_reading/$', CreateConsumptionReadings.as_view(),
        name='create_consumption_reading'),
    url(r'^read_consumption_readings/$', ListCreateConsumptionReadings.as_view(),
        name='read_consumption_readings'),
    url(r'^avg_munic_consumption/(?P<munic_name>[a-zA-Z]+[a-zA-Z0-9]?)/(?P<date>[0-9]{4}-[0-9]{2}-[0-9]{2})/$', ListAvgMunicConsumption.as_view(),
        name='avg_munic_consumption'),
    url(r'^get_hope/$', Hope.as_view(), name='hope'),
]
