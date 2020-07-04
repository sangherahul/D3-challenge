// @TODO: YOUR CODE HERE!



var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
      };

    
var svgHeight = window.innerHeight;
var svgWidth = window.innerWidth;

var margin = {
        top: 150,
        right: 150,
        bottom: 150,
        left: 150
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

        // console.log(ChosenYAxis);
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(Dataset, d=> d[ChosenYAxis])*0.8,
                d3.max(Dataset, d=>d[ChosenYAxis])*1.2])
            .range([chartHeight,0]);
        return yLinearScale;
    }

function xScale (Dataset, ChosenXAxis){

        var xLinearScale = d3.scaleLinear()
                .domain([d3.min(Dataset, d=> d[ChosenXAxis])*0.6,
                d3.max(Dataset, d=>d[ChosenXAxis]*1.2)
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
      };


function renderYAxis(newYScale, yAxis){

    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};

function updateToolTip(ChosenXAxis,ChosenYAxis, circleGroup) {

        var Xlabel;
        switch(ChosenXAxis){
            case "poverty":
                Xlabel = "Poverty:";
                break;
            case "age":
                Xlabel ="Age:";
                break;
            case "income":
                Xlabel ="Median Household Income:";
                break;
        }
        
        var Ylabel;
        switch(ChosenYAxis){
            case "healthcare":
                Ylabel = "Healthcare:";
                break;
            case "obese":
                Ylabel ="Obesity Rate:";
                break;
            case "smoke":
                Ylabel ="Smokes:";
                break;
        }
      
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`<strong>${d.state}</strong><br><strong>${Xlabel} ${d[ChosenXAxis]}<strong><br><strong>${Ylabel} ${d[ChosenYAxis]}</strong>`);
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

    function renderCircles(circleGroup, newXScale, newYScale, ChosenXAxis, ChosenYAxis) {

        circleGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d[ChosenXAxis]))
          .attr("cy",d=> newYScale(d[ChosenYAxis]));
      
        return circleGroup;
      }

d3.csv("assets/data/data.csv").then(Dataset=>{

        Dataset.forEach(data =>{

            data.poverty= +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
        })

        // console.log(Dataset)
        

        console.log(ChosenYAxis);
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
            .attr("cy", d=>yLinearScale(d[ChosenYAxis]))
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

        var YlabelGroups = chartGroup.append("g")
            .attr("transform", "rotate(-90)")

        var healthcarelabel = YlabelGroups.append("text")
            .attr("y", 0 - margin.left + 100)
            .attr("x", 0 - (chartHeight / 2))
            // .attr("dy", "1em")
            .classed("active", true)
            .attr("value", "healthcare")
            .text("Healthcare");

        var obesitylabel = YlabelGroups.append("text")
            
            .attr("y", 0 - margin.left + 75)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "obesity")
            .classed("active", true)
            .text("Obesity(%)");

        var smokinglabel = YlabelGroups.append("text")
            .attr("y", 0 - margin.left +50)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "smokes")
            .classed("active", true)
            .text("Smokes(%)");
      
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
                yAxis = renderYAxis(yLinearScale,yAxis);
        
                // updates circles with new x values
                circlesGroup = renderCircles(circleGroup, xLinearScale, yLinearScale, ChosenXAxis,ChosenYAxis);
        
                // updates tooltips with new info
                circleGroup = updateToolTip(ChosenXAxis,ChosenYAxis, circleGroup);
        
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

            YlabelGroups.selectAll("text")
            .on("click", function() {
              // get value of selection
              var value = d3.select(this).attr("value");
              if (value !== ChosenYAxis) {
        
                // replaces chosenXAxis with value
                ChosenYAxis = value;
        
                 console.log(ChosenYAxis)
        
                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(Dataset, ChosenYAxis);
        
                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);
                yAxis = renderYAxis(yLinearScale,yAxis);
        
                // updates circles with new x values
                circlesGroup = renderCircles(circleGroup,xLinearScale, yLinearScale, ChosenXAxis,ChosenYAxis);
        
                // updates tooltips with new info
                circleGroup = updateToolTip(ChosenXAxis,ChosenYAxis, circleGroup);
        
                // changes classes to change bold text

                switch (ChosenYAxis){

                    case "healthcare":
                        healthcarelabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obesitylabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokinglabel
                            .classed("active", false)
                            .classed("inactive", true);

                        break;
                    
                    case "obesity":
                        healthcarelabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesitylabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokinglabel
                            .classed("active", false)
                            .classed("inactive", true);

                        break;

                    case "smokes":
                        healthcarelabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesitylabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokinglabel
                            .classed("active", true)
                            .classed("inactive", false);
                            break;

                }
                
              }
            });

        });