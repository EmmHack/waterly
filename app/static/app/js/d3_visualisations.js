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
    console.log(consumers[0].meter_no);

url = 'api/list_consumption_reading/'+consumers[0].meter_no;
    $.ajax({
        type : 'GET',
        url  : url,
        async: false,
        success :  function(data){

          console.log(data);
          /*var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

          var parseDate = d3.time.format("%Y-%m-%d").parse;
          var formatDate = d3.time.format("%d-%b-%y");
          var formated = d3.time.format("%d-%b-%y").parse;

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
              .y0(function(d) { return y(d.reading)})
              .y1(function(d) { return y(d.reading); });

          var svg = d3.select('#interactive').append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          /*d3.tsv("data.tsv", function(error, data) {
            if (error) throw error;*/

            /*data.forEach(function(d) {
              d.date= formatDate(parseDate(d.date));
              console.log(d.date);
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
                .attr("dy", ".71em");*/
                /*.style("text-anchor", "end")
                .text("Price ($)");*/

            
            // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.reading); });

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.reading); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select('#interactive').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");



data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.reading = +d.reading;
  });

  // scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.reading; })]);

   // add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // add the area
    /*svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);*/

  // add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));


        }
    });



