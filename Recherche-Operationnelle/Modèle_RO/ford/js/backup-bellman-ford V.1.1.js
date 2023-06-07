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
              document.writeln("arrêt n°:"+i+" = fleche: "+c.from.id+" => "+c.to.id+"<br/>");
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
            if (i==ant){
              chemin[o]=i;
              listSommets[i].ISmin=true;
              ant=parents[i];
              o += 1;
              }
          }
          //Fin Creation objet chemin
          
          //Debut creation de arc_hemin minimun à partir du source
          for (var j = 0; j < edges.length; j += 1 ){
               for (i = o-1; i >= 0; i -= 1 ){
                  if ( (chemin[i]==edges[j].from.id) && (chemin[i-1]==edges[j].to.id) ) {
                  arc_chemin[a]=j;
                  edges[j].ISmin=true;
                  a += 1;
                  }
               }            
          }
          //Fin Creation objet arc_chemin


          //Debut affichage/parcours Objet lamdas {...}
          document.writeln("<br/>!... LISTE VALEURS lamdas:<br/>");
          for (i = 0; i < listSommets.length; i += 1 ){
            document.writeln("lamda_du_Sommet("+i+") = "+lamdas[i]+"<br/>");
          }document.writeln("<br/>");
          //Fin affichage Objet lamdas

          //Debut affichage/parcours Objet anterieur = {...}
          document.writeln("<br/>!... LISTE Sommet ANTERIEUR :<br/>");
          for (i = 0; i < listSommets.length; i += 1 ){
            document.writeln("anterieur_du_Sommet("+i+") = "+parents[i]+"<br/>");
          }document.writeln("<br/>");
          //Fin affichage Objet anterieur

          //Debut affichage/parcours chemin = {...}
          document.writeln(" LE chemin CHO MIN est : "+chemin[o-1]+"");
          for (i = o-2; i >= 0; i -= 1 ){
            document.writeln(" => "+chemin[i]+" ");
          }document.writeln("<br/>");
          //Debut affichage chemin

          document.writeln("<br/>!... les_sommets (ISmin == true):<br/>");
          for (var j = 0; j < listSommets.length; j += 1 ){
                  if (listSommets[j].ISmin) {
                  document.writeln(" , "+listSommets[j].id);
                  }
          }document.writeln("<br/>");

          //Debut Affichage/parcours des ARCs sur le chemin
          document.writeln("<br/>LES edges DANS arc_chemin :<br/>");
          a = 0;
          for (var j = 0; j < edges.length; j += 1 ){
                  if (arc_chemin[a] == j) {
                  document.writeln("Edge ["+j+"] = { from : "+edges[j].from.id+", to : "+edges[j].to.id+", arc : "+edges[j].valeur_de_arc+" }<br/>");
                  a += 1;
                  }
            }
          document.writeln("<br/>!... AUTRE methode ISmin == true:<br/>");
          for (var j = 0; j < edges.length; j += 1 ){
                  if (edges[j].ISmin) {
                  document.writeln("Edge ["+j+"] = { from : "+edges[j].from.id+", to : "+edges[j].to.id+", arc : "+edges[j].valeur_de_arc+" }<br/>");
                  }
          }
          //Fin Affichage/parcours des ARCs sur le chemin
          
          //Affichage des edges
          document.writeln("<br/>!... AFFICHAGE Edges APRES MIN:<br/>");
          for (var j = 0; j < edges.length; j += 1 ){
          document.writeln("Edge["+j+"] ={ from: "+edges[j].from.id+",to: "+edges[j].to.id+", arc:"+edges[j].valeur_de_arc);
          document.writeln(", ISmin: "+edges[j].ISmin+", ISmax: "+edges[j].ISmax+"}<br/>");
          }
          //Fin Affichage des edges

          //Affichage des Sommets
          document.writeln("<br/>!... AFFICHAGE Sommets APRES MIN:<br/>");
          for (var j = 0; j < listSommets.length; j += 1 ){
                  document.writeln("Sommet("+j+")={ id:"+listSommets[j].id+", name: "+listSommets[j].name);
                  document.writeln(", ISmin: "+listSommets[j].ISmin+", ISmax: "+listSommets[j].ISmax+"}<br/>");
          }
          //Fin Affichage des Sommets


          //Fin Affichage/Marquage/parcours des ARCs sur le chemin
          document.writeln("<br/><br/>");

        return true;
  };


//EXEMPLE 1 start
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
var end = les_sommets[3];
bellmanFord(les_sommets,lesedges,origin,end);
//EXEMPLE 1 end



//EXEMPLE 2 start
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
var endG = les_sommetsEXE[15];

bellmanFord(les_sommetsEXE,lesedgesEXE,originG,endG);
//EXEMPLE 2 end








