$(function() {  

    var consumers = null;
    
    url = 'api/consumers/'
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){
            consumers = data;
        }
    });


    var consumptions = null;
    
    url = 'api/read_consumption_readings/'
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){
            consumptions = data;
        }
    });


    if (consumptions.length == 0) {
        generateSimulationData();
    }

    function generateSimulationData() {
        var start_date = new Date(2016, 09, 07, 00, 00, 00);
        var end_date = new Date();
        while (start_date < end_date) {

            $.each(consumers, function (index, consumer) {
                for (var hour = 0; hour < 24; hour++) {
                    var reading = Math.random() * (400 - 150) + 150;
                    var meter_no = consumer.meter_no; 
                    var date = prependZero(start_date.getFullYear()) + "-" +
                               prependZero(start_date.getMonth() + 1) + "-" +
                               prependZero(start_date.getDate()) + "T" +
                               prependZero(start_date.getHours()) + ":" +
                               prependZero(start_date.getMinutes()) + ":" +
                               prependZero(start_date.getSeconds()) + "Z";
                    var data = {'reading': reading, 'consumer': meter_no,
                                'date': date};
                    createConsumption(data);
                }
            });

            var nextHours = start_date.getHours() + 1;
            start_date = new Date(start_date.setHours(nextHours));
        }
    }

    function createConsumption(data) {
        url = 'api/create_consumption_reading/';
        $.ajax({
            type : 'POST',
            url  : url,
            data : data,
            async: false,
        });
    }


    function prependZero(value) {
       return value < 10? "0" + value: value;
    }


    url = 'api/list_avg_consumption/';
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){
            console.log(data);
        }
    });

    var data = []
    for (var i = 0; i < 5; i++) {
         var d = {}
         d['reading'] = consumptions[i]['reading'];
         d['meter_no'] = consumptions[i]['consumer']
         data.push(d);
    }

    
    for (var i = 0; i < consumers.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j]['meter_no'] === consumers[i]['meter_no']) {
                data[j]['name'] = consumers[i]['name'];
            }
        }
    }

    for (var i = 0; i < consumers.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (data[j]['meter_no'] === consumers[i]['meter_no']) {
                data[j]['name'] = consumers[i]['name'];
            }
        }
    }

   var names_important = [];
    for (var i = 7; i < 11; i++) {
        var d = {};
        d['reading'] = consumptions[i]['reading'];
        d['meter_no'] = consumptions[i]['consumer'];        
        names_important.push(d);
    
    }


    $('#dataTables_empty').remove();

  
    for (var i = 0; i < data.length; i++) {
        if(i < 2){
            $("#tbl_champs").append("<tr class='success' ><td>" + (i+1) +
                                    "</td><td>" + data[i]['name'] +
                                    "</td><td>" + data[i]['reading'] +
                                    "</td></tr>");
        }else if (i < 4) {
            $("#tbl_champs").append("<tr class='warning' ><td>" + (i+1) +
                                    "</td><td>" + data[i]['name'] +
                                    "</td><td>" + data[i]['reading'] +
                                    "</td></tr>");
        }
        else {
            $("#tbl_champs").append("<tr class='danger' ><td>" + (i+1) +
                                    "</td><td>" + data[i]['name'] +
                                    "</td><td>" + data[i]['reading'] +
                                    "</td></tr>");
        }
    }


    for (var i = 0; i < data.length; i++) {
        if(i < 2){
            $("#tbl_overall").append("<tr class='success' ><td>" + (i+1) +
                                     "</td><td>" + data[i]['name'] +
                                     "</td><td>" + data[i]['reading'] +
                                     "</td></tr>");
        }else if (i < 4) {
            $("#tbl_overall").append("<tr class='warning' ><td>" + (i+1) +
                                     "</td><td>" + data[i]['name'] +
                                     "</td><td>" + data[i]['reading'] +
                                     "</td></tr>");
        }
        else {
            $("#tbl_overall").append("<tr class='danger' ><td>" + (i+1) +
                                     "</td><td>" + data[i]['name'] +
                                     "</td><td>" + data[i]['reading'] +
                                     "</td></tr>");
        }
    }

    for (var i = 0; i < names_important.length; i++) {
        if(i < 2){
            $("#tbl_overall1").append("<tr class='success' ><td>" + (i+1) +
                                      "</td><td>" + names_important[i]['meter_no'] +
                                      "</td><td>" + names_important[i]['reading'] +
                                      "</td></tr>");
        }else if (i < 4) {
            $("#tbl_overall1").append("<tr class='warning' ><td>" + (i+1) +
                                      "</td><td>" + names_important[i]['meter_no'] +
                                      "</td><td>" + names_important[i]['reading'] +
                                      "</td></tr>");
        }
        else {
            $("#tbl_overall1").append("<tr class='danger' ><td>" + (i+1) +
                                      "</td><td>" + names_important[i]['meter_no'] +
                                      "</td><td>" + names_important[i]['reading'] +
                                      "</td></tr>");
        }
    }

});
