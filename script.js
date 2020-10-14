d3.csv('wealth-health-2014.csv', d=>{
    return {
      ...d, // spread operator
      LifeExpectancy: +d.LifeExpectancy,
      Income: +d.Income,
      Population: +d.Population,
    }
  }).then(data=>{
      console.log('wealth-health-2014', data);
  })


  d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    console.log('wealth-health-2014', data);

    const margin = ({top: 25, right: 25, bottom: 25, left: 25})
    const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) { return d.Income}))
        .range([0,width]);
    console.log(d3.extent(data, function (d) { return d.Income}))


    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s")
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) { return d.LifeExpectancy}))
        .range([height,0]);


    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5, "s")
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    const rScale = d3
        .scaleSqrt()
        .domain(d3.extent(data, function(d) { return d.Population}))
        .range([4,25]);

    const colorScale = d3
        .scaleOrdinal(d3.schemeTableau10);
        


    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('x','y')
        .attr('cx',d=>xScale(d.Income))
        .attr('cy',d=>yScale(d.LifeExpectancy))
        .attr('r', d=>rScale(d.Population))
        .attr('fill',d=>colorScale(d['Region']))
        .attr('opacity', 0.7)
        .attr('stroke','black')
        .attr('stroke-width',0.6)
        .on("mouseenter", (event,d) => {
            var country = d['Country'];
            var region = d.Region;
            var pop = d3.format(",d")(d.Population);
            var income = d3.format(",d")(d.Income);
            var life = d3.format(".0f")(d.LifeExpectancy);
            const pos = d3.pointer(event, window);

            var tooltip1 = d3.select('.tooltip')
                .attr("class", "tooltip")
                .style('display','block')
                .style('background-color','black')
                .style('color','white')
                .style('opacity',0.8)
                .style('padding','10px')
                .style("top", pos[1] - 150 + 'px')
                .style("left", pos[0] + 'px')
                .html('Country: ' + country + "<br/>" +
                              "Region: " + region + "<br/>" +
                              "Population: " + pop + "<br/>" +
                              "Income: " + income + "<br/>" +
                              "Life Expectancy: " + life);
        })
        .on("mouseleave", function(event,d){
            //hide tooltip
            d3.select('.tooltip')
            .style('display','none');
           
        })

    
    svg.append("text")
        .attr('x', width - 50)
        .attr('y', height - 5)
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Income")
        .attr('text-anchor', 'end')

    svg.append("text")
        .attr('y', 5)
        .attr('dy', -10)
        .attr("transform", "rotate(90)")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .text("Life Expectancy")
     



    console.log(xScale());

    //console.log(xScale(incomeMax)); // returns the chart width


    //legend
    var legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(" + "-200," + i * 20 + ")"; });
    

    legend.append("rect")
            .attr("x", width + 10)
            .attr("width", 12)
            .attr("height", 12)
            .attr('y',height-150)
            .style("fill", colorScale);

    legend.append("text")
            .attr("x", width + 26)
            .attr("dy", ".65em")
            .attr('y',height-150)
            .text(function(d) {
                return d;
            });
  })