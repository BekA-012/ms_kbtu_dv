async function drawBar(btnId, data) {

    const dataset = await d3.json("./my_weather_data.json")

    const xAccessor = d => d[data];
    const yAccessor = d => d.length;
    console.log(yAccessor(data))

    const shift = 55;

    const width = 600
    let dimensions = {
        width: width,
        height: width * 0.5,
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
        },
    }
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom



    const wrapper = d3.select("#wrapper")
        .html("") // clear div before drawing
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset,xAccessor))
        .range([0,dimensions.boundedWidth])
        .nice()

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(xAccessor)
        .thresholds(12);

    const bins = binsGen(dataset);
    console.log(bins);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor) + 10])
        .range([dimensions.boundedHeight,0])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");


    const barPadding = 1
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding/2 + shift)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AFE1AF");

    const mean = d3.mean(dataset,xAccessor);
    const meanLine = bounds.append("line")
        .attr("x1", xScaler(mean) + shift)
        .attr("x2", xScaler(mean) + shift)
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke","black")
        .attr("stroke-dasharray","2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x",xScaler(mean) + shift)
        .attr("y",8)
        .text("Mean")
        .attr("fill","black")
        .attr("font-size","10px")
        .attr("text-anchor","middle");

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .attr("transform", `translate(${shift},${dimensions.boundedHeight} )`);



    const yAxisGen = d3.axisLeft()
        .scale(yScaler);
    const yAxis = bounds.append("g")
        .call(yAxisGen)
        .attr("transform", `translate(${shift}, 0)`);

    const xLabel = bounds.append("text")
        .attr("x",dimensions.boundedWidth - 30)
        .attr("y",dimensions.boundedHeight + 30)
        .text("Temperature")
        .attr("fill","black")
        .attr("font-size","10px")
        .attr("text-anchor","middle");

    const yLabel = bounds.append("text")
        .attr("x",15)
        .attr("y",40)
        .text("Count")
        .attr("fill","black")
        .attr("font-size","10px")
        .attr("text-anchor","middle");

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1)-xScaler(d.x0))/2 + shift)
        .attr("y", d => yScaler(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill","black")
        .attr("font-size","10px")
        .attr("text-anchor","middle");


    changeActiveButton(btnId);
}

function changeActiveButton(id){
    if(id == null){
        return 0;
    }

    const activeButton = document.getElementsByClassName("active");
    activeButton[0].classList.remove("active");


    const clickedButton = document.getElementById(id)
    clickedButton.classList.add("active");
}

drawBar(null, "temperatureLow");