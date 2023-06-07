var width  = 990,
    height = 550;

d3.select('body').append('center').append('h3').html('FORD ALGORITHME GRAPH');
var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

var nav = d3.select('body').append('div').attr("id","nav");

var ul = nav.append('ul');

ul.append("li").append('button')
    .attr("id","bellmanFord")
    .attr('class',"btn main")
    .text('bellmanFord_MIN')
    .on('click', function(d){
         originG = tabsommet[origin];//--------------------------------------------------------change
         console.log(origin);
         console.log(originG);
         endG = tabsommet[end];//--------------------------------------------------------------change
         console.log(end);
         console.log(endG);
       if(originG != undefined && endG != undefined ) {
       	bellmanFord(tabsommet,tabedges,originG,endG);
       }
    });
ul.append("li").append('button')
    .attr("id","bellmanFord")
    .attr('class',"btn main")
    .text('bellmanFord_MAX')
    .on('click', function(d){
        var originG = tabsommet[origin];//-----------------------------------------------------change
        var endG = tabsommet[end];//-----------------------------------------------------------change
        bellmanFord(tabsommet,tabedges,originG,endG);
    });

var ul2 = nav.append("ul");
ul2.append("li").append('button')
    .attr("id","addSource")
    .attr('class',"btn second")
    .text('Add/Change Source')
    .on('click', function(d){
    addSource = true;        
    });
ul2.append("li").append('button')
    .attr("id","addDestination")
    .attr('class',"btn second")
    .text('Add/Change Destination')
    .on('click', function(d){
addDestination = true;
    });

var ul3 = nav.append("ul")
ul3.append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('Delete_last_Node')
    .on('click', function(d){
      var last = tabsommet.pop();
      if (last.id >= 1) {//-----------------------------------------------------------change
      dernierNumPlace -= 1;
      var lesEdges = [];
      var nbr = 0;

      d3.selectAll("#node").attr("class", function (d){
        var thisclass = d3.select(this).select("text").text();
        if (thisclass == last.id) {
          d3.select(this).remove();
        }
      });
      d3.selectAll("#lamdas").remove();
      d3.selectAll("circle").attr("class","off");
      d3.selectAll("line").attr("class","trace");


      d3.selectAll('#edge').attr("class", function (d) {
          var id = d3.select(this).select("line").attr("id");
          var tabid = id.split("to");
          if( (tabid[0] == last.id) || (tabid[1] == last.id) )
          {
              d3.select(this).remove();
          }
      });

		for (var j = 0; j < tabedges.length; j += 1 ){
  				if ( (last.id == tabedges[j].from.id) || ( last.id == tabedges[j].to.id) ) {
					console.log(j);
   				} 
   				else {
   					lesEdges[nbr] =  tabedges[j]
   					nbr++;
   				}
		}
		tabedges = [];
		tabedges = lesEdges;
      }
    });

ul3.append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('Delete_All_Edges')
    .on("click", function (d){
      tabedges = [];
      d3.selectAll("#edge").remove();
      d3.selectAll("option").remove();
      d3.selectAll("#lamdas").remove();
      d3.selectAll("circle").attr("class","off");
    });
ul3.append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('Restart GRAPH')
    .on("click", function(d){
      tabedges = [];
      tabsommet = [];
      dernierNumPlace = 1;//-----------------------------------------------------------change
      originG = undefined;
      endG = undefined;
      origin = undefined;
      end = undefined;
      d3.selectAll("#node").remove();
      d3.selectAll("#edge").remove();
      d3.selectAll("option").remove();

    });


var form = nav.append("ul").append("li").append("form").append("p");
form.append("label").html("list edges");
form.append("br");

var selct = form.append("select").attr("id","selectEdge");

nav.append("ul").append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('delete selected eges')
    .on("click", function (d) {
	    var selectEdge = document.getElementById("selectEdge").value;
	    console.log(selectEdge);
	    var splitselectEdge = selectEdge.split("to"); 
	    var indextab;

		for (var j = 0; j < tabedges.length; j += 1 ){
               if ( (splitselectEdge[0] == tabedges[j].from.id) && ( splitselectEdge[1] == tabedges[j].to.id) ) {
        		indextab = j;
               }
         }
      	tabedges.splice(indextab, 1);

	    d3.selectAll('#edge').attr("class", function (d) {
          var id = d3.select(this).select("line").attr("id");
          if( selectEdge == id )
          {
              d3.select(this).remove();
          }
      	});

    });

d3.select('body').append('center').append('p').html('Shift + click : ajouter un nouveau Arc || Ctrl + click : ajouter un nouveau Sommet');

var navtab = d3.select('body').append('div');


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
    .attr("refX", 13)
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
var dernierNumPlace= parseFloat(1);//---------------------------------------------------------change
var addSource = false;
var addDestination = false;

var tabsommet = [];
var tabedges = [];
var origin;
var end;
var originG;
var endG;



function updategraph() {

if(d3.event.ctrlKey) {

		var positionG = d3.mouse(this),
			x = positionG[0],														
		  	y = positionG[1];


		var gSommet=d3.select('#nodes')
				.data([ {"x":x, "y":y} ])
				.append('g')
        .attr('id',"node")
        .attr('class', dernierNumPlace)
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
                    
                if (startarrow == true ) {

                        sourceCircle_arrow.attr('class','off');
                    var destination_arrow = d3.select(this).datum();
                        destination_arrowId = parseFloat(d3.select(this).select('text').text());
                      
                      if (source_arrowId == destination_arrowId) {
                        startarrow = false;
                        return;}


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
                                    
                                    selct.append("option").attr("value",""+source_arrowId+"to"+destination_arrowId+"").html(""+source_arrowId+" to "+destination_arrowId+"");

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
                        destination_arrowId = null;
                    }

                    else { 
                            if (addSource) {
                                    d3.select(this).select('circle').attr('class','source');
                                    origin = parseFloat(d3.select(this).select('text').text());
                                    origin = origin - 1;
                                    addSource = false;
                                    console.log(origin);
                                }
                            else { 
                                    if (addDestination) {
                                            d3.select(this).select('circle').attr('class','destination');
                                            end = parseFloat(d3.select(this).select('text').text());
                                            end = end - 1;
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
                d3.select(this).
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
        var chemin2 = {};
        var arc_chemin = {};
        var ant;
        var c;
        var o;
        var a;
        o = 0; a = 0;  

          //Initialiser les valeurs lamda 0 pour le source et INFINIE 999999999 pour les autres sommets
          for (var i = 0; i < listSommets.length; i += 1) {

            lamdas[listSommets[i].id-1] = 999999999999;
            parents[listSommets[i].id-1] = null;
          }
          lamdas[source.id] = 0;                     
          //fin initialisation valeurs lamda

          //Debut coeur algorithme
          for (i = 0; i < listSommets.length - 1; i += 1) {//---------------------------------change
            for (var j = 0; j < edges.length; j += 1) {
              c = edges[j];
             // navtab.append("p").html(""+c.from.id+""+c.to.id+"");
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

          for (i = 0; i < listSommets.length; i += 1) {
          listSommets[i].ISmin = false;
          }

          var iter = 0;
          var curent = end;
          console.log("curent: "+curent);
          var antecedant = parents[curent];
          while(curent != origin){
            chemin2[iter]=curent;           
            listSommets[curent].ISmin=true;
            curent = parents[curent]
            antecedant = parents[curent];
            iter++;
          }
          chemin2[iter]=origin
          listSommets[origin].ISmin = true;

          for (i = 0; i < edges.length; i += 1) {
          edges[i].ISmin = false;
          }
          console.log("chemin2:");
          for (var i = 0; i <= iter; i++){
            console.log(chemin2[i])
              for (var j = 0; j < edges.length; j += 1 ){
                  if ( (chemin2[i+1]==edges[j].from.id) && (chemin2[i]==edges[j].to.id) ) {
                  arc_chemin[a]=j;
                  edges[j].ISmin=true;
                  a += 1;         
               }            
          }
          }

          
          
          //Debut creation de arc_hemin minimun à partir du source

          //Fin Creation objet arc_chemin

          d3.selectAll('#lamdas').remove();
         
          d3.selectAll('#node').append('text')
              .attr('x', 8)
              .attr('y', -30)
              .attr('id', 'lamdas')
              .attr('class', 'lamdas')
              .text(function(d){
                var ref = d3.select(this.parentElement).select('text').text();
                ref = ref - 1;
                var content; 
                if (tabsommet[ref].ISmin){
                    d3.select(this.parentElement).select("circle").attr("class","chomin");
                }
                else d3.select(this.parentElement).select("circle").attr("class","off");
                
                content = lamdas[ref]
                if(lamdas[ref] == 999999999999){
                  content = "∞";
                }
                return "y = "+content+"";

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
        
        d3.selectAll("line").attr("class","trace");
        
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
                    }
                   
                }
              });


        return true;
  };
