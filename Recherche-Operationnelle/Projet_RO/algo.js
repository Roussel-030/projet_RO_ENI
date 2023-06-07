
	var selectOption = document.getElementById("select");
	var option = selectOption.value;

	var $$ = go.GraphObject.make;
	var data = globalConfig.externalData;
	var keyClicking = [];
    var existeNode = [];
    var minOuMaximal = 0;
    var k = 0;
    var debEtFin = document.getElementById("debFin");
    debEtFin.addEventListener('click', function() {
		selection();
		debEtFin.disabled = true;
	}, false);

	var iSup = 0;
	var iiSup = 0;

    diagram = $$(go.Diagram, "diagram", {
	        // start everything in the middle of the viewport
	        "initialContentAlignment": go.Spot.Center,
	        // have mouse wheel events zoom in and out instead of scroll up and down
	        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
	        // support double-click in background creating a new node
	        "clickCreatingTool.archetypeNodeData": {
	            numero: "x",
	            distance: 0,
	            isCHO: false,
              	minOuMax : 0,
              	distance_temp : 0
	        },
	        //"clickCreatingTool.isDoubleClick" : false, //double-click non pour creer noeud
	        // enable undo & redo
	        "undoManager.isEnabled": true
    });

    diagram.model = new go.GraphLinksModel(data.nodeDataArray, data.linkDataArray);
    var nodesEtape = diagram.model.nodeDataArray;

	    diagram.nodeTemplate =
        $$(go.Node, "Auto",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // define the node's outer shape, which will surround the TextBlock
            $$(go.Shape, "Ellipse",
                
                {
                    fill: globalConfig.node.defaultColor,
                    parameter1: 20,  // the corner has a large radius
                    stroke: globalConfig.node.stroke,
                    desiredSize: new go.Size(globalConfig.node.size, globalConfig.node.size),
                    portId: "",  // this Shape is the Node's port, not the whole Node
                    fromLinkable: true,
                    fromLinkableSelfNode: true,
                    fromLinkableDuplicates: false,
                    toLinkable: true,
                    toLinkableSelfNode: false,
                    toLinkableDuplicates: true,
                    cursor: "pointer"
                },
                new go.Binding("fill", "isCHO", function(s, obj) {
                    var c = 0;
                    if(s == false) {
                      c = globalConfig.node.defaultColor;
                    }else {
                       var part = minOuMaximal;
                       if(part == 1)
                         c = globalConfig.node.choColorMin;
                       else if(part == 2)
                        c = globalConfig.node.choColorMax;
                    }

                    return c; 
                }),
                   new go.Binding("fill", "isSelected", function(sel) {
                  return sel ? "cyan" : globalConfig.node.defaultColor;
                }).ofObject("")
              ),
            $$(go.TextBlock,
                {
                    font: "bold 11pt helvetica, bold arial, sans-serif",
                    editable: true  // editing the text automatically updates the model data
                },
                new go.Binding("text", "key", function (s, obj) {
                    return "x" + Math.abs(s);
                }).makeTwoWay())
        );

        diagram.linkTemplate =
        $$(go.Link,  // the whole link panel
            {
                //curve: go.Link.Bezier,
                adjusting: go.Link.Stretch,
                reshapable: true,
                relinkableFrom: true,
                relinkableTo: true,
                toShortLength: 3
            },
            new go.Binding("points").makeTwoWay(),
            $$(go.Shape,  // the link shape
                {
                    strokeWidth: 3,                    
                    stroke : globalConfig.link.defaultColor
                },
                new go.Binding("stroke", "isCHO", function(s, obj) {
                    var c = "";
                    if(s == false) {
                      c = globalConfig.link.defaultColor;
                    }else {
                        var part = minOuMaximal;
                       if(part == 1)
                         c = globalConfig.link.choColorMin;
                       else if(part == 2)
                        c = globalConfig.link.choColorMax;
                    }
                    return c; 
                }),
            ),
            $$(go.Shape,  // the arrowhead
                {
                    toArrow: "standard",
                    fill: globalConfig.arrow.fill,
                    stroke: globalConfig.arrow.stroke,
                    //stroke:null
                }),
            $$(go.Panel, "Auto",
                $$(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: "yellow",  
                        stroke: null                      
                    }
                ),
                $$(go.TextBlock, "0",  // the label text
                    {
                        stroke: globalConfig.link.labelColor,
                        textAlign: "center",
                        font: "11pt helvetica, arial, sans-serif",
                        margin: 5,
                        editable: true,  // enable in-place editing
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text", "value").makeTwoWay()
                )
            )
        );

        diagram.nodeTemplate.selectionAdornmentTemplate =
        $$(go.Adornment, "Spot"); // end Adornment

        function selection() {
            diagram.toolManager.clickSelectingTool.standardMouseSelect = function() {
		        var diagram = this.diagram;
		        if (diagram === null || !diagram.allowSelect) return;
  		        var e = diagram.lastInput;
  		        var count = diagram.selection.count;
  		        var curobj = diagram.findPartAt(e.documentPoint, false);
              keyClicking = [];
  		        if (curobj !== null) {
  		          if (count < 2) {  // add the part to the selection
  		            if (!curobj.isSelected) {
  		              var part = curobj;
  		              if (part !== null){
                      part.isSelected = true;
                    }
                    
                     curobj.isSelected = true;
                     existeNode.push(curobj.data.key);
                     for(var i = 0; i < existeNode.length; i++) {
                        var existe = verifierNode(existeNode[i]);
                        if(existe) {
                           keyClicking.push(existeNode[i]);
                        }
                     }

		            }
                
                }
               i++;
          } else if (e.left && !(e.control || e.meta) && !e.shift) {
		      // left click on background with no modifier: clear selection
		      diagram.clearSelection();
              existeNode = []; //reinitialisation
              keyClicking = [];
              vider();
              i = 0;
		    }

		}
    }

    /*
        Algo Bellman-kalaba
    */

    function getNode(key) {
        return diagram.model.findNodeDataForKey(key);
    }

   	function nexts(key) {
	   	var links = diagram.model.linkDataArray;
	   	var nodes = diagram.model.nodeDataArray;
	   	var list = [];
	   	links.map(function (e) {
	       	if (e.from == key) {
	           	nodes.map(function (n) {
	               	if (n.key == e.to) {
	               	    list.push(n);
	               	}
	           	});
	       	}
	   	});
	   	list.sort(function (a, b) {
	       	return Math.abs(a.key) > Math.abs(b.key);
	   	});
	      	return list;
   	}

   	function previous(key) {
	    var links = diagram.model.linkDataArray;
	    var nodes = diagram.model.nodeDataArray;
	    var list = [];
	    links.map(function (l) {
	        if (l.to == key) {
	            nodes.map(function (n) {
	                if (n.key == l.from) {
	                    list.push(n);
	                }
	            });
	        }
	    });
	 	return list;
    }

	function getArc(from, to) {
	    var links = diagram.model.linkDataArray;
	    return links.find(function (l) {
	        return l.from == from && l.to == to;
	    });
	}

    function existeDansArray(key, arr) {
        var existe = false;
        for(var i = 0; i < arr.length; i++) {
            if(key == arr[i])
               existe = true;
        }
        return existe;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function egalite(tab,tab2) {
           var egal = false;
           for(var i = 0; i< tab.length; i++) {
               if(tab[i] == tab2[i])
                   egal = true;
               else{
                   egal = false;
                   break;
               }
           }
           return egal;
        };

    function copieTab(tab) {
        var t = [];
        for(var i = 0; i < tab.length; i++) {
          t[i] = tab[i];
        }
        return t;
    };

    function permute(arr, d, f) {
       var tempD = arr[0];
       var tempF = arr[arr.length-1];
       var permutD = 0;
       var permutF = 0;
       for(var i = 0; i < arr.length; i++) {
          if(f == arr[i]) {
             console.log(arr[i] + " dans i = " +i);
             var permutF = arr[i];
             arr[i] = tempF;
          }
          else if(d == arr[i]) {
              var permutD = arr[i];
              arr[i] = tempD;
          }
       }
       arr[0] = permutD;
       arr[arr.length-1] = permutF;
       return arr;
    }

    function permuteNoDeData(arr, d, f) {
       var temp = 0;
       if(d.key != arr[0].key) {
           for(var i = 0; i < arr.length; i++) {
             temp = arr[i-1];
             if(d.key == arr[i].key){
                arr[i-1] = arr[i];
                arr[i] = temp;
                i = 0;
             }
           }
        } 
        else if(f.key!= arr[arr.length-1].key) {
            for(var i = 0; i < arr.length-1; i++) {
                temp = arr[i+1];
                if(f.key == arr[i].key) {
                    arr[i+1] = arr[i];
                    arr[i] = temp;
                    i = 0;
                }
            }
        }
        return arr; 
    }

	function tri(nodes) {
	     var i = 0;
	     var j = 0;
	     var max = 0;
	     var temp = 0;

	     for(i = 1; i < nodes.length-1; i++) {
	         max = i;
	         for(j = i+1; j < nodes.length-1; j++) {
	             if(nodes[j].key > nodes[max].key)
	                max = j;
	         }

	         if(max != i) {
	             temp = nodes[max];
	             nodes[max] = nodes[i];
	             nodes[i] = temp;
	         }
	     }
	     return nodes;
  	}

    function verifierNode(key) {
       var nodes = diagram.model.nodeDataArray;
       var existe = false;
       for(var i = 0; i < nodes.length; i++) {
           if(key == nodes[i].key){
               existe = true;
               break;
           }
       }
       return existe;
    }

    function eliminerDoubons(arr){
       var tabU = [];
       tabU.push(arr[0]);
       for(var i = 1; i < arr.length; i++){
         var existe = false;
          for(var j = 0; j < tabU.length; j++) {
            if(arr[i].key == tabU[j].key){
               existe = true;
            }
          }
          if(existe == false)
            tabU.push(arr[i]);
       }
       return tabU;
    }

 	function setCho(graphElement, value) {
	    diagram.startTransaction("CHO State");
	    diagram.model.setDataProperty(graphElement, "isCHO", value);
	    diagram.startTransaction("CHO State");
   	}

    function setDistance(graphElement, value) {
     diagram.startTransaction("DISTANCE State");
	     diagram.model.setDataProperty(graphElement, "distance", value);
       if(graphElement instanceof go.Node)
           diagram.model.setDataProperty(graphElement, "minOuMax", 0);
       minOuMaximal = 0;
	     diagram.startTransaction("DISTANCE State");	
    }

    function setDistance_temp(graphElement, value) {
        diagram.startTransaction("DISTANCE temp State");
        diagram.model.setDataProperty(graphElement, "distance_temp", value);
        diagram.startTransaction("DISTANCE temp State");    
    }

    function viderChemin(v) {
	     diagram.model.nodeDataArray.forEach(function (c) {
	         setCho(c, false);
	     });
	     diagram.model.linkDataArray.forEach(function (l) {
	         setCho(l, false);
	     });

	    if(v == 1){
	     diagram.model.nodeDataArray.forEach(function (c) {
	         setDistance(c, Number.MIN_VALUE);
	     });	

         diagram.model.nodeDataArray.forEach(function (c) {
             setDistance_temp(c, 0);
         }); 

	     } else {
		      diagram.model.nodeDataArray.forEach(function (c) {
		          setDistance(c, Number.MAX_VALUE);
		      });	

	         diagram.model.nodeDataArray.forEach(function (c) {
	             setDistance_temp(c, 0);
	         }); 
	     }   
    }
      	
    function vider() {
        viderChemin(0);
        viderChemin(1);
        if(iSup != 0){
        	supRow();
        	iiSup = 1;
        	iSup = 0;
        }      
    	k = 0;
    }

    function supRow() {
    	var nodes = diagram.model.nodeDataArray;
        var rowk = document.getElementById("k");
        document.getElementById("table").removeChild(rowk);
        for(var j = 0; j < nodes.length; j++){
           var tr = document.getElementById(j.toString());
           document.getElementById("table").removeChild(tr);
        }
    }

    function reinitialiser() {
    	console.log("iiSup " +iiSup+ " et iSup " +iSup);
    	if(iiSup != 1 || iSup != 0)
    		supRow();
        diagram.startTransaction("a");
        diagram.model.nodeDataArray = [];
        diagram.model.linkDataArray = [];
        data.nodeDataArray = [];
        data.linkDataArray = [];
        keyClicking = [];
        k = 0;
        diagram.startTransaction("a");
        nodesEtape = diagram.model.nodeDataArray;
        //var eMin = document.getElementById("etape");
        //btnEtape.disabled = false;*/
        iSup = 0;
    }

    function appendRow(object) {
       var rowk = document.createElement("tr");
       rowk.id = "k";
       var thK = document.createElement("th");
       thK.innerHTML = "k";
       thK.style.textAlign = "center";
       rowk.appendChild(thK);
       document.getElementById("table").appendChild(rowk);
       var i = 0;
       for (var e in object) {
           var row = document.createElement("tr");
           row.id = i.toString();
           var th = document.createElement("th");
           th.innerHTML = "x" +Math.abs(object[e].key);
           th.style.textAlign = "center";
           row.appendChild(th);
           document.getElementById("table").appendChild(row);
           i++;
       }
                
   	}

    function appendRowDistance(object, i) {
        var k = document.getElementById("k");
        var tdK = document.createElement("th");
        tdK.innerHTML = i.toString();
        tdK.style.textAlign = "center";
        k.appendChild(tdK);
        var j = 0;
        for(var e in object){
           var rowX = document.getElementById(j.toString());
           var td = document.createElement("td");
           if(object[e].distance == Number.MAX_VALUE){
           	  td.innerHTML = "+"+"&#8734";
           	  td.style.color = "#da242b";
           }
           	else if(object[e].distance == Number.MIN_VALUE){
           		td.innerHTML = "-"+"&#8734";
           		td.style.color = "#da242b";
           	}
           	else
           		td.innerHTML = object[e].distance;
           rowX.appendChild(td);
           j++;
        }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////RECHERCHE CHEMIN OPTIMAL///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getCheminOptimal() {
      	var debut = keyClicking[0];
       	var fin = keyClicking[1];
       	var debutNodeData = getNode(debut);
       	var finNodeData = getNode(fin);  
      	setCho(debutNodeData, true);
      	var nodes = diagram.model.nodeDataArray;
      	do{
      			var suivants = nexts(debutNodeData.key);
              	for(var j = 0; j < suivants.length; j++) { // parcours de succ de sommet actuel
               	var poids = getArc(debutNodeData.key, suivants[j].key).value;
               	if(debutNodeData.distance == parseInt(poids) + parseInt(suivants[j].distance)) {
                	var arc = getArc(debutNodeData.key, suivants[j].key);
                	debutNodeData = suivants[j];
                	setCho(suivants[j], true);
                	setCho(arc, true);
                	break;
               	}
              	}
          	}while(debutNodeData != finNodeData);
     	}
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////ALGO MINIIMISATION/////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    

	function minimisationDirect() {
		var k = 0;
		var model = diagram.model;
    	var nodes = model.nodeDataArray;
    	viderChemin(0);
      	tropLongNb = false;

        var debut = keyClicking[0];
        var fin = keyClicking[1];
        var debutNodeData = getNode(debut);
        var finNodeData = getNode(fin);  

        //PERMUTATION DU NODEDATA ARRAY
        var temp = 0;
        if(debutNodeData.key != nodes[0].key) {
            for(var i = 0; i < nodes.length; i++) {
              temp = nodes[i-1];
              if(debutNodeData.key == nodes[i].key){
                 nodes[i-1] = nodes[i];
                 nodes[i] = temp;
                 i = 0;
              }
            }
        }

        if(finNodeData.key!= nodes[nodes.length-1].key) {
            for(var i = 0; i < nodes.length-1; i++) {
                temp = nodes[i+1];
                if(finNodeData.key == nodes[i].key) {
                    nodes[i+1] = nodes[i];
                    nodes[i] = temp;
                    i = 0;
                }
            }
        }
        nodes = tri(nodes);
        for(var i = 0; i< nodes.length; i++) {
            var successeur = nexts(nodes[i].key);
            for(var j = 0; j < successeur.length; j++) {
              var poids = getArc(nodes[i].key, successeur[j].key).value;
              if(poids > 9e+15){
                tropLongNb = true;
                alert("Il existe un Poids superieur à 9e+15");
                break;
              }
            }
        }

        //////////////FIN DE PERMUTATION ////////////////////////////

        /*
            ALGORITHME BELLMA-KALABA
        */
        appendRow(nodes);
        iSup = 1;
        if(tropLongNb != true) {

            var dist_prec = [];
            var dist_courant = [];
            finNodeData.distance = 0;
                
            var predecesseurFin = previous(finNodeData.key);
            for(var j = 0; j < predecesseurFin.length; j++) {
                var arc = getArc(predecesseurFin[j].key, finNodeData.key);
                var poids = arc.value;
                predecesseurFin[j].distance = poids;
            }
                
            for(var i = 0; i < nodes.length; i++) {
                dist_prec[i] = nodes[i].distance;
                nodes[i].minOuMax = 1 ; //identification pour max
            }
            minOuMaximal = 1;
            k += 1;
            appendRowDistance(nodes, k);
                
            var egal = false;
            do{
            	k += 1;
                for(var i = 0; i < nodes.length; i++) {
                  if(i == nodes.length-1){
                    nodes[i].distance = 0;
                    break;
                  }
                  var min = Number.MAX_VALUE;  
                  var suivants = nexts(nodes[i].key);
                  for(var j = 0; j < suivants.length; j++) {
                      var poids = getArc(nodes[i].key, suivants[j].key).value;
                      if(suivants[j].distance != Number.MAX_VALUE){
                         var dist = parseInt(poids) + parseInt(suivants[j].distance);
                         if(min > dist)
                           min = dist;
                      }
                  }
                  nodes[i].distance_temp = min;
                  dist_courant[i] = nodes[i].distance_temp;
                }
                for(var i = 0; i < nodes.length; i++) {
                   nodes[i].distance = nodes[i].distance_temp;
                }
                egal = egalite(dist_courant, dist_prec);
                dist_prec = copieTab(dist_courant);
                if(egal == false)
                	appendRowDistance(nodes, k);
            } while(egal == false);
            getCheminOptimal();
            for(var i = 0; i< nodes.length; i++) {
              console.log("distance de " +nodes[i].key+ " = " +nodes[i].distance);
            }   
        }
   }

   var dist_prec = [];
   var dist_courant = [];
   var egal = false;
   var tropLongNb = false;
   function minimisationEtape() {
   		if(k == 0){
              egal = false;
              tropLongNb = false;
              viderChemin(0);
              dist_prec = [];
              dist_courant = [];
        }
        k++;
        var debut = keyClicking[0];
        var fin = keyClicking[1];
        var debutNodeData = getNode(debut);
        var finNodeData = getNode(fin);

        //PERMUTATION DU NODEDATA ARRAY
        var temp = 0;
        if(debutNodeData.key != nodesEtape[0].key) {
            for(var i = 0; i < nodesEtape.length; i++) {
              temp = nodesEtape[i-1];
              if(debutNodeData.key == nodesEtape[i].key){
                 nodesEtape[i-1] = nodesEtape[i];
                 nodesEtape[i] = temp;
                 i = 0;
              }
            }
         }

        if(finNodeData.key!= nodesEtape[nodesEtape.length-1].key) {
            for(var i = 0; i < nodesEtape.length-1; i++) {
                temp = nodesEtape[i+1];
                if(finNodeData.key == nodesEtape[i].key) {
                    nodesEtape[i+1] = nodesEtape[i];
                    nodesEtape[i] = temp;
                    i = 0;
                }
            }
        }
        nodesEtape = tri(nodesEtape);
        for(var i = 0; i< nodesEtape.length; i++) {
            var successeur = nexts(nodesEtape[i].key);
            for(var j = 0; j < successeur.length; j++) {
              var poids = getArc(nodesEtape[i].key, successeur[j].key).value;
              if(poids > 9e+15){
                tropLongNb = true;
                alert("Il existe un Poids superieur à 9e+15");
                break;
              }
            }
        }
        //////////////FIN DE PERMUTATION ////////////////////////////

        /*
            ALGORITHME BELLMA-KALABA
        */ 
        finNodeData.distance = 0;
        minOuMaximal = 1;         
        if(tropLongNb != true) {
            if(k == 1) {
            	appendRow(nodesEtape);
	            var predecesseurFin = previous(finNodeData.key);
	            for(var j = 0; j < predecesseurFin.length; j++) {
	                var arc = getArc(predecesseurFin[j].key, finNodeData.key);
	                var poids = arc.value;
	                predecesseurFin[j].distance = poids;
	            }
	            for(var i = 0; i < nodesEtape.length; i++) {
	                dist_prec[i] = nodesEtape[i].distance;
	                nodesEtape[i].minOuMax = 1 ; //identification pour max
	            }
	            appendRowDistance(nodesEtape,k);
            }
            else {
	            for(var i = 0; i < nodesEtape.length; i++) {
	              if(i == nodesEtape.length-1){
	                nodesEtape[i].distance = 0;
	                break;
	              }
	              var min = Number.MAX_VALUE;  
	              var suivants = nexts(nodesEtape[i].key);
	              for(var j = 0; j < suivants.length; j++) {
	                  var poids = getArc(nodesEtape[i].key, suivants[j].key).value;
	                  if(suivants[j].distance != Number.MAX_VALUE){
	                      var dist = parseInt(poids) + parseInt(suivants[j].distance);
	                       if(min > dist){
	                         min = dist;
	                       }
	                   }  
	               }
	                nodesEtape[i].distance_temp = min;
	                dist_courant[i] = nodesEtape[i].distance_temp;
	             }
                 for(var i = 0; i < nodesEtape.length; i++) {
                    nodesEtape[i].distance = nodesEtape[i].distance_temp;
                 }
                  egal = egalite(dist_courant, dist_prec);
                  dist_prec = copieTab(dist_courant);
                  if(egal == false)
                	appendRowDistance(nodesEtape, k);
            }

            if(egal == true){
               //var btnEtape = document.getElementById("etape");
               //btnEtape.disabled = true;
               iSup = 1;
               getCheminOptimal();
            }  
          } 
   }

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////ALGO MAXIMISATION/////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   function maximisationDirect() {

   		var k = 0;
		var model = diagram.model;
    	var nodes = model.nodeDataArray;
    	viderChemin(1);
      	tropLongNb = false;

        var debut = keyClicking[0];
        var fin = keyClicking[1];
        var debutNodeData = getNode(debut);
        var finNodeData = getNode(fin);  

        //PERMUTATION DU NODEDATA ARRAY
        var temp = 0;
        if(debutNodeData.key != nodes[0].key) {
            for(var i = 0; i < nodes.length; i++) {
              temp = nodes[i-1];
              if(debutNodeData.key == nodes[i].key){
                 nodes[i-1] = nodes[i];
                 nodes[i] = temp;
                 i = 0;
              }
            }
        }

        if(finNodeData.key!= nodes[nodes.length-1].key) {
            for(var i = 0; i < nodes.length-1; i++) {
                temp = nodes[i+1];
                if(finNodeData.key == nodes[i].key) {
                    nodes[i+1] = nodes[i];
                    nodes[i] = temp;
                    i = 0;
                }
            }
        }
        nodes = tri(nodes);
        for(var i = 0; i< nodes.length; i++) {
            var successeur = nexts(nodes[i].key);
            for(var j = 0; j < successeur.length; j++) {
              var poids = getArc(nodes[i].key, successeur[j].key).value;
              if(poids > 9e+15){
                tropLongNb = true;
                alert("Il existe un Poids superieur à 9e+15");
                break;
              }
            }
        }

        //////////////FIN DE PERMUTATION ////////////////////////////

        /*
            ALGORITHME BELLMA-KALABA
        */
        appendRow(nodes);
        iSup = 1;
        if(tropLongNb != true) {

            var dist_prec = [];
            var dist_courant = [];
            finNodeData.distance = 0;
                
            var predecesseurFin = previous(finNodeData.key);
            for(var j = 0; j < predecesseurFin.length; j++) {
                var arc = getArc(predecesseurFin[j].key, finNodeData.key);
                var poids = arc.value;
                predecesseurFin[j].distance = poids;
            }
                
            for(var i = 0; i < nodes.length; i++) {
                dist_prec[i] = nodes[i].distance;
                nodes[i].minOuMax = 2 ; //identification pour max
            }
            minOuMaximal = 2;
            k += 1;
            appendRowDistance(nodes, k);
                
            var egal = false;
            do{
            	k += 1;
                for(var i = 0; i < nodes.length; i++) {
                  if(i == nodes.length-1){
                    nodes[i].distance = 0;
                    break;
                  }
                  var min = Number.MIN_VALUE;  
                  var suivants = nexts(nodes[i].key);
                  for(var j = 0; j < suivants.length; j++) {
                      var poids = getArc(nodes[i].key, suivants[j].key).value;
                      if(suivants[j].distance != Number.MIN_VALUE){
                         var dist = parseInt(poids) + parseInt(suivants[j].distance);
                         if(min < dist)
                           min = dist;
                      }
                  }
                  nodes[i].distance_temp = min;
                  dist_courant[i] = nodes[i].distance_temp;
                }
                for(var i = 0; i < nodes.length; i++) {
                   nodes[i].distance = nodes[i].distance_temp;
                }
                egal = egalite(dist_courant, dist_prec);
                dist_prec = copieTab(dist_courant);
                if(egal == false)
                	appendRowDistance(nodes, k);
            } while(egal == false);
            getCheminOptimal();
            for(var i = 0; i< nodes.length; i++) {
              console.log("distance de " +nodes[i].key+ " = " +nodes[i].distance);
            }   
        }	
   }

   function maximisationEtape() {
   		if(k == 0){
              egal = false;
              tropLongNb = false;
              viderChemin(1);
              dist_prec = [];
              dist_courant = [];
        }
        k++;
        var debut = keyClicking[0];
        var fin = keyClicking[1];
        var debutNodeData = getNode(debut);
        var finNodeData = getNode(fin);

        //PERMUTATION DU NODEDATA ARRAY
        var temp = 0;
        if(debutNodeData.key != nodesEtape[0].key) {
            for(var i = 0; i < nodesEtape.length; i++) {
              temp = nodesEtape[i-1];
              if(debutNodeData.key == nodesEtape[i].key){
                 nodesEtape[i-1] = nodesEtape[i];
                 nodesEtape[i] = temp;
                 i = 0;
              }
            }
         }

        if(finNodeData.key!= nodesEtape[nodesEtape.length-1].key) {
            for(var i = 0; i < nodesEtape.length-1; i++) {
                temp = nodesEtape[i+1];
                if(finNodeData.key == nodesEtape[i].key) {
                    nodesEtape[i+1] = nodesEtape[i];
                    nodesEtape[i] = temp;
                    i = 0;
                }
            }
        }
        nodesEtape = tri(nodesEtape);
        for(var i = 0; i< nodesEtape.length; i++) {
            var successeur = nexts(nodesEtape[i].key);
            for(var j = 0; j < successeur.length; j++) {
              var poids = getArc(nodesEtape[i].key, successeur[j].key).value;
              if(poids > 9e+15){
                tropLongNb = true;
                alert("Il existe un Poids superieur à 9e+15");
                break;
              }
            }
        }
        //////////////FIN DE PERMUTATION ////////////////////////////

        /*
            ALGORITHME BELLMA-KALABA
        */ 
        finNodeData.distance = 0;
        minOuMaximal = 2;         
        if(tropLongNb != true) {
            if(k == 1) {
            	appendRow(nodesEtape);
	            var predecesseurFin = previous(finNodeData.key);
	            for(var j = 0; j < predecesseurFin.length; j++) {
	                var arc = getArc(predecesseurFin[j].key, finNodeData.key);
	                var poids = arc.value;
	                predecesseurFin[j].distance = poids;
	            }
	            for(var i = 0; i < nodesEtape.length; i++) {
	                dist_prec[i] = nodesEtape[i].distance;
	                nodesEtape[i].minOuMax = 2 ; //identification pour max
	            }
	            appendRowDistance(nodesEtape,k);
            }
            else {
	            for(var i = 0; i < nodesEtape.length; i++) {
	              if(i == nodesEtape.length-1){
	                nodesEtape[i].distance = 0;
	                break;
	              }
	              var min = Number.MIN_VALUE;  
	              var suivants = nexts(nodesEtape[i].key);
	              for(var j = 0; j < suivants.length; j++) {
	                  var poids = getArc(nodesEtape[i].key, suivants[j].key).value;
	                  if(suivants[j].distance != Number.MIN_VALUE){
	                      var dist = parseInt(poids) + parseInt(suivants[j].distance);
	                       if(min < dist){
	                         min = dist;
	                       }
	                   }  
	               }
	                nodesEtape[i].distance_temp = min;
	                dist_courant[i] = nodesEtape[i].distance_temp;
	             }
                 for(var i = 0; i < nodesEtape.length; i++) {
                    nodesEtape[i].distance = nodesEtape[i].distance_temp;
                 }
                  egal = egalite(dist_courant, dist_prec);
                  dist_prec = copieTab(dist_courant);
                  if(egal == false)
                	appendRowDistance(nodesEtape, k);
            }

            if(egal == true){
               //var btnEtape = document.getElementById("etape");
               //btnEtape.disabled = true;
               iSup = 1;
               getCheminOptimal();
            }  
          } 
   }

       
   


