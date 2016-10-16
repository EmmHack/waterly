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

    console.log(consumers);

    // Get latest data
    setInterval(gen_latest_data, 3600000)
    gen_latest_data();
    
    function gen_latest_data() {
        url = 'app/generate_plot_data';
        $.ajax({
            type : 'GET',
            url  : url,
            async: false,
        });
    }

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

    function prependZero(value) {
       return value < 10? "0" + value: value;
    }

    url = 'api/list_avg_consumption/';
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
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
                                    "</td><td>" + data[i]['group_name'] +
                                    "</td></tr>");
        }else if (i < 4) {
            $("#tbl_champs").append("<tr class='warning' ><td>" + (i+1) +
                                    "</td><td>" + data[i]['name'] +
                                    "</td><td>" + data[i]['reading'] +
                                    "</td><td>" + data[i]['group_name'] +
                                    "</td></tr>");
        }
        else {
            $("#tbl_champs").append("<tr class='danger' ><td>" + (i+1) +
                                    "</td><td>" + data[i]['name'] +
                                    "</td><td>" + data[i]['reading'] +
                                    "</td><td>" + data[i]['group_name'] +
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
