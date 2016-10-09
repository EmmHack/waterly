var data = {};
url = 'api/read_consumption_readings/';
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){

          console.log(data);
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.reading); });

var svg = d3.select('#interactive').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;*/

  data.forEach(function(d) {
    d.date= parseDate(d.date);
    d.reading = +d.reading;
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.reading; })]);

  svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em");
      /*.style("text-anchor", "end")
      .text("Price ($)");*/
        }
    });

console.log(data);
var data = [["1-May-12",582.13],["30-Apr-12",583.98],["27-Apr-12",603.00],["26-Apr-12",607.70],["25-Apr-12",610.00],["24-Apr-12",560.28],
["23-Apr-12",571.70],["20-Apr-12",572.98],["19-Apr-12",587.44],["18-Apr-12",608.34],["17-Apr-12",609.70],["16-Apr-12",580.13],
["13-Apr-12",605.23],["12-Apr-12",622.77],["11-Apr-12",626.20],["10-Apr-12",628.44],["9-Apr-12",636.23],["5-Apr-12",633.68],
["4-Apr-12",624.31],["3-Apr-12" ,629.32]];

