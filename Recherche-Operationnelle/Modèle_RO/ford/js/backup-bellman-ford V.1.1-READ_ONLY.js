document.writeln("<center><h1>Algorithme bellman-Ford!!</h1></center><br/>");
 
//start STRUCTURES Variables : EDGE (une fleche/arc) VERTEX (un Sommet/node)
function Sommet (id) {                                                                //Constructeur de l'objet Sommet 
this.id = id;                                                                         //un Sommet est identifié par son id 
this.name = id;                                                                       //name est le label graphique A,B,C ou a,b,c ou 1,2,3,4 x1,x2,x3 ou l'id
this.ISmax=false;                                                                     //si le sommet est dans le chemin MAX : changé et marqué VRAIE 
this.ISmin=false;                                                                     //si le sommet est dans le chemin MIN : changé et marqué VRAIE
}

function Edge (from, to, valeur_de_arc) {                                             //Constructeur de l'objet Edge ou Arc, fleche dans le graphe
this.from = new Sommet(from);                                                         //Le Sommet de depart de l'arc
this.to = new Sommet(to);                                                             //Le Sommet destination de l'arc (pointé par le fleche) arrivé
this.valeur_de_arc = valeur_de_arc;                                                   //le poid de l'arc/ changable
this.ISmax=false;                                                                     //si le edge est dans le chemin MAX : changé et marqué VRAIE CHO MAX
this.ISmin=false;                                                                     //si le edge est dans le chemin MIN : changé et marqué VRAIE CHO MIN
}
//end STRUCTURES Variables : EDGE (une fleche/arc) VERTEX (un Sommet/node)

        
function bellmanFord (listSommets, edges, source, destination) {                      //--bellmanFord MAX 
 
        //initialisation des variables
        var lamdas = {};                                                              //Un Objet qui contiendra un liste des {"id_du_Sommet": son_valeur_lamda}
        var parents = {};                                                             //Objet pour lister le Sommet anterieur de chaque Sommet {"source":null}
        var chemin = {};                                                              //Objet, liste des Sommets determinant le Chemin (destination=>source)
        var arc_chemin = {};                                                          //Objet, liste des arc determinant le Chemin (source=>destination) 
        var ant;                                                                      //var creation chemin={}
        var c;                                                                        //passe-passe liste des edges
        var o;                                                                        //var creation chemin={}
        var a;                                                                        //var creation arc_chemin={}
        o = 0; a = 0;                                                                 //initialisation compteur 

          //Initialiser les valeurs lamda 0 pour le source et INFINIE 999999999 pour les autres sommets
          for (var i = 0; i < listSommets.length; i += 1) {
            lamdas[listSommets[i].id] = 999999999999;
            parents[listSommets[i].id] = null;
          }
          lamdas[source.id] = 0;                     //fin initialisation valeurs lamda

//----------------------------------------------------------------COEUR-------------------------------------------------------------------------------------|
          //Debut coeur algorithme                                                                                                                          |
          for (i = 0; i < listSommets.length - 1; i += 1) {                           //repeter le coeur selon le nombre des Sommets:
            for (var j = 0; j < edges.length; j += 1) {                               //--repeter l'operation selon le nombre des Egdes
              c = edges[j];                                                           //----|simplification passe-passe sur le tableau des Edges
              if (lamdas[c.to.id] - lamdas[c.from.id] > c.valeur_de_arc) {            //----|CONDITION: lamda/j - lamda/i > valeur_de_arc(i,j)
                lamdas[c.to.id] = lamdas[c.from.id] + c.valeur_de_arc;                //----|--affectation lamda/j = lamda/i + valeur_de_arc(i,j)
                parents[c.to.id] = c.from.id;                                         //----|--affectation le sommet anterieur de j pour 
              }                                                                       //----|--|tel valeur lamda/j qui est le i ici présent     
            }                                                                         //----|SINON: ne rien faire, relacher l'Arc #RELAX
          }                                                                           //Fin repeter le coeur de nbSommet*nbEdge fois
          //Fin coeur algorithme                                                                                                                            |
//-------------------------------------------------------------END_COEUR------------------------------------------------------------------------------------|


//-------------------------------------------------------DEBUG(TRACE DE L'ALGO)-----------------------------------------------------------------------------|
          for (i = 0; i < edges.length; i += 1) {                                     //detecter les arrêts
            c = edges[i];                                                             //
            if (lamdas[c.from.id] + c.valeur_de_arc < lamdas[c.to.id]) {              //
              document.writeln("arrêt n°:"+i+" = fleche: "+c.from.id+" => "+c.to.id+"<br/>");
            }                                                                         //
          }                                                                           //Fin detection des arrêts
//-----------------------------------------------------END_DEBUG(TRACE DE L'ALGO)---------------------------------------------------------------------------|



//---------------------------------------------CREATION DES RESULTAS(les valeurs de retour)-----------------------------------------------------------------|
//                                                                                                                                                          | 
          //Debut tracer le chemin minimun à partir du Sommet destination                                                                                      |
          for (i = (listSommets.length)-1; i >= 0 ; i -= 1) {                         //decrementation (nbSommet-- => 0). executer nbSommet fois            |
          	if (o == 0) {                                                             //--CONDITION: o == destinationSommet
          		chemin[o] = destination.id;                                                          //----|affectation "0": destinationSommet
          		listSommets[destination.id].ISmin=true;                                              //----|Marque le sommet VRAIE pour CHO MIN
              ant=parents[destination.id]; 			                                                  //----|ANT = le anterieur du destinationSommet
          		o=1;                                                                    //----|incrementer VAR o à 1 pour poursuivre creation
          	}        	                                                                //----|-du chemin. ex: dSmmt=15 ; pére[15] = 14 ; VAR ant = 14
         	if (i==ant){                                                                //--|
         		  chemin[o]=i;                                                            //--CONDITION: i == ant. dans (nbSommet-- => 0). exemple:ici c'est 14 
              listSommets[i].ISmin=true;                                              //----|Marque le sommet VRAIE pour CHO MIN
              ant=parents[i];                                                         //----|affectation "1": i ou ant (i == ant?:VRAIE)    ex:chemin[1] = 14
          		o += 1;                                                                 //----|preparer un casse pour le prochain chemin ...  ex:ant = pére[14] 
          	}                                                                         //----|à repeter jusqu'à l'origine ou source d'où le o++    
          }                                                                           //Fin boucle FOR creation du chemin ( i == nbSommet )   
          //Fin Creation objet chemin = { "0": destinationSommet, "1": AnterieurdestinationSommet, ... ,"3": ant3, ..., "i": ant[i], ... , "n": source } 
          //exemple : {"0":15,"1":14,"2":8,"3":0}

          //Debut creation de arc_hemin minimun à partir du source
          for (var j = 0; j < edges.length; j += 1 ){                                  //
               for (i = o-1; i >= 0; i -= 1 ){                                         // 
                  if ( (chemin[i]==edges[j].from.id) && (chemin[i-1]==edges[j].to.id) ) {
                  arc_chemin[a]=j;
                  edges[j].ISmin=true;                                                 //----|Marque le sommet VRAIE pour CHO MIN
                  a += 1;
                  }                                                                    //
               }            
          }
          //Fin Creation objet arc_chemin = { "0": 0, "1": arc2, ... ,"3": arc6, ..., "i": arc[i], ... , "n": dernierArc }                                  |
//                                                                                                                                                          |
//------------------------------------------END_CREATION DES RESULTAS(les valeurs de retour)----------------------------------------------------------------|



//-------------------------------------------------AFFICHAGE ET PARCOURS DES RESULTAS-----------------------------------------------------------------------|
//                                                                                                                                                          | 
          //Debut affichage/parcours Objet lamdas {...}
          document.writeln("<br/>!... LISTE VALEURS lamdas:<br/>");
          for (i = 0; i < listSommets.length; i += 1 ){                               //lamdas.length == listSommets.length 
            document.writeln("lamda_du_Sommet("+i+") = "+lamdas[i]+"<br/>");          //lamdas.length renvoit erreur(false) car lamdas est de type OBJET
          }document.writeln("<br/>");                                                 //
          //Fin affichage Objet lamdas

          //Debut affichage/parcours Objet anterieur = {...}
          document.writeln("<br/>!... LISTE Sommet ANTERIEUR :<br/>");
          for (i = 0; i < listSommets.length; i += 1 ){                               //anterieur.length == listSommets.length 
            document.writeln("anterieur_du_Sommet("+i+") = "+parents[i]+"<br/>");     //anterieur.length renvoit erreur(false) car lamdas est de type OBJET
          }document.writeln("<br/>");                                                 //
          //Fin affichage Objet anterieur                                             //

          //Debut affichage/parcours chemin = {...}
          document.writeln(" LE chemin CHO MIN est : "+chemin[o-1]+"");               //parcours et affichage OBJET chemin 
          for (i = o-2; i >= 0; i -= 1 ){                                             //Parcours à l'envers
            document.writeln(" => "+chemin[i]+" ");                                   //
          }document.writeln("<br/>");
          //Debut affichage chemin

          document.writeln("<br/>!... les_sommets (ISmin == true):<br/>");
          for (var j = 0; j < listSommets.length; j += 1 ){                           //autres methode pour parcourir les edges dans arc_chemin
                  if (listSommets[j].ISmin) {                                         //en verifiant le marquage ISmin == true
                  document.writeln(", "+listSommets[j].id);                         //
                  }
          }document.writeln("<br/>");

          //Debut Affichage/parcours des ARCs sur le chemin
          document.writeln("<br/>LES edges DANS arc_chemin :<br/>");
          a = 0;                                                                      //
          for (var j = 0; j < edges.length; j += 1 ){                                 //parcour arc_chemin et parcour des edges puis afficher si 
                  if (arc_chemin[a] == j) {                                           // numero edges == element dans  arc_chemin
                  document.writeln("Edge ["+j+"] = { from : "+edges[j].from.id+", to : "+edges[j].to.id+", arc : "+edges[j].valeur_de_arc+" }<br/>");
                  a += 1;
                  }                                                                   //
            }                                                                         //
          document.writeln("<br/>!... AUTRE methode ISmin == true:<br/>");
          for (var j = 0; j < edges.length; j += 1 ){                                 //autres methode pour parcourir les edges dans arc_chemin
                  if (edges[j].ISmin) {                                               //en verifiant le marquage ISmin == true
                  document.writeln("Edge ["+j+"] = { from : "+edges[j].from.id+", to : "+edges[j].to.id+", arc : "+edges[j].valeur_de_arc+" }<br/>");
                  }
          }
          //Fin Affichage/parcours des ARCs sur le chemin
          
          //Affichage des edges
          document.writeln("<br/>!... AFFICHAGE Edges APRES MIN:<br/>");              //affichage ISmin de chaque arc dans edges
          for (var j = 0; j < edges.length; j += 1 ){
          document.writeln("Edge["+j+"] ={ from: "+edges[j].from.id+",to: "+edges[j].to.id+", arc:"+edges[j].valeur_de_arc);
          document.writeln(", ISmin: "+edges[j].ISmin+", ISmax: "+edges[j].ISmax+"}<br/>");
          }
          //Fin Affichage des edges

          //Affichage des Sommets
          document.writeln("<br/>!... AFFICHAGE Sommets APRES MIN:<br/>");           //affichage ISmin de chaque Sommets dans listSommets
          for (var j = 0; j < listSommets.length; j += 1 ){
                  document.writeln("Sommet("+j+")={ id:"+listSommets[j].id+", name: "+listSommets[j].name);
                  document.writeln(", ISmin: "+listSommets[j].ISmin+", ISmax: "+listSommets[j].ISmax+"}<br/>");
          }
          //Fin Affichage des Sommets
          
          //Fin Affichage/Marquage/parcours des ARCs sur le chemin

//                                                                                                                                                          | 
//----------------------------------------------END_AFFICHAGE ET PARCOURS DES RESULTAS----------------------------------------------------------------------|

          document.writeln("<br/><br/>");

        return true;
  };//--------------------------------------------------------------------------------//Fin declaration function --bellmanFord-------------------------------|


//*************************EXEMPLE 1 *********************START********************************|
var les_sommets = [                                                                           ////initialise 
                new Sommet(0),                                                                ////les donnes
                new Sommet(1),                                                                ////des Sommets
                new Sommet(2),                                                                ////dans un
                new Sommet(3),                                                                ////tableau
                new Sommet(4)];                                                               ////
                                                                                              //
var lesedges = [];                                                                            //
 lesedges.push(new Edge(0, 1, 2));                                                            //--|
 lesedges.push(new Edge(0, 2, 6));                                                            //--|
 lesedges.push(new Edge(1, 2, 3));                                                            //--|
 lesedges.push(new Edge(1, 3, 22));                                                           //--|
 lesedges.push(new Edge(2, 3, 8));                                                            //--|
 lesedges.push(new Edge(2, 4, 1));                                                            //--|
 lesedges.push(new Edge(4, 3, 5));                                                            //--|
                                                                                              //
var origin = les_sommets[0];                                                                  //--|designer le sommet source du graphe
var end = les_sommets[3];                                                                     //--|designer le sommet destination
bellmanFord(les_sommets,lesedges,origin,end);                                                 //--|appelle fonction bellmanFord
                                                                                              //
//*************************EXEMPLE 1 *********************END**********************************|



//-------------------------EXEMPLE 2---------------------START---------------------------------| 
var les_sommetsEXE = [                                                                        //
                new Sommet(0),                                                                //
                new Sommet(1),                                                                //
                new Sommet(2),                                                                //
                new Sommet(3),                                                                //
                new Sommet(4),                                                                //
                new Sommet(5),                                                                //
                new Sommet(6),                                                                //
                new Sommet(7),                                                                //
                new Sommet(8),                                                                //
                new Sommet(9),                                                                //
                new Sommet(10),                                                               //
                new Sommet(11),                                                               //
                new Sommet(12),                                                               //
                new Sommet(13),                                                               //
                new Sommet(14),                                                               //
                new Sommet(15)];                                                              //
                                                                                              //
var lesedgesEXE = [                                                                           //
 				new Edge(0, 1, 10),                                                                   //
 				new Edge(1, 3, 8),                                                                    //
 				new Edge(1, 2, 15),                                                                   //
 				new Edge(2, 5, 1),                                                                    //
 				new Edge(2, 10, 16),                                                                  //
 				new Edge(3, 2, 8),                                                                    //
 				new Edge(3, 4, 6),                                                                    //
 				new Edge(4, 8, 1),                                                                    //
 				new Edge(5, 4, 5),                                                                    //
 				new Edge(5, 6, 4),                                                                    //
 				new Edge(6, 10, 8),                                                                   //
 				new Edge(6, 7, 1),                                                                    //
 				new Edge(7, 6, 1),                                                                    //
 				new Edge(7, 9, 1),                                                                    //
 				new Edge(8, 9, 4),                                                                    //
 				new Edge(8, 7, 3),                                                                    //
 				new Edge(9, 11, 7),                                                                   //
 				new Edge(10, 11, 6),                                                                  //
 				new Edge(10, 12, 12),                                                                 //
 				new Edge(11, 14, 9),                                                                  //
 				new Edge(12, 13, 3),                                                                  //
 				new Edge(13, 15, 3),                                                                  //
 				new Edge(14, 13, 5),                                                                  //
 				new Edge(14, 15, 6)];                                                                 //
                                                                                              //
var originG = les_sommetsEXE[0];                                                              //
var endG = les_sommetsEXE[15];                                                                //
                                                                                              //
bellmanFord(les_sommetsEXE,lesedgesEXE,originG,endG);                                         //
//EXEMPLE 2----------------------------------------------END-----------------------------------| 







