var width  = 990,
    height = 550;

d3.select('body').append('center').append('h3').html('FORD ALGORITHME GRAPH');

var svg = d3.select('center').append('svg').attr('width', width).attr('height', height);



d3.select('body').append('center').append('p').html('Shift + ckick : ajouter un nouveau Arc || Ctrl + ckick : ajouter un nouveau Sommet');

function Sommet (id) {
this.id = id;
this.name = id;
this.ISmax=false;
this.ISmin=false;
}

function Edge (from, to, valeur_de_arc) {
this.from = new Sommet(from);
this.to = new Sommet(to);
this.valeur_de_arc = valeur_de_arc;
this.ISmax=false;
this.ISmin=false;
}

// define marker
svg.append("svg:defs").selectAll("marker")
    .data(["arrow"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 13)
    .attr("refY", 2)
    .attr("markerWidth", 14)
    .attr("markerHeight", 14)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0,0 V 4 L6,2 Z");
//dragline marker
svg.append("svg:defs").selectAll("marker")
    .data(["arrowdrag"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 2)
    .attr("markerWidth", 14)
    .attr("markerHeight", 14)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0,0 V 4 L6,2 Z");

var gEdges = svg.append('svg:g').attr('id', 'edges');
var gNodes = svg.append('svg:g').attr('id', 'nodes');


var bouge;

function updatecircledata(d){
            var el = d3.select(this),
                d = el.datum();
                bouge = false;
}

var drag = d3.behavior.drag()
     .on("dragstart", function(d) {
        var draged = d3.select(this).datum();
        //console.log(draged);
        bouge = true;
     })
     .on("drag", function(d,i) {
            if(!d3.event.sourceEvent.shiftKey){
            	d.x += d3.event.dx
            	d.y += d3.event.dy
            	d3.select(this).attr("transform", function(d,i){
                return 'translate('+ d.x +','+ d.y +')'
        	    })
			}

     	})
     .on("dragend", updatecircledata);

var dragline = gEdges.append('g').attr('id','dragedge').append("line");

var sourceCircle;
var destinationId, source_arrowId;
var dernierNumPlace=0
var source_Arrow = null;
var startarrow = false;


function updategraph() {

if(d3.event.ctrlKey) {

		var positionG = d3.mouse(this),
			x = positionG[0],														
		  	y = positionG[1];


		var gSommet=d3.select('#nodes')
				.data([ {"x":x, "y":y} ])
				.append('g')
                .attr('id','node')
				.attr('transform', function(d) {
		    			return 'translate(' + x + ',' + y + ')'
                    });

		gSommet.append('circle')
            .attr('class','off')
			.attr('r', 20)
			.attr({ "width": 50, "height": 200 })
			.on('mouseover', function(d) {

             d3.select(this).attr('transform', 'scale(1.1)');           
		    })
		    .on('mouseout', function(d) {
		      
             d3.select(this).attr('transform', '');
		    })
		    .on('mousedown', function(d) {
		    
		    })
            .on('mousemove', function (d){

            })
		    .on('mouseup', function(d) {

		    });

		gSommet.append('text')
		      .attr('x', 0)
		      .attr('y', 5)
		      .attr('class', 'id')
		      .text(dernierNumPlace);
		
        ++dernierNumPlace;

        d3.selectAll('#node')
        .on('mousedown', function(d) { 
            if (d3.event.shiftKey && (startarrow == false)) {
                source_Arrow = d3.select(this).datum();
                sourceCircle = d3.select(this).select('circle').attr('class','selected_circle');
                source_arrowId = d3.select(this).select('text').text();
                startarrow = true;
                }

            else { 
                    if (startarrow == true) {
                        sourceCircle.attr('class','off');
                    var destination = d3.select(this).datum();
                        destinationId = d3.select(this).select('text').text();


                    var oneEdge = gEdges.append('g').attr('id','edge');
                    oneEdge.append("line")
                                .attr("x1", source_Arrow.x)
                                .attr("y1", source_Arrow.y)
                                .attr("x2", destination.x)
                                .attr("y2", destination.y)
                                .attr("class", "trace")
                                .attr("marker-end", "url(#arrow)");
                    oneEdge.append('g').append("text")
                                .text(function(d){
                                    
                                    return ""+source_arrowId+" to "+destinationId+"" ;
                                })
                                .attr("class",'link-label')
                                .attr("text-anchor","middle")
                                .attr("transform", function(d) {
                                        var detx = (destination.x - source_Arrow.x),
                                            dety = (destination.y - source_Arrow.y);
                                        var dr = Math.sqrt(detx * detx + dety * dety);
                                        var offset = (1 - (1 / dr)) / 2;
                                        var tx = (source_Arrow.x + detx * offset) + 15;
                                        var ty = (source_Arrow.y + dety * offset) - 10;
                                        return "translate(" + tx + ", " + ty + ")";
                                })
                       // console.log(source_arrowId)

                        startarrow = false;
                    }
            }

        })
        .on('mouseover', function(d) {
                //console.log(this.getAttribute("class"));
                //console.log(d3.select(this).data());
                //console.log(d3.select(this).datum());
        })
        .on('mousemove', function(d) {
        
        })
        .on('mouseup', function(d){
                d3.select(this).attr('class','').
                source_Arrow = null;
        });

        d3.selectAll('circle').on('mouseover', function(d){
                //console.log(d3.select(this).data());
                //console.log(d3.select(this).attr());

        })


        d3.selectAll('line').on('mousedown', function(d){
                //console.log(d3.select(this).data());
                //console.log(d3.select(this));

        })
													
	}//------------------------------------------end if(d.event.ctrlKey)

};//---------------------------------------------end updategraph


svg.on('mousedown',updategraph)
    .on('mousemove', function (d){
                if(startarrow == true){
                
                var point = d3.mouse(this);
                dragline.attr("x1", source_Arrow.x)
                        .attr("y1", source_Arrow.y)
                        .attr("x2", point[0])
                        .attr("y2", point[1])
                        .attr("class", "trace")
                        .attr("marker-end", "url(#arrowdrag)");
                }
                else {
                    dragline.attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", 0)
                        .attr("y2", 0)
                        .attr("marker-end", "")
                }

                if (bouge == true) {

            /*d3.selectAll('line')
                .attr("x1", function(d) {
                console.log(d3.select(this).datum()) 
                    if((d.x1 == draged.x) && (d.y1 == draged.y) ){
                        d.x1 += d3.event.dx;
                    }
                    return d.x;
                })
                .attr("y1", function(d) {
                    if((d.x1 == draged.x) && (d.y1 == draged.y) ){
                        d.y1 += d3.event.y;
                    }
                    return d.y1;
                })
                .attr("x2", function(d) {
                    if((d.x2 == draged.x) && (d.y2 == draged.y) ){
                        d.x2 += d3.event.x;
                    }
                    return d.x2;
                })
                .attr("y2", function(d) {
                    if((d.x2 == draged.x) && (d.y2 == draged.y) ){
                        d.y2 += d3.event.y;
                    }
                    return d.y2;

                });*/
                }

});

updategraph();
