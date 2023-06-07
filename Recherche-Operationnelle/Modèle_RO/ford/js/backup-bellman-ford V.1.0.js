document.writeln("hello!! <br/><br/>");
//start STRUCTURES Variables : EDGE (une fleche/arc) VERTEX (un Sommet/node)
function Sommet (id) {
this.id = id;
}

function Edge (from, to, valeur_de_arc) {
this.from = new Sommet(from);
this.to = new Sommet(to);
this.valeur_de_arc = valeur_de_arc;
}
//end STRUCTURES Variables : EDGE (une fleche/arc) VERTEX (un Sommet/node)

var erreur = {};
        var o;

function bellmanFord (vertexes, edges, source) {
        var distances = {};
        var parents = {};
        var chemin = {};
        var c;
        var ant;

          for (var i = 0; i < vertexes.length; i += 1) {
            distances[vertexes[i].id] = 999999999999;
            parents[vertexes[i].id] = null;
          }
          distances[source.id] = 0;
          for (i = 0; i < vertexes.length - 1; i += 1) {
            for (var j = 0; j < edges.length; j += 1) {
              c = edges[j];
              if (distances[c.from.id] + c.valeur_de_arc < distances[c.to.id]) {
                distances[c.to.id] = distances[c.from.id] + c.valeur_de_arc;
                parents[c.to.id] = c.from.id;
              }
            }
          }

          for (i = 0; i < edges.length; i += 1) {
            c = edges[i];
            if (distances[c.from.id] + c.valeur_de_arc > distances[c.to.id]) {
			         document.writeln("arrêt d'operation n°:"+i+" = fleche: "+c.from.id+" => "+c.to.id+"<br/>");

            }
          }
		    	
          for (i = (vertexes.length)-1; i >= 0 ; i -= 1) {
         	
          	if (i == (vertexes.length)-1) {
          		chemin[0] = i; 
          		ant=parents[i]; 			
          		o=1
          	}
         	
         	if (i==ant){
         		chemin[o]=i;
         		ant=parents[i];
          		o += 1;
          		}     
          }

          	document.writeln("DONE : <br/><br/>");
        
        return chemin;
      };

var les_sommets = [
                new Sommet(0),
                new Sommet(1),
                new Sommet(2),
                new Sommet(3),
                new Sommet(4)];

var lesedges = [];
 lesedges.push(new Edge(0, 1, 2));
 lesedges.push(new Edge(0, 2, 6));
 lesedges.push(new Edge(1, 2, 3));
 lesedges.push(new Edge(1, 3, 22));
 lesedges.push(new Edge(2, 3, 8));
 lesedges.push(new Edge(2, 4, 1));
 lesedges.push(new Edge(4, 3, 5)); 

var origin = les_sommets[0];

var pres;
pres=bellmanFord(les_sommets,lesedges,origin);
//pres = { '0': 0,    '1': -1, '2': 2, '3': -2, '4': 1 };

for (i = 0; i < les_sommets.length; i += 1 ){
	document.writeln("Sommet ["+les_sommets[i].id+"] = "+les_sommets[i].id+"<br/>");
}

	document.writeln("<br/><br/>");

for (i = 0; i < lesedges.length; i += 1 ){
	document.writeln("<br/>Edge ["+i+"] = { from : "+lesedges[i].from.id+", to : "+lesedges[i].to.id+", arc : "+lesedges[i].valeur_de_arc+" }");
}  


	document.writeln("<br/><br/>");

for (i = 0; i < les_sommets.length; i += 1 ){
	document.writeln(" lamdas["+i+"] = "+pres[i]+"<br/>");
}
	document.writeln("<br/><br/>");
	document.writeln("<br/><br/>");

var les_sommetsEXE = [
                new Sommet(0),
                new Sommet(1),
                new Sommet(2),
                new Sommet(3),
                new Sommet(4),
                new Sommet(5),
                new Sommet(6),
                new Sommet(7),
                new Sommet(8),
                new Sommet(9),
                new Sommet(10),
                new Sommet(11),
                new Sommet(12),
                new Sommet(13),
                new Sommet(14),
                new Sommet(15)];

var lesedgesEXE = [
 				new Edge(0, 1, 10),
 				new Edge(1, 3, 8),
 				new Edge(1, 2, 15),
 				new Edge(2, 5, 1),
 				new Edge(2, 10, 16),
 				new Edge(3, 2, 8),
 				new Edge(3, 4, 6),
 				new Edge(4, 8, 1),
 				new Edge(5, 4, 5),
 				new Edge(5, 6, 4),
 				new Edge(6, 10, 8),
 				new Edge(6, 7, 1),
 				new Edge(7, 6, 1),
 				new Edge(7, 9, 1),
 				new Edge(8, 9, 4),
 				new Edge(8, 7, 3),
 				new Edge(9, 11, 7),
 				new Edge(10, 11, 6),
 				new Edge(10, 12, 12),
 				new Edge(11, 14, 9),
 				new Edge(12, 13, 3),
 				new Edge(13, 15, 3),
 				new Edge(14, 13, 5),
 				new Edge(14, 15, 6)];
 
var originG = les_sommetsEXE[0];

var res = bellmanFord(les_sommetsEXE,lesedgesEXE,originG);
/*
for (i = 0; i < les_sommetsEXE.length; i += 1 ){
	document.writeln(" lamdas["+i+"] = "+res[i]+"<br/>");
}*/
for (i = 0; i < o; i += 1 ){
  document.writeln(" lamdas["+i+"] = "+res[i]+"<br/>");
}

  document.writeln(" le chemin est : "+res[o-1]+"");
for (i = o-2; i >= 0; i -= 1 ){
  document.writeln(" => "+res[i]+" ");
}