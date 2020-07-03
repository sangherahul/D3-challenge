// @TODO: YOUR CODE HERE!



    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
      };

    
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      };

    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    var svg = d3.select("body").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);


    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    d3.csv("assets/data/data.csv").then(Dataset=>{

        Dataset.forEach(data =>{

            data.poverty= +data.poverty;
            data.healthcare = +data.healthcare
        })

        // console.log(Dataset)
        var yScale = d3.scaleLinear()
            .domain(d3.extent(Dataset, d=>d.healthcare))
            .range([chartHeight,0])

        var xScale = d3.scaleLinear()
            .domain([8,d3.max(Dataset, d=>d.poverty)])
            .range([0,chartWidth])
        
        var yAxis = d3.axisLeft(yScale);
        var xAxis = d3.axisBottom(xScale); 

        chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    
        chartGroup.append("g")
        .call(yAxis);

        var circleGroup = chartGroup.selectAll("circle")
            .data(Dataset)
            .enter()
            .append("circle")
            .attr("cx", d=>xScale(d.poverty))
            .attr("cy", d=>yScale(d.healthcare))
            .attr("r", "20")
            .attr("fill", "blue")
            .attr("opacity", ".5");


        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`Healthcare${d.healthcare}<br>Poverty: ${d.poverty}`);

        chartGroup.call(toolTip);

          
        circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            });
      
        });
  
    })




// d3.select(window).on("resize", makeResponsive);