$(function () {

    var canvasD3 = d3.select("canvas"),
        canvas = canvasD3.node();
    context = canvas.getContext("2d");

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = canvas.width,
        height = canvas.height,
        data = [];

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    canvasD3.call(d3.zoom()
        .scaleExtent([1, 100])
        .on("zoom", draw));

    var line = d3.line()
        .x(function (d, i) { return i; })
        .y(function (d, i) { return d; })
        .curve(d3.curveStep)
        .context(context);
    var lineOne = d3.line()
        .x(function (d, i) { return i; })
        .y(function (d, i) { return d * 2; })
        .curve(d3.curveStep)
        .context(context);

    d3.json("data.json", function (dataLoc) {
        data = dataLoc.data;
        draw();
    });

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        xAxis();
        yAxis();
        
        context.save();
        
        if (d3.event && d3.event.transform) {
            context.translate(margin.left + margin.right + d3.event.transform.x, margin.top + margin.bottom + d3.event.transform.y);
            context.scale(d3.event.transform.k, d3.event.transform.k);
        } else {
            context.translate(margin.left, margin.top);
        }

        context.beginPath();
        line(data);
        lineOne(data);
        context.lineWidth = 1;
        context.strokeStyle = "steelblue";
        context.stroke();
        context.restore();
    }

    function xAxis() {
        var tickCount = 10,
            tickSize = 6,
            ticks = x.ticks(tickCount),
            tickFormat = x.tickFormat();

        context.beginPath();
        ticks.forEach(function (d) {
            context.moveTo(x(d), height - (margin.top + margin.bottom) );
            context.lineTo(x(d), (height - (margin.top + margin.bottom)) + tickSize);
        });
        context.strokeStyle = "black";
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "top";
        ticks.forEach(function (d) {
            context.fillText(tickFormat(d), x(d), (height - (margin.top + margin.bottom)) + tickSize);
        });
    }

    function yAxis() {
        var tickCount = 10,
            tickSize = 6,
            tickPadding = 3,
            ticks = y.ticks(tickCount),
            tickFormat = y.tickFormat(tickCount);

        context.beginPath();
        ticks.forEach(function (d) {
            context.moveTo(0, y(d));
            context.lineTo(-6, y(d));
        });
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.moveTo(-tickSize, 0);
        context.lineTo(0.5, 0);
        context.lineTo(0.5, height);
        context.lineTo(-tickSize, height);
        context.strokeStyle = "black";
        context.stroke();

        context.textAlign = "right";
        context.textBaseline = "middle";
        ticks.forEach(function (d) {
            context.fillText(tickFormat(d), -tickSize - tickPadding, y(d));
        });

        context.save();
        context.rotate(-Math.PI / 2);
        context.textAlign = "right";
        context.textBaseline = "top";
        context.font = "bold 10px sans-serif";
        context.fillText("Price (US$)", -10, 10);
        context.restore();
    }
});