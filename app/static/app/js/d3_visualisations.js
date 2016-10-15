$(function(){

  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var consumers = null;
  var chosen_customer = null;
  var svg = null;
  var bar_svg = null;
  var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  url = 'api/consumers/'
  $.ajax({
      type : 'GET',
      url  : url,
      async: false,
      success :  function(data){
          consumers = data;
      }
  });

  var hours_data = null;

    url = 'api/list_consumption_reading/'+consumers[0].meter_no;
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){
            hours_data = data;
        }
    });

    var days_data = retrieve_data('day');
    var months_data = retrieve_data('month');
    var years_data = retrieve_data('year');
    var parseDateTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    var parseTime  = d3.timeParse("%Y-%m-%dT%H:%M:%S-%H:%M");

if (years_data.length >= 3){

    plot_data(hours_data, 0,'#interactive');
    bar_plot(months_data);

} 
else if (months_data.length >= 6){

    plot_data(months_data, 0,'#interactive');
    bar_plot(months_data);

}
else if (days_data.length >= 15){

    plot_data(days_data, 0,'#interactive');
    bar_plot(months_data);

}else{

    plot_data(hours_data, 1,'#interactive');
    bar_plot(months_data);

}
/**
*   function that retrive data fro a choosen date time range
*   @param level => as day or month or hours or weeks
*   @return average => average kilolitres of water used
*/
function retrieve_data(level){

    var groupdata = _.groupBy(hours_data, function(data) {
        return moment(data.date).startOf(level).format();
    });

    var averages = [];

    $.each(groupdata, function (date, group) {
        var sum = 0;

        $.each(group, function (index, consumption) {
              sum += consumption.reading;
        });
        
        var average = sum / group.length;

        var data = {'reading': average, 'date': date};
        averages.push(data);
    });

  return averages;
}

  for(var i=0; i<consumers.length; i++){

    $("#add-user").append("<li>"+consumers[i].meter_no+"</li>");
  }


  $("#add-user").on('click','li',function (){
    chosen_customer = $(this).text();

    var hours_data = null;

    url = 'api/list_consumption_reading/'+chosen_customer;
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){
            hours_data = data;
        }
    });

    var days_data = retrieve_data('day');
    var months_data = retrieve_data('month');
    var years_data = retrieve_data('year');
    var parseDateTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
    var parseTime  = d3.timeParse("%Y-%m-%dT%H:%M:%S-%H:%M");


if (years_data.length >= 3){

    plot_data(hours_data, 0,'#interactive');
    bar_plot(months_data);

} 
else if (months_data.length >= 6){

    plot_data(months_data, 0,'#interactive');
    bar_plot(months_data);

}
else if (days_data.length >= 15){

    plot_data(days_data, 0,'#interactive');
    bar_plot(months_data);

}else{

    plot_data(hours_data, 1,'#interactive');
    bar_plot(months_data);

}
/**
*   function that retrive data fro a choosen date time range
*   @param level => as day or month or hours or weeks
*   @return average => average kilolitres of water used
*/
function retrieve_data(level){

    var groupdata = _.groupBy(hours_data, function(data) {
        return moment(data.date).startOf(level).format();
    });

    var averages = [];

    $.each(groupdata, function (date, group) {
        var sum = 0;

        $.each(group, function (index, consumption) {
              sum += consumption.reading;
        });
        
        var average = sum / group.length;

        var data = {'reading': average, 'date': date};
        averages.push(data);
    });

  return averages;
}

});

/**
*   function that manipulate the date  
*   @param d => as date
*   @return month as string
*/
function getDate(d) {

      var date = new Date(d);
    return monthNames[date.getMonth()];
}

/**
*   function that plot bar graph
*   @param data objects
*   @return 
*/
function bar_plot(data){

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
   
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);

    x.domain(data.map(function(d) { return getDate(d.date); }));
    y.domain([0, d3.max(data, function(d) { return d.reading; })]);
    
    if(bar_svg == null)
    {
      bar_svg = d3.select("#catchart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
      data.forEach(function(d) {
          d.date = d.date;
          d.reading = +d.reading;
        });

        bar_svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(getDate(d.date)); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.reading); })
            .attr("height", function(d) { return height - y(d.reading); })
            .on("mouseover",function(){
              tooltip.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html("<hr/>"+d.date + "<br>" + (d.reading));
                  });
            

        bar_svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        bar_svg.append("g")
            .call(d3.axisLeft(y));

      }
      else
      {

        bar_svg.selectAll(".bar")
              .data(data)
              .attr("class", "bar")
              .attr("x", function(d) { return x(getDate(d.date)); })
              .attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d.reading); })
              .attr("height", function(d) { return height - y(d.reading); });

        bar_svg.select("g .y-axis")
               .call(d3.axisLeft(y));

        bar_svg.select("g .x-axis")
               .call(d3.axisBottom(x));
      }

    
}

/**
*   function that plot area-scatter chart
*   @param data => objects; type => time choice; id_division
*   @return 
*/
function plot_data(data, type,id_division){

      var screen_width = document.querySelector("#interactive").clientWidth, 
      screen_height = document.querySelector("#interactive").clientHeight;
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);
      var bisectDate = d3.bisector(function(d) { return d.date; }).left;

      var area = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return y(d.reading); });

      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.reading); });

      data.forEach(function(d) {
            if (type == 0){
              d.date = parseTime(d.date);
            }
            else{
              d.date = parseDateTime(d.date);
            }

            d.reading = +d.reading;
        });

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.reading; })]);

         // DON'T DELETE YOU WILL GET YOURSELF KILLED.
        /*svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);*/

        if(svg == null)
        {

          svg = d3.select(id_division).append("svg")
            .attr("width", "100%")
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");

          svg.append("path")
               .data([data])
               .attr("class", "area")
               .attr("d", area);

          svg.selectAll("dot")
              .data(data)
            .enter().append("circle")
              .attr("r", 3)
              .style("background","red")
              .on("mouseover", function(d) { 
                  tooltip.style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html("<h5>Details</h5><hr/>"+getDate((d.date)) + "<br>" + (d.reading));})
              .on("mouseout", function(d) { tooltip.style("display", "none");})
              .on("mousemove", function(d){

                  d3.select(this).style({'background':'green','color':'white'});
              })
              .on("click",function(d){
                  console.log("#TO DO");
              })
              .attr("cx", function(d) { return x(d.date); })
              .attr("cy", function(d) { return y(d.reading); });

          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .attr("class","x-axis")
              .call(d3.axisBottom(x));

          svg.append("g")
              .attr("class","y-axis")
              .call(d3.axisLeft(y));

          var focus = svg.append("g")
          .attr("class", "focus")
          .style("display", "none");

        
        }
        else{

          var trans = d3.transition()
              .duration(750);

          svg.selectAll("circle")
            .data(data)
            .attr("r", 3)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.reading); });

          svg.select("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area);

          svg.select("g .y-axis")
              .call(d3.axisLeft(y));

        }
         
      }

  

});




