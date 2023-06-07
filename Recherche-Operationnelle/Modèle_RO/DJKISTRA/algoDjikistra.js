var $$ = go.GraphObject.make;
var data = globalConfig.externalData;
var keyClicking = [];
var existeNode = [];
var minOuMaximal = 0;

var iSup = 0;
var iiSup = 0;
var kk = 0;
var lettre = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var debEtFin = document.getElementById("debFin");
    debEtFin.addEventListener('click', function() {
        selection();
        debEtFin.disabled = true;
    }, false);

diagram = $$(go.Diagram, "diagram", {
	        // start everything in the middle of the viewport
	        "initialContentAlignment": go.Spot.Center,
	        // have mouse wheel events zoom in and out instead of scroll up and down
	        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
	        // support double-click in background creating a new node
	        "clickCreatingTool.archetypeNodeData": {
	            numero: "",
	            isCHO: false,
              	minOuMax : 0,
              	p : Number.MAX_VALUE,
                precedent : 0,
                dist_definitive : Number.MAX_VALUE
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
                  return sel ? "blue" : globalConfig.node.defaultColor;
                }).ofObject("")
              ),
            $$(go.TextBlock,
                {
                    font: "bold 11pt helvetica, bold arial, sans-serif",
                    editable: true  // editing the text automatically updates the model data
                },
                new go.Binding("text", "key", function (s, obj) {
                    return  lettre[Math.abs(s)-1];
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
            /*$$(go.Shape,  // the arrowhead
                {
                    //toArrow: "standard",
                    //fill: globalConfig.arrow.fill,
                    //stroke: globalConfig.arrow.stroke,
                    //stroke:null
                }),*/
            $$(go.Panel, "Auto",
                $$(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: "silver",  
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
       Fonction utile
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

    function priveDeConnu(sommet) {
        var model = diagram.model;
        var nodes = model.nodeDataArray;
        //var node = getNode(sommet);

        var sInConnu = [];
        for(var i = 0;i < nodes.length;i++) {
            if(!(nodes[i].key == sommet)) {
                sInConnu.push(nodes[i]);
            }
        }
        return sInConnu;

    }

    function afficherNodes(nodes) {
        for(var i = 0; i < nodes.length; i++) {
            console.log(Math.abs(nodes[i].key));
        }
    }

    function retirer(tab, donnee) {
        var sortie = [];
        for(var i = 0; i < tab.length; i++) {
            if(tab[i] != donnee)
                sortie.push(tab[i]);
        }
        return sortie;
     }

     function retirerNode(nodes, d) {
        var sortie = [];
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i].key != d.key)
                sortie.push(nodes[i]);
        }
        return sortie;
     }

     function getMinimalPNode(nodes) {
        var min = Number.MAX_VALUE;
        var nodeMin = 0;
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i].dist_definitive < min) {
                min = nodes[i].dist_definitive;
                nodeMin = nodes[i];
            }
        }
        return nodeMin;
     }

     function getMaximalPNode(nodes) {
        var max = Number.MIN_VALUE;
        var nodeMax = 0;
        for(var i = 0; i < nodes.length; i++) {
            if(nodes[i].dist_definitive > max) {
                max = nodes[i].dist_definitive;
                nodeMax = nodes[i];
            }
        }
        return nodeMax;  
     }

     function succNode(key) {
        var succSortie = [];
        var succ = nexts(key);
        var pred = previous(key);
        succSortie = succ;
        for(var i = 0; i < pred.length; i++) {
            succSortie.push(pred[i]);
        }
        return succSortie;
     }

     function predNode(key) {
        var predSortie = [];
        var succ = nexts(key);
        var pred = previous(key);
        predSortie = pred;
        for(var i = 0; i < succ.length; i++) {
            predSortie.push(succ[i]);
        }
        return predSortie;  
     }

     function appendRow(object, sConnu, sInConnu) {
        var row = document.createElement("tr");
        for(var e in object) {
            var th =  document.createElement("th");
           th.innerHTML = lettre[Math.abs(object[e].key)-1];
           th.style.textAlign = "center";
           row.id = "k";
           row.appendChild(th);
           document.getElementById("table").appendChild(row);
        }
        //pour initialisation
        var row2 = document.createElement("tr");
        row2.id = kk.toString();
        var tdS = document.createElement("td");
        tdS.innerHTML = sConnu[0].dist_definitive;
        row2.appendChild(tdS);
        for(var e in sInConnu) {
            var td = document.createElement("td");
            td.innerHTML = "&#8734";
            row2.appendChild(td);
            td.style.textAlign = "center";
        }
        document.getElementById("table").appendChild(row2);  

        kk += 1;
        var row3 = document.createElement("tr");
        row3.id = kk.toString();
        var minP = getMinimalPNode(sInConnu);
        var nodeMin = 0;
        var label = lettre[Math.abs(sConnu[0].key)-1];
        for(var e in object) {
            if(minP.key == object[e].key)
                nodeMin = object[e];
            var td = document.createElement("td");
            var existe = verifierDansSConnu(object[e].key,sConnu);
            if(existe) {
                td.innerHTML = " ";
                td.style.backgroundColor = "yellow";
            } else {
                if(object[e].dist_definitive != Number.MAX_VALUE && object[e].dist_definitive != Number.MIN_VALUE){
                    td.innerHTML = object[e].dist_definitive +  label;
                }
               else {
                    console.log("max " +object[e].dist_definitive);
                    td.innerHTML = "&#8734";
               }
            }
            td.style.textAlign = "center";
            row3.appendChild(td);    
        }
        document.getElementById("table").appendChild(row3);  
    }

    function ajoutDonnee(object, sConnu, minP) {
        kk += 1;
        var row = document.createElement("tr");
        row.id = kk.toString();
        var min = minP.dist_definitive;
        for(var e in object) {
            var existe = verifierDansSConnu(object[e].key,sConnu);
            var td = document.createElement("td");
            var label = lettre[Math.abs(minP.key)-1];
            if(existe) {
                td.innerHTML = " ";
                td.style.backgroundColor = "yellow";
            } else {
               if(object[e].p != Number.MAX_VALUE) {
                    td.innerHTML = object[e].p +label;
                }
               else
                    td.innerHTML = "&#8734";
            }
            td.style.textAlign = "center";
            row.appendChild(td);    
        }
        document.getElementById("table").appendChild(row);  
    }

    function verifieDansNext(sKey, dKey) {
        var succ = nexts(sKey);
        var existeDansNext = false;
        for(var i = 0; i < succ.length; i++) {
            if(succ[i].key == dKey) {
                existeDansNext = true;
                break;
            }
        }
        return existeDansNext;
    }

    function verifieDansPred(sKey, dKey) {
        var prev = previous(sKey);
        var existeDansPred = false;
        for(var i = 0; i < prev.length; i++) {
            if(prev[i].key == dKey) {
                existeDansPred = true;
                break;
            }
        }
        return existeDansPred;;
    }

    function verifierDansSConnu(key, sConnu) {
        var existe = false;
       for(var i = 0; i < sConnu.length; i++) {
           if(key == sConnu[i].key){
               existe = true;
               break;
           }
       }
       return existe;
    }

     function getKeyNodes(nodes) {
        var keyNode = [];
        for(var i = 0; i < nodes.length; i++) {
            var key = nodes[i].key;
            keyNode.push(key);
        }
        return keyNode;
     }

     function finNode(sConnu) {
        var fin = 0;
        for(var i = 0; i < sConnu.length; i++) {
            fin = sConnu[i];
        }
        return fin;
     }
    /*
                    ALGORITHME MINIMISATION
    */

     
     
     function minimiser() {
        var finNodekey = keyClicking[1];
        var finNodeSommet = getNode(finNodekey);
        viderChemin(0);
        //minOuMaximal = 1;
        var model = diagram.model;
        var nodes = model.nodeDataArray;

        minOuMaximal = 1; // Pour minimal
        var sConnu = [];
        var debut = keyClicking[0];
        sConnu.push(getNode(keyClicking[0]));
        setCho(sConnu[0], true);

        var debutNode = getNode(keyClicking[0]);
        debutNode.dist_definitive = 0;

        var sInConnu = priveDeConnu(keyClicking[0]);

        for(var i = 0; i < sInConnu; i++) {
            sInConnu[i].dist_definitive = Number.MAX_VALUE;
            sInConnu[i].precedent = 0;
        }

        var successeurS = succNode(debut);
        for(var j = 0; j < successeurS.length; j++) {
            var boolNext = verifieDansNext(debut, successeurS[j].key);
            if(boolNext) {
                var poids = getArc(debut, successeurS[j].key).value;
                successeurS[j].dist_definitive = parseInt(poids);
                successeurS[j].precedent = debut;    
            }else {
                var poids = getArc(successeurS[j].key, debut).value;
                successeurS[j].dist_definitive = parseInt(poids);
                successeurS[j].precedent = debut;
            }
            
        }

        appendRow(nodes, sConnu, sInConnu);
        iSup = 1;
        var k = 0;
        while(sInConnu.length != 0) {
            k++;
            var minP = getMinimalPNode(sInConnu);
            sConnu.push(minP);
            var succMinP = succNode(minP.key);
            minP.p = minP.dist_definitive;
            for(var i = 0; i < succMinP.length; i++) {
                var existeDansConnu = verifierDansSConnu(succMinP[i].key, sConnu);
                if(!existeDansConnu) {
                    var boolNext = verifieDansNext(minP.key, succMinP[i].key);
                    var poids = 0;
                    if(boolNext) {
                        poids = getArc(minP.key, succMinP[i].key).value;
                    } else {
                        poids = getArc(succMinP[i].key, minP.key).value;   
                    }
                    var d = minP.dist_definitive + parseInt(poids);
                    succMinP[i].p = d;
                    if(d < succMinP[i].dist_definitive) {
                        succMinP[i].dist_definitive = d;
                        succMinP[i].precedent = minP;
                    }
                }
            }
            sInConnu = retirerNode(sInConnu, minP);
            ajoutDonnee(nodes, sConnu,minP);
            //setCho(sConnu[k], true);
        }
        
        var keyFin = 0;
        for(var i = 0; i < nodes.length; i++) {
            keyFin = nodes[i].key;
        }
        //var keyNodeFin = getNode(keyFin);
        //var finSommetNode = finNode(sConnu);
        getCheminMinimal(finNodeSommet);

     }

     function maximiser() {
        var finNodekey = keyClicking[1];
        var finNodeSommet = getNode(finNodekey);
        viderChemin(1);
        var model = diagram.model;
        var nodes = model.nodeDataArray;

        minOuMaximal = 2; // Pour maximal
        var sConnu = [];
        var debut = keyClicking[0];
        sConnu.push(getNode(keyClicking[0]));
        setCho(sConnu[0], true);

        var debutNode = getNode(keyClicking[0]);
        debutNode.dist_definitive = 0;

        var sInConnu = priveDeConnu(keyClicking[0]);


        for(var i = 0; i < sInConnu; i++) {
            sInConnu[i].dist_definitive = Number.MIN_VALUE;
            sInConnu[i].precedent = 0;
        }

        var successeurS = succNode(debut);
        for(var j = 0; j < successeurS.length; j++) {
            var boolNext = verifieDansNext(debut, successeurS[j].key);
            if(boolNext) {
                var poids = getArc(debut, successeurS[j].key).value;
                successeurS[j].dist_definitive = parseInt(poids);
                successeurS[j].precedent = debut;    
            }/*else {
                var poids = getArc(successeurS[j].key, debut).value;
                successeurS[j].dist_definitive = parseInt(poids);
                successeurS[j].precedent = debut;
            }*/
            
        }

        appendRow(nodes, sConnu, sInConnu);
        iSup = 1;
        var k = 0;
        
        while(sInConnu.length != 0) {
            k++;
            var maxP = getMaximalPNode(sInConnu);
            sConnu.push(maxP);
            var succMaxP = succNode(maxP.key);
            maxP.p = maxP.dist_definitive;
            for(var i = 0; i < succMaxP.length; i++) {
                var existeDansConnu = verifierDansSConnu(succMaxP[i].key, sConnu);
                if(!existeDansConnu) {
                    var boolNext = verifieDansNext(maxP.key, succMaxP[i].key);
                    var poids = 0;
                    if(boolNext) {
                        poids = getArc(maxP.key, succMaxP[i].key).value;
                    } else {
                        poids = getArc(succMaxP[i].key, maxP.key).value;   
                    }
                    var d = maxP.dist_definitive + parseInt(poids);
                    succMaxP[i].p = d;
                    if(d > succMaxP[i].dist_definitive) {
                        succMaxP[i].dist_definitive = d;
                        succMaxP[i].precedent = maxP;
                    } else {
                        succMaxP[i].dist_definitive = Number.MIN_VALUE;
                    }
                }
            }
            sInConnu = retirerNode(sInConnu, maxP);
            ajoutDonnee(nodes, sConnu,maxP);
        }
        var keyFin = 0;
        for(var i = 0; i < nodes.length; i++) {
            keyFin = nodes[i].key;
        }
        //var keyNodeFin = getNode(keyFin);
        //var finSommetNode = finNode(sConnu);
        getCheminMinimal(finNodeSommet);
 }

     function getCheminMinimal(finSommet) {
        setCho(finSommet, true);
        var model = diagram.model;
        var nodes = model.nodeDataArray;
        var debut = keyClicking[0];
        var debutNode = getNode(debut);
        do {
            var pred = predNode(finSommet.key);
            for(var i = 0; i < pred.length; i++) {
                var boolPred = verifieDansPred(finSommet.key, pred[i].key);
                var arc = 0;
                var poids = 0;
                if(boolPred) {
                    poids = parseInt(getArc(pred[i].key, finSommet.key).value);
                    arc = getArc(pred[i].key, finSommet.key);
                } else {
                    poids = parseInt(getArc(finSommet.key ,pred[i].key).value);
                    arc = getArc(finSommet.key ,pred[i].key);
                }
                if(finSommet.dist_definitive == poids + pred[i].dist_definitive) {
                    finSommet = pred[i];
                    setCho(pred[i], true);
                    setCho(arc, true);
                    break;
                }
            }
        } while(finSommet != debutNode);
     }

     function setCho(graphElement, value) {
        diagram.startTransaction("CHO State");
        diagram.model.setDataProperty(graphElement, "isCHO", value);
        diagram.startTransaction("CHO State");
    }

    function setDistance(graphElement, value) {
     diagram.startTransaction("DISTANCE State");
         diagram.model.setDataProperty(graphElement, "dist_definitive", value);
       if(graphElement instanceof go.Node)
           diagram.model.setDataProperty(graphElement, "minOuMax", 0);
       minOuMaximal = 0;
         diagram.startTransaction("DISTANCE State");    
    }

    function setDistance_temp(graphElement, value) {
        diagram.startTransaction("DISTANCE temp State");
        diagram.model.setDataProperty(graphElement, "p", value);
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
             setDistance_temp(c, Number.MIN_VALUE);
         }); 

         } else {
              diagram.model.nodeDataArray.forEach(function (c) {
                  setDistance(c, Number.MAX_VALUE);
              });   

             diagram.model.nodeDataArray.forEach(function (c) {
                 setDistance_temp(c, Number.MAX_VALUE);
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
        } /*else {
            if(iiSup != 1) {
                supRow();

            }
        }*/    
        kk = 0;
    }

    function supRow() {
        //var nodes = diagram.model.nodeDataArray;
        var rowk = document.getElementById("k");
        document.getElementById("table").removeChild(rowk);
        console.log("kk " +kk);
        for(var j = 0; j < kk; j++){
           var rowDonnee = document.getElementById(j.toString());
           document.getElementById("table").removeChild(rowDonnee);
        }
        var rowDonnee = document.getElementById(kk.toString());
        document.getElementById("table").removeChild(rowDonnee);

        kk = 0;
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
        kk = 0;
        diagram.startTransaction("a");
        nodesEtape = diagram.model.nodeDataArray;
        //var eMin = document.getElementById("etape");
        //btnEtape.disabled = false;*/
        iSup = 0;


    }

     
