async function buildPlot() {
    const dataset = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const xAccessor = (d) => dateParser(d.date);
    const yAccessor1 = (d) => d.temperatureHigh;

    let dimensions = {
        width: window.innerWidth * 0.5,
        height: 500,
        margin: {
            top: 30,
            right: 20,
            bottom: 20,
            left: 30,
        },
    };
    dimensions.boundedWidth =
        dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom;


    const wrapper = d3
        .select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);



    const bounds = wrapper
        .append("g")
        .style(
            "transform",
            `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
        );


    const yScale = d3
        .scaleLinear()
        .domain([0,100])
        .range([dimensions.boundedHeight, 0]);
    const referenceBandPlacement = yScale(80);
    const referenceBand = bounds
        .append("rect")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", referenceBandPlacement)
        .attr("height", dimensions.boundedHeight - referenceBandPlacement)
        .attr("fill", "#ffffff");

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth]);


    const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveBasis);

    const lineGenerator2 = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor1(d)))
        .curve(d3.curveBasis);


    const line = bounds
        .append("path")
        .attr("d", lineGenerator(dataset))
        .attr("fill", "none")
        .attr("stroke", "Yellow")
        .attr("stroke-width", 1);

    const line1 = bounds
        .append("path")
        .attr("d", lineGenerator2(dataset))
        .attr("fill", "none")
        .attr("stroke", "Blue")
        .attr("stroke-width", 1);

    const yAxisGenerator = d3.axisLeft().scale(yScale);
    const yAxis = bounds.append("g").call(yAxisGenerator)


    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
        .append("g")
        .call(xAxisGenerator.tickFormat(d3.timeFormat("%b,%y")))
        .style("transform", `translateY(${dimensions.boundedHeight}px)`);

    wrapper
        .append("g")
        .style("transform", `translate(${25}px,${15}px)`)
        .attr("class", "title")
        .attr("x", dimensions.width / 1)
        .attr("y", dimensions.margin.top / 1)
        .attr("text-anchor", "middle")

}

buildPlot();