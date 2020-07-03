// @TODO: YOUR CODE HERE!



var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
      };

    
var svgHeight = window.innerHeight;
var svgWidth = window.innerWidth;

var margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
      };

var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

var svg = d3.select("body").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);


var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

var ChosenXAxis = "poverty";
var ChosenYAxis = "healthcare";

function yScale(Dataset, ChosenYAxis){

        var yLinearScale = d3.scaleLinear()
            .domain(d3.min(Dataset, d=> d[ChosenYAxis]),
            d3.max(Dataset, d=>d[ChosenYAxis]))
            .range([chartHeight,0])
    }

function xScale (Dataset, ChosenXAxis){

        var xLinearScale = d3.scaleLinear()
                .domain([d3.min(Dataset, d=> d[ChosenXAxis]),
                d3.max(Dataset, d=>d[ChosenXAxis])
            ])
            .range([0, chartWidth]);
        return xLinearScale;
        
    }

function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
      
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
      
        return xAxis;
      }

function updateToolTip(ChosenXAxis, circleGroup) {

        var label;
      
        if (ChosenXAxis === "poverty") {
          label = "Poverty:";
        }
        if (ChosenXAxis === "age") {
            label = "Age:";}
        if 
        (ChosenXAxis === "income") {
                label = "Median Household Income:";}
      
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>${d.state}</strong><br><strong>${label} ${d[ChosenXAxis]}<strong>`);
          });
      
        circlesGroup.call(toolTip);
      
        circlesGroup.on("mouseover", function(data) {
          toolTip.show(data);
        })
          // onmouseout event
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
      
        return circleGroup;
      }

    function renderCircles(circleGroup, newXScale, ChosenXAxis) {

        circleGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d[ChosenXAxis]));
      
        return circleGroup;
      }

d3.csv("assets/data/data.csv").then(Dataset=>{

        Dataset.forEach(data =>{

            data.poverty= +data.poverty;
            data.healthcare = +data.healthcare
        })

        // console.log(Dataset)
        var yScale = d3.scaleLinear()
            .domain(d3.extent(Dataset, d=>d.healthcare))
            .range([chartHeight,0])

        var yLinearScale = yScale(Dataset,ChosenYAxis)
        var xLinearScale = xScale(Dataset,ChosenXAxis)
        
        var leftAxis = d3.axisLeft(yLinearScale);
        var bottomAxis = d3.axisBottom(xLinearScale); 

        var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    
       var yAxis = chartGroup.append("g")
        .call(leftAxis);

        var circleGroup = chartGroup.selectAll("circle")
            .data(Dataset)
            .enter()
            .append("circle")
            .attr("cx", d=>xLinearScale(d[ChosenXAxis]))
            .attr("cy", d=>yScale(d[ChosenYAxis]))
            .attr("r", "20")
            .attr("fill", "blue")
            .attr("opacity", ".5")
            


        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
          return (`<strong>${d.state}</strong><br><strong>Healthcare: ${d.healthcare}%</strong><br>Poverty: ${d.poverty} %`)})

        chartGroup.call(toolTip);

          
        circleGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            });

        var XlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("fill", "blue")
            .text("Healthcare");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("fill", "blue")
            .text("Obese");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left )
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("fill", "blue")
            .text("Smokes");
      
        var povertylabel = XlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("Poverty");


        var agelabel = XlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("active", true)
            .text("Age");

        var incomelabel = XlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("active", true)
            .text("Household Income(Median)");


        XlabelsGroup.selectAll("text")
            .on("click", function() {
              // get value of selection
              var value = d3.select(this).attr("value");
              if (value !== ChosenXAxis) {
        
                // replaces chosenXAxis with value
                ChosenXAxis = value;
        
                // console.log(chosenXAxis)
        
                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(Dataset, ChosenXAxis);
        
                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);
        
                // updates circles with new x values
                circlesGroup = renderCircles(circleGroup, xLinearScale, ChosenXAxis);
        
                // updates tooltips with new info
                circleGroup = updateToolTip(ChosenXAxis, circleGroup);
        
                // changes classes to change bold text
                if (ChosenXAxis === "poverty") {
                     povertylabel
                        .classed("active", true)
                        .classed("inactive", false);
                    agelabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomelabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (ChosenXAxis === "age") {
                    povertylabel
                       .classed("active", false)
                       .classed("inactive", true);
                   agelabel
                       .classed("active", true)
                       .classed("inactive", false);
                   incomelabel
                       .classed("active", false)
                       .classed("inactive", true);
               }
               else if (ChosenXAxis === "income") {
                povertylabel
                   .classed("active", false)
                   .classed("inactive", true);
               agelabel
                   .classed("active", false)
                   .classed("inactive", true);
               incomelabel
                   .classed("active", true)
                   .classed("inactive", false);
           }
              }
            });


        });
  
    




// d3.select(window).on("resize", makeResponsive);