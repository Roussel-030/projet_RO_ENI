document.writeln("<center><h1>Algorithme bellman-Ford!!</h1></center><br/>");
 
//start STRUCTURES Variables : EDGE (une fleche/arc) VERTEX (un Sommet/node)
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
//end STRUCTURES Variables : EDGE (une fleche/arc) VERTEX (un Sommet/node)

        
function bellmanFord (vertexes, edges, source) {
        //initialisation des variables
        var distances = {};
        var parents = {};
        var chemin = {};
        var ant;
        var c;
        var o;

          document.writeln("<center><div id=\"one\">");


          //Initialiser les valeurs lamda 0 pour le source et INFINIE 999999999 pour les autres sommets
          for (var i = 0; i < vertexes.length; i += 1) {
            distances[vertexes[i].id] = 999999999999;
            parents[vertexes[i].id] = null;
          }
          distances[source.id] = 0;                     //fin initialisation valeurs lamda
          document.writeln("Sarting... test <span style=\"color:green; font-style:bold; font-size:20px\">OK</span><br/>");

          //Debut coeur algorithme
          for (i = 0; i < vertexes.length - 1; i += 1) {                              //repeter le coeur selon le nombre des Sommets:
            for (var j = 0; j < edges.length; j += 1) {                               //--repeter l'operation selon le nombre des Egdes
              c = edges[j];                                                           //----|simplification passe-passe sur le tableau des Edges
              if (distances[c.to.id] - distances[c.from.id] > c.valeur_de_arc) {      //----|CONDITION: lamda/j - lamda/i > valeur_de_arc(i,j)
                distances[c.to.id] = distances[c.from.id] + c.valeur_de_arc;          //----|--affectation lamda/j = lamda/i + valeur_de_arc(i,j)
                parents[c.to.id] = c.from.id;                                         //----|--affectation le sommet anterieur de j pour 
              }                                                                       //----|--|tel valeur lamda/j qui est le i ici présent     
            }                                                                         //----|SINON: ne rien faire, relacher l'Arc #RELAX
          }                                                                           //Fin repeter le coeur de nbSommet*nbEdge fois
          //Fin coeur algorithme


          for (i = 0; i < edges.length; i += 1) {                                     //detecter les arrêts
            c = edges[i];
            if (distances[c.from.id] + c.valeur_de_arc < distances[c.to.id]) {
              document.writeln("<div id=\"block\">");
              document.writeln("arrêt n°:"+i+" = fleche: "+c.from.id+" => "+c.to.id+"<br/>");
              document.writeln("</div>");
            }
          }                                                                           //Fin detection des arrêts
        	
          //Debut tracer le chemin minimun à partir du dernier Sommet
          for (i = (vertexes.length)-1; i >= 0 ; i -= 1) {                            //decrementation (nbSommet-- => 0). executer nbSommet fois
          	if (i == (vertexes.length)-1) {                                           //--CONDITION: i == dernierSommet
          		chemin[0] = i;                                                          //----|affectation "0": dernierSommet
          		ant=parents[i]; 			                                                  //----|ANT = le anterieur du dernierSommet
          		o=1                                                                     //----|incrementer VAR o à 1 pour poursuivre creation
          	}        	                                                                //----|-du chemin. ex: dSmmt=15 ; pére[15] = 14 ; VAR ant = 14
         	if (i==ant){                                                                //--|
         		chemin[o]=i;                                                              //--CONDITION: i == ant. dans (nbSommet-- => 0). exemple:ici c'est 14 
         		ant=parents[i];                                                           //----|affectation "1": i ou ant (i == ant?:VRAIE)    ex:chemin[1] = 14
          		o += 1;                                                                 //----|preparer un casse pour le prochain chemin ...  ex:ant = pére[14] 
          		}                                                                       //----|à repeter jusqu'à l'origine ou source d'où le o++    
          }                                                                           //Fin boucle FOR creation du chemin ( i == nbSommet )   
          //Fin Creation objet chemin = { "0": dernierSommet, "1": AnterieurdernierSommet, ... ,"3": ant3, ..., "i": ant[i], ... , "n": source } 
          //exemple : {"0":15,"1":14,"2":8,"3":0}
          document.writeln("Core Algorithme : <span style=\"color:green; font-style:bold; font-size:20px\">DONE</span><br/>");
        

          //Debut affichage/parcours Objet lamdas ou distances = {...}
          document.writeln("<div id=\"block\">");
          for (i = 0; i < vertexes.length; i += 1 ){
            document.writeln(" lamdas ["+i+"] = "+distances[i]+"<br/>");
          }document.writeln("</div>");  
          //Fin affichage Objet lamdas ou distances

          //Debut affichage/parcours Objet lamdas ou distances = {...}
          document.writeln("<div id=\"block\">");
          for (i = 0; i < vertexes.length; i += 1 ){
            document.writeln(" anterieur ["+i+"] = "+parents[i]+"<br/>");
          }document.writeln("</div>");
          //Fin affichage Objet lamdas ou distances

          //Debut affichage/parcours chemin = {...}
          document.writeln("<div id=\"block\">");
          document.writeln(" le chemin est : <br/><br/>"+chemin[o-1]+"");
          for (i = o-2; i >= 0; i -= 1 ){
            document.writeln(" => "+chemin[i]+" ");
          }document.writeln("</div>");
          //Fin affichage chemin

          //Debut Affichage/Marquage/parcours des ARCs sur le chemin
          document.writeln("<div id=\"block\">");  
          for (var j = 0; j < edges.length; j += 1 ){    
               for (i = o-1; i >= 0; i -= 1 ){
                  if ( (chemin[i]==edges[j].from.id) && (chemin[i-1]==edges[j].to.id) ) {
                  document.writeln("Edge ["+j+"]={ from: "+edges[j].from.id+", to: "+edges[j].to.id+", arc: "+edges[j].valeur_de_arc+" }<br/>");  
                  } 
            }
            
          }document.writeln("</div>"); 
          //Fin Affichage/Marquage/parcours des ARCs sur le chemin
          
          
          document.writeln("</div></center>");
        return true;
  };


//EXEMPLE 1**********************************************START********************************|
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

bellmanFord(les_sommets,lesedges,origin);
//EXEMPLE 1**********************************************END********************************|



//EXEMPLE 2 ---------------------------------------------START------------------------------| 
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

bellmanFord(les_sommetsEXE,lesedgesEXE,originG);
//EXEMPLE 2----------------------------------------------END--------------------------------| 










