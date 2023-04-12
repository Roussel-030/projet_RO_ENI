//VUE
const contentTableau = (i = 0, j = 0, lambdaj = 0, lambdai = 0, resultat = 0, valeurArc = 0, valLambdaj = 0) => {
    valLambdaj = (valLambdaj == "") ? "" : `λ${j} = λ${i} + V(x${i},x${j}) = ${lambdai} + ${valeurArc} = ${valLambdaj}`;
    resultat = isNaN(resultat) ? "∞" : resultat;

    let ligneTable = document.getElementById("ligneTable");

    let td_1 = document.createElement("td"),
        td_2 = document.createElement("td"),
        td_3 = document.createElement("td"),
        td_4 = document.createElement("td"),
        td_5 = document.createElement("td");

    td_1.appendChild(document.createTextNode(i)),
        td_2.appendChild(document.createTextNode(j)),
        td_3.appendChild(document.createTextNode(`λ${j} - λ${i} = ${lambdaj} - ${lambdai} = ${resultat}`)),
        td_4.appendChild(document.createTextNode(valeurArc)),
        td_5.appendChild(document.createTextNode(valLambdaj));

    let tr = document.createElement("tr");
    tr.appendChild(td_1);
    tr.appendChild(td_2);
    tr.appendChild(td_3);
    tr.appendChild(td_4);
    tr.appendChild(td_5);

    ligneTable.appendChild(tr);
}

/* *********************************************************************************************** */

const creerSommet = (sommet) => {
    let tabSommet = [];
    return tabSommet.push(`X${sommet}`);
};

const afficherSommet = (sommets = creerSommet()) => {
    for (sommet in sommets) console.log(sommet);
};

const relationSommet = (sommet_i, sommet_j, valeurArc, lambda_i = "∞", lambda_j = "∞") => {
    return { sommet_i, sommet_j, valeurArc, lambda_i, lambda_j };
};

/* ALGORITHME */
const data = [];
data.push(relationSommet(1, 2, 10));
data.push(relationSommet(2, 3, 15));
data.push(relationSommet(2, 4, 8));
data.push(relationSommet(3, 6, 1));
data.push(relationSommet(3, 11, 16));
data.push(relationSommet(4, 3, 8));
data.push(relationSommet(4, 5, 6));
data.push(relationSommet(5, 9, 1));
data.push(relationSommet(6, 5, 5));
data.push(relationSommet(6, 7, 4));
data.push(relationSommet(7, 8, 1));
data.push(relationSommet(7, 11, 8));
data.push(relationSommet(8, 7, 1));
data.push(relationSommet(8, 10, 2));
data.push(relationSommet(9, 8, 3));
data.push(relationSommet(9, 10, 4));
data.push(relationSommet(10, 12, 7));
data.push(relationSommet(11, 12, 6));
data.push(relationSommet(11, 13, 12));
data.push(relationSommet(12, 15, 9));
data.push(relationSommet(13, 14, 3));
data.push(relationSommet(14, 16, 3));
data.push(relationSommet(15, 14, 5));
data.push(relationSommet(15, 16, 6));

const changerLamndaSommet = (sommet, lambda) => {
    for (let w = 0; w < data.length; w++) {
        if (data[w].sommet_i === sommet) data[w].lambda_i = lambda; //On change lambda i par lambda 
        if (data[w].sommet_j === sommet) data[w].lambda_j = lambda; //On change lambda j par lambda
    }
}

const recommencer = (sommet) => {  //Recommencer si i > j
    let z = 0;
    for (z = 0; z < data.length; z++) if (data[z].sommet_i === sommet) break;
    return z - 1;
}

const calculeLambda = (data) => { //Calcule lambda
    data[0].lambda_i = 0; //Pour x1 lambda = 0
    let resultat = 0;
    let substitutionLambdaj = 0;

    for (let i = 0; i < data.length; i++) {
        resultat = data[i].lambda_j - data[i].lambda_i; // calcule λj - λi
        substitutionLambdaj = data[i].lambda_j; //Avant modification

        if (isNaN(resultat) || (resultat > data[i].valeurArc)) {
            data[i].lambda_j = parseInt(data[i].lambda_i + data[i].valeurArc);
            changerLamndaSommet(data[i].sommet_j, data[i].lambda_j);
            if (data[i].sommet_i > data[i].sommet_j) {
                contentTableau(data[i].sommet_i, data[i].sommet_j, substitutionLambdaj, data[i].lambda_i, resultat, data[i].valeurArc, data[i].lambda_j); //Afficher une ligne du tableau avant de changer i
                i = recommencer(data[i].sommet_j); //Recommencer car i > j
                continue;
            };
        }
        else {
            contentTableau(data[i].sommet_i, data[i].sommet_j, substitutionLambdaj, data[i].lambda_i, resultat, data[i].valeurArc, ""); //On affiche une ligne avec λj = ""
            continue;
        }
        contentTableau(data[i].sommet_i, data[i].sommet_j, substitutionLambdaj, data[i].lambda_i, resultat, data[i].valeurArc, data[i].lambda_j); //Afficher une ligne du tableau au cas ou i < j
    }
}
calculeLambda(data);

const cheminOptimale = (data) => {
    const chemin = [];
    let lambdaRechercher = data[data.length - 1].lambda_j;
    for (let j = data.length - 1; j >= 0; j--) {
        if ((data[j].lambda_i + data[j].valeurArc) === lambdaRechercher) //condition pour chemin minimale
        {
            chemin.push({ sommet: `x${data[j].sommet_j}`, lambda: lambdaRechercher })
            lambdaRechercher = data[j].lambda_i; //Remplacer lambdaRechercher
        }
    }
    chemin.push({ sommet: `x1`, lambda: 0 });   // On pose x1 en 0
    console.log(chemin);
}

cheminOptimale(data);


