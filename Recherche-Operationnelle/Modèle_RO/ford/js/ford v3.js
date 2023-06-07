var width  = 990,
    height = 550;

d3.select('body').append('center').append('h3').html('FORD ALGORITHME GRAPH');
var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);


d3.select('body').append('button')
    .attr("id","randomize")
    .attr('class',"btn")
    .text('Randomize')
    .on('click', function(d){
        var originG = tabsommet[origin];
        var endG = tabsommet[end];
        bellmanFord(tabsommet,tabedges,originG,endG);
    });
d3.select('body').append('button')
    .attr("id","addSource")
    .attr('class',"btn")
    .text('addSource')
    .on('click', function(d){
    addSource = true;        
    });
d3.select('body').append('button')
    .attr("id","addDestination")
    .attr('class',"btn")
    .text('addDestination')
    .on('click', function(d){
addDestination = true;
    });

d3.select('body').append('center').append('p').html('Shift + ckick : ajouter un nouveau Arc || Ctrl + ckick : ajouter un nouveau Sommet');

function Sommet (id) {
this.id = parseFloat(id);
this.name = new String(id);
this.ISmax=false;
this.ISmin=false;
}

function Edge (from, to, valeur_de_arc) {
this.from = new Sommet(from);
this.to = new Sommet(to);
this.valeur_de_arc = parseFloat(valeur_de_arc);
this.ISmax=false;
this.ISmin=false;
}

// define marker
svg.append("svg:defs").selectAll("marker").data(["arrow"]).enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 11)
    .attr("refY", 2)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0,0 V 4 L6,2 Z");
svg.append("svg:defs").selectAll("marker").data(["arrowhover"]).enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 11)
    .attr("refY", 2)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
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
    .attr("markerWidth", 9)
    .attr("markerHeight", 9)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0,0 V 4 L6,2 Z");

var gEdges = svg.append('svg:g').attr('id', 'edges');
var gNodes = svg.append('svg:g').attr('id', 'nodes');

function updatecircledata(d){
            var el = d3.select(this),
                d = el.datum();
}

var drag = d3.behavior.drag()
     .on("dragstart", function(d) {
        var draged = d3.select(this).datum();
        //console.log(draged);
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

var sourceCircle_arrow;
var destination_arrowId, source_arrowId;
var source_Arrow = null;
var startarrow = false;
var dernierNumPlace= parseFloat(0);
var addSource = false;
var addDestination = false;

var tabsommet = [];
var tabedges = [];
var origin;
var end;

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
            .on('click', function(d){
               // d3.select(this.parentElement).remove();                    
            });

		gSommet.append('text')
		      .attr('x', 0)
		      .attr('y', 5)
		      .attr('class', 'id')
		      .text(dernierNumPlace);
		
        tabsommet.push(new Sommet(dernierNumPlace))
        console.log("sommets data:")
        for (var i = 0; i < tabsommet.length; i++){
        console.log(tabsommet[i].id);            
        }

        dernierNumPlace = dernierNumPlace + 1;
													
	}//------------------------------------------end if(d.event.ctrlKey)


        d3.selectAll('#node')
        .on('mousedown', function(d) { 
            if (d3.event.shiftKey && (startarrow == false)) {
                source_Arrow = d3.select(this).datum();
                sourceCircle_arrow = d3.select(this).select('circle').attr('class','selected_circle');
                source_arrowId = parseFloat(d3.select(this).select('text').text());
                startarrow = true;
                }

            else { 
                    
                if (startarrow == true) {
                        sourceCircle_arrow.attr('class','off');
                    var destination_arrow = d3.select(this).datum();
                        destination_arrowId = parseFloat(d3.select(this).select('text').text());


                    var oneEdge = gEdges.append('g').attr('id','edge');
                    oneEdge.append("line")
                                .attr("x1", source_Arrow.x)
                                .attr("y1", source_Arrow.y)
                                .attr("x2", destination_arrow.x)
                                .attr("y2", destination_arrow.y)
                                .attr("class", "trace")
                                .attr("id", function(d){
                                    return ""+source_arrowId+"to"+destination_arrowId+"";
                                })
                                .attr("marker-end", "url(#arrow)");
                                
                    oneEdge.append("foreignObject")
                              .attr("transform", function(d) {
                                        var detx = (destination_arrow.x - source_Arrow.x),
                                            dety = (destination_arrow.y - source_Arrow.y);
                                        var dr = Math.sqrt(detx * detx + dety * dety);
                                        var offset = (1 - (1 / dr)) / 2;
                                        var tx = (source_Arrow.x + detx * offset);
                                        var ty = (source_Arrow.y + dety * offset) - 30;
                                        return "translate(" + tx + ", " + ty + ")";
                                })
                              .attr("height", 40)
                              .attr("width", 50)
                              .attr("id", function(d){
                                    return ""+source_arrowId+"to"+destination_arrowId+"";
                                })
                              .append("xhtml:p")
                              .attr("id", function(d){
                                    return ""+source_arrowId+"to"+destination_arrowId+"";
                                })
                              .attr("contentEditable", "true")
                              .text(function(d){
                                    tabedges.push(new Edge(source_arrowId,destination_arrowId,0));
                                    return ""+source_arrowId+" to "+destination_arrowId+"" ;
                                })
                              .attr("class",'link-label')
                              .on("mousedown", function(d){
                                d3.event.stopPropagation();
                              })
                              .on("keydown", function(d){
                                d3.event.stopPropagation();
                                if (d3.event.keyCode == 13 && !d3.event.shiftKey){
                                  this.blur();
                                }
                              })
                              .on("blur", function(d){
                                var poid = this.textContent;
                                //alert(resulta);
                                //console.log(d3.select(this).attr("class"))
                                var ident = d3.select(this).attr("id");
                                var tabw = ident.split("to");
                                console.log("Arrow data:")
                                for (var i = 0; i < tabedges.length; i++) {
                                    if( (tabedges[i].from.id == tabw[0]) && (tabedges[i].to.id == tabw[1]) )
                                    {
                                        tabedges[i].valeur_de_arc = parseFloat(poid);
                                    }
                                console.log("from: "+tabedges[i].from.id+" to:"+tabedges[i].to.id+" Arc:"+tabedges[i].valeur_de_arc);                              
                                }
                              })
                        startarrow = false;
                    }

                    else { 
                            if (addSource) {
                                    d3.select(this).select('circle').attr('class','source');
                                    origin = parseFloat(d3.select(this).select('text').text());
                                    addSource = false;
                                    console.log(origin);
                                }
                            else { 
                                    if (addDestination) {
                                            d3.select(this).select('circle').attr('class','destination');
                                            end = parseFloat(d3.select(this).select('text').text());
                                            addDestination = false;
                                            console.log(end);
                                            } 
                                }


                        }
            }




        })
        .on('mouseover', function(d) {

        })
        .on('mousemove', function(d) {
        
        })
        .on('mouseup', function(d){
                d3.select(this).attr('class','').
                source_Arrow = null;
        });

    


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
    });

function bellmanFord (listSommets, edges, source, destination) {
        //initialisation des variables
        var lamdas = {};
        var parents = {};
        var chemin = {};
        var arc_chemin = {};
        var ant;
        var c;
        var o;
        var a;
        o = 0; a = 0;  

          //Initialiser les valeurs lamda 0 pour le source et INFINIE 999999999 pour les autres sommets
          for (var i = 0; i < listSommets.length; i += 1) {
            lamdas[listSommets[i].id] = 999999999999;
            parents[listSommets[i].id] = null;
          }
          lamdas[source.id] = 0;                     
          //fin initialisation valeurs lamda

          //Debut coeur algorithme
          for (i = 0; i < listSommets.length - 1; i += 1) {
            for (var j = 0; j < edges.length; j += 1) {
              c = edges[j];
              if (lamdas[c.to.id] - lamdas[c.from.id] > c.valeur_de_arc) {
                lamdas[c.to.id] = lamdas[c.from.id] + c.valeur_de_arc;
                parents[c.to.id] = c.from.id;
              }
            }
          }
          //Fin coeur algorithme

          //detecter les arrêts
          for (i = 0; i < edges.length; i += 1) {
            c = edges[i];
            if (lamdas[c.from.id] + c.valeur_de_arc < lamdas[c.to.id]) {
            }
          }
          //Fin detection des arrêts

          
          //Debut tracer le chemin minimun à partir du dernier Sommet
          for (i = (listSommets.length)-1; i >= 0 ; i -= 1) {
            if (o == 0) {
              chemin[o] = destination.id;
              listSommets[destination.id].ISmin=true;
              ant=parents[destination.id];
              o=1
            }
          else { 
              if (i==ant){
              chemin[o]=i;
              listSommets[i].ISmin=true;
              ant=parents[i];
              o += 1;
            }
          }
        }
          //Fin Creation objet chemin
          
          
          //Debut creation de arc_hemin minimun à partir du source
          for (var j = 0; j < edges.length; j += 1 ){
               for (i = o ; i > 0; i -= 1 ){
                  var ac = i-1, dc = i-2;
                  if ( (chemin[ac]==edges[j].from.id) && (chemin[dc]==edges[j].to.id) ) {
                  arc_chemin[a]=j;
                  edges[j].ISmin=true;
                  a += 1;
                  }

               }            
          }
          //Fin Creation objet arc_chemin

          d3.selectAll('#node').append('text')
              .attr('x', 8)
              .attr('y', -30)
              .attr('class', 'lamdas')
              .text(function(d){
                var ref = d3.select(this.parentElement).select('text').text();
                if (tabsommet[ref].ISmin){
                    d3.select(this.parentElement).select("circle").attr("class","chomin");
                }
                return "Y = "+lamdas[ref]+"";
              });
                    console.log("sommets resultat:");
            for (var j = 0; j < tabsommet.length; ++j) {
                    console.log("sommet: "+tabsommet[j].id+" ISmin: "+tabsommet[j].ISmin+" ant:"+parents[j]);
            }

                    console.log("chemin resultat var o:"+o);
            for (var j = 0; j < o; ++j) {
                    console.log("-"+chemin[j]);
            }
                    console.log("edges resultat:");
            for (var j = 0; j < tabedges.length; ++j) {
                    console.log(tabedges[j].from.id+"to:"+tabedges[j].to.id+" v: "+tabedges[j].ISmin);
            }
            console.log("arc_chemin:");
            for (var j = 0; j < a; ++j) {
                    console.log("arc n°:"+arc_chemin[j]);
            }
        d3.selectAll("#edge")
        .append('text')
              .attr('x', 0)
              .attr('y', 0)
              .text(function(d){

                var thisid = d3.select(this.parentElement).select('line').attr("id"),
                    ref = thisid.split("to")
                for (var j = 0; j < tabedges.length; ++j) {
                    if ( (tabedges[j].from.id == ref[0]) && (tabedges[j].to.id == ref[1]) && tabedges[j].ISmin){
                        d3.select(this.parentElement).select("line").attr("class","chomin");
                 //       console.log(tabedges[j].from.id+";"+ref[0]+";"+tabedges[j].to.id+";"+ref[1]);
                    }
                }
              });


        return true;
  };
