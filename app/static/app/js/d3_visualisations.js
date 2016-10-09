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

if (years_data.length >= 3) {
    plot_data(hours_data, 0);
} else if (months_data.length >= 6) {
    plot_data(months_data, 0);
} else if (days_data.length >= 15) {
    plot_data(days_data, 0);
} else {
    plot_data(hours_data, 1);
}


function retrieve_data(level) {
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


function plot_data(data, type){
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

    var svg = d3.select('#interactive').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

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

      svg.append("path")
           .data([data])
           .attr("class", "area")
           .attr("d", area);

      // Add the scatterplot
      svg.selectAll("dot")
          .data(data)
        .enter().append("circle")
          .attr("r", 5)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove)
          .on("click",function(d){
              console.log("#TO DO");
          })
          .attr("cx", function(d) { return x(d.date); })
          .attr("cy", function(d) { return y(d.reading); })
          .call(zoom);
        

      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

      var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

      focus.append("circle")
          .attr("r", 4.5);

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      /*svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)*/
          

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.reading) + ")");
        focus.select("text").text(d.reading);
      }
}




