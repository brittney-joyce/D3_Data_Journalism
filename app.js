// Set up our chart
var svgWidth = 1000;
var svgHeight = 700;
var margin = {
   top: 30, right: 40, bottom: 100, left: 100
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins

var svg = d3.select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// append an svg group
var chartGroup= svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// url = "/data";
d3.csv("degreeData.csv", function(err, csvdata) {
    if (err) throw err;


    // Step 1: Parse Data/Cast as numbers
      // ==============================
     csvdata.forEach(function(data) {
       data.bachelorsDegree = +data.bachelorsDegree;
       data.income = +data.income;
     });

     // Step 2: Create scale functions
     // ==============================
     var xLinearScale = d3.scaleLinear()
       .domain([0, d3.max(csvdata, d => d.bachelorsDegree)])
       .range([0, width]);

     var yLinearScale = d3.scaleLinear()
       .domain([0, d3.max(csvdata, d => d.income)])
       .range([height, 0]);

     // Step 3: Create axis functions
     // ==============================
     var bottomAxis = d3.axisBottom(xLinearScale);
     var leftAxis = d3.axisLeft(yLinearScale);

     // Step 4: Append Axes to the chart
     // ==============================
     chartGroup.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(bottomAxis);

     chartGroup.append("g")
      .attr("class", "y axis")
       .call(leftAxis);

      // Step 5: Create Circles
     // ==============================
     var circlesGroup = chartGroup.selectAll("circle")
     .data(csvdata)
     .enter()
     .append("circle")
     .attr("cx", d => xLinearScale(d.bachelorsDegree))
     .attr("cy", d => yLinearScale(d.income))
     .attr("r", "15")
     .attr("fill", "pink")
     .attr("opacity", ".5");

     // Step 6: Initialize tool tip
     // ==============================
     var toolTip = d3.tip()
       .attr("class", "tooltip")
       .offset([80, -60])
       .html(function(d) {
         return (`${d.state}<br>Bachelor's Degree: ${d.bachelorsDegree}<br>Income $50k+: ${d.income}`);
       });

     // Step 7: Create tooltip in the chart
     // ==============================
     chartGroup.call(toolTip);

     // Step 8: Create event listeners to display and hide the tooltip
     // ==============================
     circlesGroup.on("mouseover", function(data) {
       toolTip.show(data);
     })
       // onmouseout event
       .on("mouseout", function(data, index) {
         toolTip.hide(data);
       });


       // Create axes labels
       chartGroup.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 0 - margin.left )
         .attr("x", 0 - (height / 2))
         .attr("dy", "1em")
         .attr("class", "axisText")
         .text("Income in Thousands $");

       chartGroup.append("text")
         .attr("transform", `translate(${width / 2}, ${height + margin.top })`)
         .attr("class", "axisText")
         .text("Percentage of Population with a Bachelor's Degree");
     });
