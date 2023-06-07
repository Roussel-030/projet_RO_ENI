var width  = 990,
    height = 550;

d3.select('body').append('center').append('h3').html('FORD ALGORITHME GRAPH');                    
var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

var nav = d3.select('body').append('div').attr("id","nav");

var ul = nav.append('ul');//----------------------------------------------debut les boutons------------------------------

ul.append("li").append('button')
    .attr("id","bellmanFord")
    .attr('class',"btn main")
    .text('bellmanFord_MIN')
    .on('click', function(d){
         originG = tabsommet[origin];
         endG = tabsommet[end];
         tabedges.sort(Compare);

       if(originG != undefined && endG != undefined ) {
       	bellmanFord(tabsommet,tabedges,originG,endG);
       }
    });                                                //------bellman MIN
ul.append("li").append('button')
    .attr("id","bellmanFord")
    .attr('class',"btn main")
    .text('bellmanFord_MAX')
    .on('click', function(d){
        var originG = tabsommet[origin];
        var endG = tabsommet[end];
        tabedges.sort(Element);
        if(originG != undefined && endG != undefined ) {
        bellmanFordMAX(tabsommet,tabedges,originG,endG);
      }
    });                                               //-----belmanFord MAX

var ul2 = nav.append("ul");
ul2.append("li").append('button')
    .attr("id","addSource")
    .attr('class',"btn second")
    .text('Add/Change Source')
    .on('click', function(d){
    addSource = true;        
    });                                               //---add Source (var booleen changer)
ul2.append("li").append('button')
    .attr("id","addDestination")
    .attr('class',"btn second")
    .text('Add/Change Destination')
    .on('click', function(d){
addDestination = true;
    });                                               //---add Destination (boolean)

var ul3 = nav.append("ul")
ul3.append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('Delete_last_Node')
    .on('click', function(d){
      var last = tabsommet.pop();
      if (last.id >= 0) {
      dernierNumPlace -= 1;
      var lesEdges = [];
      var nbr = 0;

      d3.selectAll("#node").attr("class", function (d){
        var thisclass = d3.select(this).select("text").text();
                    console.log("#node g class: "+thisclass);

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
    });                                                           //----------Supprimet le dernier Sommet

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
    });                                                           //-------Suppreimer tous les edges
ul3.append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('Restart GRAPH')
    .on("click", function(d){
      tabedges = [];
      tabsommet = [];
      dernierNumPlace = 0;
      originG = undefined;
      endG = undefined;
      origin = undefined;
      end = undefined;
      d3.selectAll("#node").remove();
      d3.selectAll("#edge").remove();
      d3.selectAll("option").remove();

    });                                                        //-------restat app/ graph


var form = nav.append("ul").append("li").append("form").append("p");     //----supperession 1 edge
form.append("label").html("edge:");
form.append("br");

var selctFROM = form.append("select").attr("id","fromEdge");
form.append("span").html(" to ");
var selctTO = form.append("select").attr("id","toEdge");                //----fin creation form selection edge


nav.append("ul").append("li").append('button')
    .attr("id","delete")
    .attr('class',"btn")
    .text('delete selected eges')
    .on("click", function (d) {
	    var selectEdgefrom = document.getElementById("fromEdge").value;      //-----ID du sommet FROM à supp
      var selectEdgeto = document.getElementById("toEdge").value;           //------ID du sommet TO à supp

	    var indextab;  

		for (var j = 0; j < tabedges.length; j += 1 ){
               if ( (selectEdgefrom == tabedges[j].from.id) && ( selectEdgeto == tabedges[j].to.id) ) {
        		indextab = j;                                                   //----recherche indice à supprimer 
               }
         }
      	tabedges.splice(indextab, 1);                                       //---supp dans tableaux


	    d3.selectAll('#edge').attr("class", function (d) {                     //------supp sur graphe
          var id = d3.select(this).select("line").attr("id");
          var idsplit = id.split("to");
          if( (selectEdgefrom == idsplit[0]) && (selectEdgeto == idsplit[1]) )
          {
              d3.select(this).remove();                                 
          }
      	});
     
      /*selct.selectAll("option").attr("value", function(d){
       var identif = d3.select(this).attr("value");
       if (identif == selectEdge) {
        d3.select(this).remove();
       }

      });*/


    });                                             //------fin suppression 1 edge sous selection

d3.select('body').append('center').append('p').html('Shift + click : ajouter un nouveau Arc || Ctrl + click : ajouter un nouveau Sommet');

var navtab = d3.select('body').append('center').append('div').append("table");                //--------tableaux de l'algo 
var linetab = navtab.append("tr");
linetab.append("th").attr("class","tabi").html("i");
linetab.append("th").attr("class","tabj").html("j");
linetab.append("th").attr("class","tablamda").html("lamda(j)-lamda(i)");
linetab.append("th").attr("class","tabvij").html("V(i,j)");
linetab.append("th").attr("class","tablamdaj").html("lamda(i) + V(i,j) = lamda(j)");          //---fin creation entete tableaux (trace de l'algo)


function Sommet (id) {
this.id = parseFloat(id);
this.name = new String(id);
this.ISmax=false;
this.ISmin=false;
}                                                             //-----creation Object Sommet

function Edge (from, to, valeur_de_arc) {
this.from = new Sommet(from);
this.to = new Sommet(to);                                    //-------il y a un Object Sommet dans Edge
this.valeur_de_arc = parseFloat(valeur_de_arc);
this.ISmax=false;
this.ISmin=false;
}                                                           //-------Creation Object Edge

function Compare (a,b){                                     
  if(a.from.id == b.from.id){
      if (a.to.id < b.to.id){
        return false;
      }
      else{
        return true;
      }
  }
  else{
        if (a.from.id < b.from.id) {
          return false;
        }
        else{
          return true;
        }
  }

}                                                   //-----------Trier le tableaux de tabedges

// define marker
svg.append("svg:defs").selectAll("marker").data(["arrow"]).enter().append("svg:marker")     //--------les definitions du tete des Fleche (personnalisable) 
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
    .attr("d", "M 0,0 V 4 L6,2 Z");                     //-----------forme triangle en extremite d'une ligne
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
    .attr("d", "M 0,0 V 4 L6,2 Z");                         //------------fin definition tete de fleche

var gEdges = svg.append('svg:g').attr('id', 'edges');       //------le groupe contenat les fleches ou edges
var gNodes = svg.append('svg:g').attr('id', 'nodes');       //-------le groupe contenat les Sommets (se place et s'affiche en habillage devant les edges )

/** function updatecircledata(d){
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
**/

var dragline = gEdges.append('g').attr('id','dragedge').append("line");              //----------Le ligne pendant le creation d'un edge
  
var sourceCircle_arrow;                                         //--------les  variables
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
var originG;
var endG;



function updategraph() {    //----------------------fonction creation de graphe et les donnes

if(d3.event.ctrlKey) {                      //

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
		      .attr('class', 'idtab')
		      .text(dernierNumPlace);

    gSommet.append('text')
          .attr('x', 0)
          .attr('y', 5)
          .attr('class', 'id')
          .text(dernierNumPlace+1);

		
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
                console.log("source_arrowId: "+source_arrowId);
                startarrow = true;
                }

            else { 
                    
                if (startarrow == true ) {

                        sourceCircle_arrow.attr('class','off');
                    var destination_arrow = d3.select(this).datum();
                        destination_arrowId = parseFloat(d3.select(this).select('text').text());
                        console.log("destination_arrowId: "+destination_arrowId);
                      
                      if (source_arrowId == destination_arrowId) {
                        startarrow = false;
                        return;
                      }


                    var oneEdge = gEdges.append('g').attr('id','edge');
                    oneEdge.append("line")
                                .attr("x1", source_Arrow.x)
                                .attr("y1", source_Arrow.y)
                                .attr("x2", destination_arrow.x)
                                .attr("y2", destination_arrow.y)
                                .attr("class", "trace")
                                .attr("id", function(d){
                                    return ""+source_arrowId+"to"+destination_arrowId+"" ;

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
                                    var ac = source_arrowId + 1;
                                    var dc = destination_arrowId + 1;
                                    
                                  var one = source_arrowId + 1;
                                  var two = destination_arrowId + 1;
                                    return ""+one+" to "+two+"";
                                    
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
                                    console.log("origin: "+origin);
                                    addSource = false;
                                }
                            else { 
                                    if (addDestination) {
                                            d3.select(this).select('circle').attr('class','destination');
                                            end = parseFloat(d3.select(this).select('text').text());
                                            addDestination = false;
                                            console.log("end: "+end);

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

        var valuedel = dernierNumPlace - 1;
        selctFROM.append("option").attr("value", valuedel).html(dernierNumPlace);
        selctTO.append("option").attr("value", valuedel).html(dernierNumPlace);


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
            lamdas[listSommets[i].id] = 100000000000000000000;
            parents[listSommets[i].id] = null;
          }
          lamdas[source.id] = 0;                     
          //fin initialisation valeurs lamda

          //Debut coeur algorithme
          for (i = 0; i < listSommets.length - 1; i += 1) {
            for (var j = 0; j < edges.length; j += 1) {
              c = edges[j];
             // navtab.append("p").html(""+c.from.id+""+c.to.id+"");
              if (lamdas[c.to.id] - lamdas[c.from.id] > c.valeur_de_arc) {


                var dtest = lamdas[c.to.id] - lamdas[c.from.id];
                var fromi = c.from.id + 1;
                var toj = c.to.id + 1;
                var lamj;
                var lami;
                var reseq;
                lamj = lamdas[c.to.id];
                lami = lamdas[c.from.id];
                reseq = dtest;

                if(lamdas[c.to.id]>10000000000){lamj = "∞"; };
                if(lamdas[c.from.id]>10000000000){lami = "∞"; };
                if(dtest>10000000000){reseq = "∞"; };


                linetab = navtab.append("tr");
                linetab.append("td").attr("class","tabi").html(fromi);
                linetab.append("td").attr("class","tabj").html(toj);
                linetab.append("td").attr("class","tablamda").html(lamj+" - "+lami+" = "+reseq+" > "+c.valeur_de_arc);
                linetab.append("td").attr("class","tabvij").html(c.valeur_de_arc);
                lamdas[c.to.id] = lamdas[c.from.id] + c.valeur_de_arc;
                parents[c.to.id] = c.from.id;                
                linetab.append("td").attr("class","tablamdaj").html(lami+" + "+c.valeur_de_arc+" = "+lamdas[c.to.id]);

              }
              else if(i==0){
                var fromi = c.from.id + 1;
                var toj = c.to.id + 1;

                linetab = navtab.append("tr");
                linetab.append("td").attr("class","tabi").html(fromi);
                linetab.append("td").attr("class","tabj").html(toj);
                linetab.append("td").attr("class","tablamda").html(lamdas[c.to.id]+" - "+lamdas[c.from.id]+" = "+dtest+" # "+c.valeur_de_arc);
                linetab.append("td").attr("class","tabvij").html(c.valeur_de_arc);
                linetab.append("td").attr("class","tablamdaj").html("");

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
          var curent = destination.id;
          var antecedant = parents[curent];
          while(curent != source.id){
            chemin2[iter]=curent;           
            listSommets[curent].ISmin=true;
            curent = parents[curent];
            antecedant = parents[curent];
            iter++;
          }
          chemin2[iter]=source.id;
          listSommets[source.id].ISmin = true;

          for (i = 0; i < edges.length; i += 1) {
          edges[i].ISmin = false;
          }
          console.log("chemin2:");
          for (var i = 0; i <= iter; i++){
            console.log(chemin2[i]);
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
                    console.log("ref: "+ref);

                var content; 
                if (tabsommet[ref].ISmin){
                    d3.select(this.parentElement).select("circle").attr("class","chomin");
                }
                else d3.select(this.parentElement).select("circle").attr("class","off");
                
                content = lamdas[ref]
                if(lamdas[ref] == 999999999999){
                  content = "∞";
                }
                return "L = "+content+"";

              });
                    console.log("sommets resultat:");
            for (var j = 0; j < tabsommet.length; ++j) {
                    console.log("sommet: "+tabsommet[j].id+" ISmin: "+tabsommet[j].ISmin+" ant:"+parents[j]);
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

function bellmanFordMAX (listSommets, edges, source, destination) {
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

          //Initialiser les valeurs lamda 0 pour le source et 0 pour les autres sommets
          for (var i = 0; i < listSommets.length; i += 1) {
            lamdas[listSommets[i].id] = 0;
            parents[listSommets[i].id] = null;
          }
          lamdas[source.id] = 0;                     
          //fin initialisation valeurs lamda

          //Debut coeur algorithme
          for (i = 0; i < listSommets.length - 1; i += 1) {
            for (var j = 0; j < edges.length; j += 1) {
              c = edges[j];
             // navtab.append("p").html(""+c.from.id+""+c.to.id+"");
              if (lamdas[c.to.id] - lamdas[c.from.id] < c.valeur_de_arc) {
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
          var curent = destination.id;
          var antecedant = parents[curent];
          while(curent != source.id){
            chemin2[iter]=curent;           
            listSommets[curent].ISmin=true;
            curent = parents[curent];
            antecedant = parents[curent];
            iter++;
          }
          chemin2[iter]=source.id;
          listSommets[source.id].ISmin = true;

          for (i = 0; i < edges.length; i += 1) {
          edges[i].ISmin = false;
          }
          console.log("chemin2:");
          for (var i = 0; i <= iter; i++){
            console.log(chemin2[i]);
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
                    console.log("ref: "+ref);

                var content; 
                if (tabsommet[ref].ISmin){
                    d3.select(this.parentElement).select("circle").attr("class","chomin");
                }
                else d3.select(this.parentElement).select("circle").attr("class","off");
                
                content = lamdas[ref]
                if(lamdas[ref] == 999999999999){
                  content = "∞";
                }
                return "L = "+content+"";

              });
                    console.log("sommets resultat:");
            for (var j = 0; j < tabsommet.length; ++j) {
                    console.log("sommet: "+tabsommet[j].id+" ISmin: "+tabsommet[j].ISmin+" ant:"+parents[j]);
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