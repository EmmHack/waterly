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

    //var stop_date = new Date();

    /**
    */

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
/**
    $.plot("#catchart", [ data ], {
        series: {
            bars: {
                show: true,
                barWidth: 0.6,
                align: "center"
            }
        },
        xaxis: {
            mode: "categories",
            tickLength: 0
        }
    });


function euroFormatter(v, axis) {
    return v.toFixed(axis.tickDecimals) + "€";
}

function doPlot(position) {
    $.plot("#timechart", [
        { data: oilprices, label: "Oil price ($)" },
        { data: exchangerates, label: "USD/EUR exchange rate", yaxis: 2 }
    ], {
        xaxes: [ { mode: "time" } ],
        yaxes: [ { min: 0 }, {
            // align if we are to the right
            alignTicksWithAxis: position == "right" ? 1 : null,
            position: position,
            tickFormatter: euroFormatter
        } ],
        legend: { position: "sw" }
    });
}

doPlot("right");

//});

// Morris Bar Chart
Morris.Bar({
    element: 'hero-bar',
    data: [
        {device: '1', sells: 136},
        {device: '3G', sells: 1037},
        {device: '3GS', sells: 275},
        {device: '4', sells: 380},
        {device: '4S', sells: 655},
        {device: '5', sells: 1571}
    ],
    xkey: 'device',
    ykeys: ['sells'],
    labels: ['Sells'],
    barRatio: 0.4,
    xLabelMargin: 10,
    hideHover: 'auto',
    barColors: ["#3d88ba"]
});


// Morris Donut Chart
Morris.Donut({
    element: 'hero-donut',
    data: [
        {label: 'Direct', value: 25 },
        {label: 'Referrals', value: 40 },
        {label: 'Search engines', value: 25 },
        {label: 'Unique visitors', value: 10 }
    ],
    colors: ["#30a1ec", "#76bdee", "#c4dafe"],
    formatter: function (y) { return y + "%" }
});

// Morris Donut Chart
Morris.Donut({
    element: 'hero-donut2',
    data: [
        {label: 'Google', value: 25 },
        {label: 'Yahoo', value: 40 },
        {label: 'Bing', value: 25 },
        {label: 'Yandex', value: 10 }
    ],
    colors: ["#30a1ec", "#76bdee", "#c4dafe"],
    formatter: function (y) { return y + "%" }
});


// Morris Line Chart
var tax_data = [
    {"period": "2013-04", "visits": 2407, "signups": 660},
    {"period": "2013-03", "visits": 3351, "signups": 729},
    {"period": "2013-02", "visits": 2469, "signups": 1318},
    {"period": "2013-01", "visits": 2246, "signups": 461},
    {"period": "2012-12", "visits": 3171, "signups": 1676},
    {"period": "2012-11", "visits": 2155, "signups": 681},
    {"period": "2012-10", "visits": 1226, "signups": 620},
    {"period": "2012-09", "visits": 2245, "signups": 500}
];
Morris.Line({
    element: 'hero-graph',
    data: tax_data,
    xkey: 'period',
    xLabels: "month",
    ykeys: ['visits', 'signups'],
    labels: ['Visits', 'User signups']
});



// Morris Area Chart
Morris.Area({
    element: 'hero-area',
    data: [
        {period: '2010 Q1', iphone: 2666, ipad: null, itouch: 2647},
        {period: '2010 Q2', iphone: 2778, ipad: 2294, itouch: 2441},
        {period: '2010 Q3', iphone: 4912, ipad: 1969, itouch: 2501},
        {period: '2010 Q4', iphone: 3767, ipad: 3597, itouch: 5689},
        {period: '2011 Q1', iphone: 6810, ipad: 1914, itouch: 2293},
        {period: '2011 Q2', iphone: 5670, ipad: 4293, itouch: 1881},
        {period: '2011 Q3', iphone: 4820, ipad: 3795, itouch: 1588},
        {period: '2011 Q4', iphone: 15073, ipad: 5967, itouch: 5175},
        {period: '2012 Q1', iphone: 10687, ipad: 4460, itouch: 2028},
        {period: '2012 Q2', iphone: 8432, ipad: 5713, itouch: 1791}
    ],
    xkey: 'period',
    ykeys: ['iphone', 'ipad', 'itouch'],
    labels: ['iPhone', 'iPad', 'iPod Touch'],
    lineWidth: 2,
    hideHover: 'auto',
    lineColors: ["#81d5d9", "#a6e182", "#67bdf8"]
  });



// Build jQuery Knobs
$(".knob").knob();

function labelFormatter(label, series) {
    return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
}*/
});
