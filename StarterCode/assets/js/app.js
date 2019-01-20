// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var scatterGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "noHealthInsurance";
console.log(chosenYAxis);

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) *1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// new labels
function renderCircleLables(circlesLabels, newXScale, chosenXaxis) {

   circlesLabels.transition()
       .duration(1000)
       .attr("x", d => newXScale(d[chosenXAxis]));

   return circlesLabels;
}
// function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//     if (chosenXAxis === "poverty") {
//       var label = "In Poverty (%)";
//     }
//     else if (chosenXAxis === "age") {
//         var label = "Age (Median)";
//       }
//     else {
//       chosenXAxis == "income";
//       var label = "Household Income (Median)";
//     }
  
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .style("position", "absolute")			 
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.state}<br>Lacks Health Insurance: ${d.noHealthInsurance}`);
//       });
  
//     circlesGroup.call(toolTip);
  
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
  
//     return circlesGroup;
// }

// load data
d3.csv("assets/data/data_2.csv")
    .then(function(censusData){
   

    console.log(censusData);

   

    censusData.forEach(function(d){
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.noHealthInsurance = +d.noHealthInsurance;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        console.log(d.noHealthInsurance);
        console.log(d.abbr)
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.noHealthInsurance)])
    .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      
    // append x axis
    var xAxis = scatterGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    
    // append y axis
    scatterGroup.append("g")
    .call(leftAxis);

    // append initial circles
    var circlesGroup = scatterGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.noHealthInsurance))
    .attr("r", 12)
    .attr("fill", "skyblue")
    .attr("stroke", "lightblue")
    .attr("opacity", ".7");

    var circleLabelGroup = scatterGroup.selectAll("tspan")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.noHealthInsurance))
    .style("font-size",9)
    .attr("fill","white")
    .style("text-anchor", "middle")
    .text(d => d.abbr);

    // Create group for  3 x- axis labels
    var labelsGroup = scatterGroup.append("g")
      .attr("transform", `translate(${width / 3}, ${height + 20})`);
    
    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty(%)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var householdIncomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

    // Create group for 3 y-axis labels
    var yLabelsGroup = scatterGroup.append("g")
    .attr("transform", "rotate(-90)")
    //.attr("y", 0 - margin.left)
    //.attr("x", 20 - (height / 2))
    //.attr("dy", "1em")
    //.classed("axis-text", true)
    // append y axis
    var healthInsuranceLabel = yLabelsGroup.append("text")
    .attr("value", "noHealthInsurance") // value to grab for event listener
    .classed("active", true)
    .classed("axis-text", true)
    .attr("y", 12 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "3em")
    .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
    .attr("value", "smokes") // value to grab for event listener
    .classed("iactive", true)
    .classed("axis-text", true)
    .attr("y", 10 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "2em")
    .text("Smokes (%)");

    
    var obeseLabel = yLabelsGroup.append("text")
    .attr("value", "obese") // value to grab for event listener
    .classed("iactive", true)
    .classed("axis-text", true)
    .attr("y", 10 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("Obese (%)");
    
    
    


    // updateToolTip function above csv import
    //var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates circles with new x values
        circleLabelGroup = renderCircleLables(circleLabelGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        householdIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
        householdIncomeLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
        }
        else if (chosenXAxis == "poverty"){
      povertyLabel
      .classed("active", true)
      .classed("inactive", false);
      householdIncomeLabel
          .classed("active", false)
          .classed("inactive", true);
      ageLabel
      .classed("active", false)
      .classed("inactive", true);
        }
    }
    }); // end labelsGroup event listner

    yLabelsGroup.selectAll("text")
    .on("click",function(){

      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis){

        // replaces chosenYaxsis with value
        chosenYAxis = value;

        console.log(value)

        //update y scale for new data
      
      // change classes to change bold text

      
      if (chosenYAxis == "noHealthInsurance"){
        healthInsuranceLabel
        .classed("active", true)
        .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
        .classed("active", false)
        .classed("inactive", true);

      }
      
      else if (chosenYAxis == "smokes"){
        smokesLabel
        .classed("active", true)
        .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        healthInsuranceLabel
        .classed("active", false)
        .classed("inactive", true);

      }

      else if (chosenYAxis == "obese"){
        obeseLabel
        .classed("active", true)
        .classed("inactive", false);
        healthInsuranceLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
        .classed("active", false)
        .classed("inactive", true);

      }
     
      
        

      } // ends if value function

    }); //end yLabelsGroup event listner
    


}); // end d3.csv
