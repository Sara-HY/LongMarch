
d3.select("#tooltip").transition().duration(500).style("opacity", 0);

var mapWidth = $('#statesvg').width();
var mapHeight = $('#statesvg').height();
var margin = {top: 10, right: 10, bottom: 30, left: 10},
    width = mapWidth - margin.left - margin.right,
    height = mapHeight - margin.top - margin.bottom;

var svg =  d3.select("#statesvg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(0, 135)");

var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(5000)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);

function drawMap() {
    d3.json("./data/china.json", function(error, data) {

        svg.selectAll(".states")  // paint the shape & color of each province
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "states");

        svg.selectAll("text")
            .data(data.features)
            .enter()
            .append("text")
            .attr("transform", function(d, i){
                if(d.properties.id == "20") //河北
                    return "translate(" + (path.centroid(d)[0]-20) + "," + (path.centroid(d)[1]+20) + ")";
                else if(d.properties.id == "30") //内蒙古
                    return "translate(" + (path.centroid(d)[0]-10) + "," + (path.centroid(d)[1]+20) + ")";
                return "translate(" + (path.centroid(d)[0]-10) + "," + path.centroid(d)[1] + ")";
            })
            .text(function (d) { return d.properties.name;})
            .style("fill", "#C0C0C0")
            .style("font-family","Verdana")
            .style("font-size", "8px")
            .style("fill-opacity", "0.3");


    });
}

function drawCity(filePath) {
    d3.json(filePath, function(error, data) {
        svg.selectAll(".cities").remove();

        svg.selectAll('.cities')
            .data(data.features)
            .enter()
            .append('path')
            .attr("d",  path.pointRadius(3))
            .attr('class', 'cities')
            .on("mouseover", function (d) {
                d3.select("#tooltip").transition().duration(600).style("opacity", .5);
                d3.select("#tooltip").html("<h4>" + d.properties.name + "</h4><table>" + "<tr><td>"+ d.properties.content +"</td></tr></table>")	// create the tooltip of province d
                    .style("left", (d3.event.pageX + 10) + "px")				// set the X position of the tooltip
                    .style("top", (d3.event.pageY - 20) + "px");		// set the Y position of the tooltip
            })
            .on("mouseout", function () {
                d3.select("#tooltip").transition().duration(500).style("opacity", 0);	// disappear the tooltip
            });

    });
}

function drawRoute(filePath) {
    d3.json(filePath, function(error, data) {
        svg.selectAll(".route").remove();

        svg.selectAll(".route")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d",  path)
            .attr('class', 'route')
            .transition()
            .duration(4000)
            .styleTween("stroke-dashoffset", function() {
                return d3.interpolateNumber(1000, 0);
            });

    });
}

drawMap();

function load(parm) {
    console.log(parm);
    if(parm == "中央红军"){
        drawRoute("./data/route1.json");
        drawCity("./data/city1.json");
    }
    else if(parm == "红二方面军"){
        drawRoute("./data/route2.json");
        drawCity("./data/city2.json");
    }
    else if(parm == "红四方面军"){
        drawRoute("./data/route3.json");
        drawCity("./data/city3.json");
    }
    else if(parm == "红25军"){
        drawRoute("./data/route4.json");
        drawCity("./data/city4.json");
    }
}

