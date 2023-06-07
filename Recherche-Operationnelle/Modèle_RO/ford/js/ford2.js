var width  = 960,
    height = 500;


d3.select('body').append('center').append('h1').html('FORD ALGORITHME GRAPH');

d3.select('body').append('center');

var svg = d3.select('center').append('svg').attr('width', width).attr('height', height);

var nodes = [{x:80,y:150}, {x:40,y:10}, {x:200,y:30}];
var links = [{s:0,t:1,label:"foo"}, {s:0,t:2,label:"bar"}];
var w = 300;
var h = 300;

// define marker
svg.append("svg:defs").selectAll("marker")
    .data(["arrow"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 2)
    .attr("markerWidth", 12)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0,0 V 4 L6,2 Z");
svg.append("svg:defs").selectAll("marker")
    .data(["arrow-inverse"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 22)
    .attr("refY", 1)
    .attr("markerWidth", 12)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0,0 V 4 L6,2 Z");

svg.selectAll("line")
    .data(links)
  .enter()
    .append("svg:line")
    .attr("x1", function(d) { return nodes[d.s].x; })
    .attr("y1", function(d) { return nodes[d.s].y; })
    .attr("x2", function(d) { return nodes[d.t].x; })
    .attr("y2", function(d) { return nodes[d.t].y; })
    .attr("class", "trace")
    .attr("marker-end", "url(#arrow)")
    .attr("marker-start", "url(#arrow-inverse)");

svg.selectAll("text")
    .data(links)
  .enter()
    .append("svg:g")
    .append("svg:text")
    .text(function(d) { return d.label; })
    .attr("class", "link-label")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
        var dx = (nodes[d.t].x - nodes[d.s].x),
            dy = (nodes[d.t].y - nodes[d.s].y);
        var dr = Math.sqrt(dx * dx + dy * dy);
        var offset = (1 - (1 / dr)) / 2;
        var deg = 180 / Math.PI * Math.atan2(dy, dx);
        var x = (nodes[d.s].x + dx * offset);
        var y = (nodes[d.s].y + dy * offset);
        return "translate(" + x + ", " + y + ") rotate(" + deg + ")";
    });

var dernierNumPlace=0

var drag = d3.behavior.drag()
     .on("drag", function(d,i) {
            if(!d3.event.sourceEvent.shiftKey){
            	d.x += d3.event.dx
            	d.y += d3.event.dy
            	d3.select(this).attr("transform", function(d,i){
                return 'translate('+ d.x +','+ d.y +')'
        	    })
			}
     	});

var dragline = d3.behavior.drag()
     .on("drag", function(d,i) {
            	
            	d.x += d3.event.dx
            	d.y += d3.event.dy
            	d3.select(this).attr( "x2", function(d,i){
                return d.x ; })
         		.attr( "y2", function(d,i){
                return d.y ; });
        	
       });



function updategraph() {

if(d3.event.ctrlKey) {

		var positionG = d3.mouse(this),												//recupere les coordonnes de la souris lors d'un click (renvoi un tableau à 2 element)
			x = positionG[0],														
		  	y = positionG[1];

		var g=d3.select('svg')
				.data([ {"x":x, "y":y} ])
				.append('g')
				.attr('transform', function(d) {
		    			return 'translate(' + x + ',' + y + ')'})
				.call(drag);

		g.append('circle')														//creation et ajout nouveau cercle
			.attr('r', 15)
			.attr({ "width": 50, "height": 200 })
			.style("fill", '#edce22')
			.style("stroke", "black")
			.on('mouseover', function(d) {
		      d3.select(this).attr('transform', 'scale(1.1)').style("fill", '#cdfe82');

		    })
		    .on('mouseout', function(d) {
		      d3.select(this).attr('transform', '').style("fill", '#edce22');
		    })
		    .on('mousedown', function(d) {
			    if (d3.event.shiftKey) {
			     var or = d3.select(this).style("fill", 'lightgreen');
    		
    			svg.append("svg:line")
	    			.attr("x1", function(d) { return d.x; })
	    			.attr("y1", function(d) { return d.y; })
	    			.attr("x2", function(d) { return d.y;})
	    			.attr("y2", function(d) { return d.y;})
	    			.attr("class", "trace")
	    			.attr("marker-end", "url(#arrow)")
	    			.on('mousemove', function (d) {
	    				var point = d3.mouse(this);
	    				d3.select(this).attr("x2",point[0]).attr("y2",point[1]);
	    			});

			    }

		    		
		    })
		    .on('mousemove', function(d){


		    })
		    .on('mouseup', function(d) {
		      	
		    });

		g.append('text')
		      .attr('x', 0)
		      .attr('y', 5)
		      .attr('class', 'id')
		      .text(dernierNumPlace);
		++dernierNumPlace;	
													
	}	

};

svg.on('mousedown',updategraph);



updategraph();
document.write("Ctrl + ckick : ajouter un nouveau Sommet");
document.write("Shift + ckick : ajouter un nouveau Sommet");


        d3.selectAll('circle')
            .on('mouseover', function(d) {
              if ( (d3.select(this).datum().x == source.x) && (d3.select(this).datum().y == source.y) ) {
                d3.select(this).style('fill','green');
                }
            })
            .on('mouseout', function(d) {
              if ( (d3.select(this).datum().x == source.x) && (d3.select(this).datum().y == source.y)) {
                d3.select(this).style('fill','green');
                }
            })
            .on('mousedown', function(d) {
            if ( (d3.select(this).datum().x == source.x) && (d3.select(this).datum().y == source.y)) {
                d3.select(this).style('fill','green');
                }
            })
            .on('mousemove', function (d){

            })
            .on('mouseup', function(d) {


            });


            .append("text")
            .text("test")
            .attr("class", "link-label")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                var detx = (destination.x - source.x),
                    dety = (destination.y - source.y);
                var dr = Math.sqrt(detx * detx + dety * dety);
                var offset = (1 - (1 / dr)) / 2;
                var deg = 180 / Math.PI * Math.atan2(dy, dx);
                var tx = (source.x + detx * offset);
                var ty = (source.y + dety * offset);
                return "translate(" + tx + ", " + ty + ") rotate(" + deg + ")";
        })