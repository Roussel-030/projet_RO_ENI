#include <stdio.h>
#include <stdlib.h>

void affichageNA(int nA[], int taille);
void affichageCout_Unitaire_et_MA(int tailleJ, int c[][tailleJ], int m[], int n[], char mA[], int tailleI);
void affichageQuantite_Transporte(int tailleJ, int x[][tailleJ], char mA[], int tailleI);
int affichageZ(int tailleJ, int x[][tailleJ], int c[][tailleJ], int tailleI);

/***************** PROTOTYPE ALGORITHME **********************************/
void algo_Coin_nordOuest(int m[], int n[], int tailleI, int tailleJ, int x[][tailleJ]);
void algo_Minili(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]);
void algo_Minico(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]);
void algo_MiniTab(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]);
void algo_Balas_Hammer(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]);
void rempli_graphe(int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ] , int graphe[][tailleJ]);
void affichageGraphe(char mA[], int tailleI, int tailleJ, int graphe[][tailleJ]);

int main()
{
    /***************************** FIN PROGRAMME ********************************************/
    /***************************** FIN PROGRAMME ********************************************/
    int c[4][6] = {
        {24, 22, 61, 49, 83, 35},
        {23, 39, 78, 28, 65, 42},
        {67, 56, 92, 24, 53, 54},
        {71, 43, 91, 67, 40, 49}
    };  //Tableau de Cout uniter de depot vers destination

    int x[4][6] = {0};      //Quantité effectivement transporter de depot vers destination

    int nA[6] = {1, 2, 3, 4, 5, 6};
    char mA[4] = {'A', 'B', 'C', 'D'};
    int n[6] = {9, 11, 28, 6, 14, 5};  // quantité demande de destination
    int m[4] = {18, 32, 14, 9};         //Quantité disponiable au depot
    int graphe[4][6] = {0};

    int i = 0;
    int j = 0;
    int z = 0;
    int choix;
    printf("Algorithme de Solution de base :\n");
    printf("    1- Coin Nord-Ouest\n");
    printf("    2- MINILI\n");
    printf("    3- MINICO\n");
    printf("    4- MINITAB\n");
    printf("    5- Difference maximale (Algorithme de Balas Hammer)\n\n");
    printf("Entre votre choix...\n");
    scanf("%d", &choix);

    //Affichage Liste de Destination

    affichageNA(nA, 6);
    affichageCout_Unitaire_et_MA(6, c, m, n, mA, 4);

    if(choix == 1) {
        algo_Coin_nordOuest(m, n, 4, 6, x);
    } else if(choix == 2) {
        algo_Minili(m, n, 4, 6, c, x);
    } else if(choix == 3) {
        algo_Minico(m, n, 4, 6, c, x);
    } else if(choix == 4) {
        algo_MiniTab(m, n, 4, 6, c, x);
    } else if(choix == 5) {
        algo_Balas_Hammer(m, n, 4, 6, c, x);
    } else {
        printf("Choix n'est pas validé....\n");
    }

    rempli_graphe(4, 6, c, x, graphe);

    printf("\n ----------- Quantite effectivement transporte ---------------\n\n");
    affichageNA(nA, 6);
    affichageQuantite_Transporte(6, x, mA, 4);
    z = affichageZ(6, x, c, 4);
    printf("\nZ = %d\n\n", z);

    printf("----------------GRAPHE------------------------\n\n");
    affichageNA(nA, 6);
    affichageGraphe(mA, 4, 6, graphe);

    /****************** DEBUT STEPPING STONE ***************************************/
    printf("-----------Stepping Stone---------------------");
    int vX[4] = {-1};
    int vY[6] = {-1};
    for(i = 0; i < 4; i++) {
        vX[i] = -1;
    }
    for(j = 0; j < 6; j++) {
        vY[j] = -1;
    }
    int arrete = -1;
    int maxGraphe = -1;
    int indiceMaxI = -1;
    int indiceMaxJ = -1;
    for(i = 0; i < 4; i++) {
            for(j = 0; j < 6; j++) {
                if(graphe[i][j] != 0) {
                    if(maxGraphe == -1) {
                        maxGraphe = graphe[i][j];
                        indiceMaxI = i;
                        indiceMaxJ = j;
                    } else {
                        if(graphe[i][j] > maxGraphe) {
                            maxGraphe = graphe[i][j];
                            indiceMaxI = i;
                            indiceMaxJ = j;
                        }
                    }
                }
            }
        }
        printf("\nMax graphe %d, %d:%d\n", maxGraphe, indiceMaxI, indiceMaxJ);
    int depart = -1;
    while(arrete != 0) {
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 6; j++) {
                if(depart == -1) {
                    if(i == indiceMaxI) {
                        if(graphe[i][j] != 0) {
                            vY[j] = 0 + graphe[i][j];
                        }
                        vX[i] = 0;
                    }
                } else {
                    if(graphe[i][j] != 0) {
                        if(vX[i] == -1) {
                            if(vY[j] != -1) {
                                vX[i] = vY[j] - graphe[i][j];
                            }
                        } else {
                            vY[j] = vX[i] + graphe[i][j];
                        }
                    }
                }
            }
        }
        depart = 1;
        int arreteCopie = 0;
        for(j = 0; j < 6; j++) {
            if(vY[j] == -1) {
                arreteCopie = -1;
                arrete = -1;
            } else {
                arrete = 0;
            }
        }
        if(arreteCopie != 0) {
            arrete = -1;
        } else {
            arrete = 0;
        }

        /*for(j = 0; j < 6; j++) {
            printf("Vy[%d]=%d\n", j, vY[j]);
        }
        printf("------------------------------------\n");
         for(i = 0; i < 4; i++) {
            printf("Vx[%d]=%d\n", i, vX[i]);
        }*/
        //printf("Arrete %d\n", arrete);
    }
    int r;
        scanf("%d", &r);
    for(i = 0; i < 4; i++) {
        printf("%d ", vX[i]);
    }
    printf("\n------------------------------------\n");
    for(j = 0; j < 6; j++) {
        printf("%d ", vY[j]);
    }
    printf("\n");
    /***************** Debut algorithme Stepping Stone *****************************/
    int delta[4][6];
    ///Initialisation
    for(i = 0; i < 4; i++) {
        for(j = 0; j < 6; j++) {
            delta[i][j] = -1;
        }
    }
    ///******************************************************************************/
    int gain = 0;
    for(i = 0; i < 4; i++) {
        for(j = 0; j < 6; j++) {
            if(x[i][j] == 0) {
                delta[i][j] = vX[i] + c[i][j] - vY[j];
                if(delta[i][j] < 0) {
                    printf("Negative delt[%d][%d]=%d\n", i, j, delta[i][j]);

                }
            }
        }
    }



    return 0;
}

/***************************************** FIN PROGRAMME *********************************************************/
/***************************************** FIN PROGRAMME *********************************************************/
/***************************************** FIN PROGRAMME *********************************************************/

void affichageNA(int nA[], int taille) {
    printf("    ");
    int j = 0;
    for(j = 0; j < taille; j++) {
        printf("%d  ", nA[j]);
    }
    printf("\n\n");
}

void affichageCout_Unitaire_et_MA(int tailleJ, int c[][tailleJ], int m[], int n[], char mA[], int tailleI) {
    int i = 0, j = 0;
    for(i = 0; i < tailleI; i++) {
        printf("%c   ", mA[i]);

        for(j = 0; j < tailleJ; j++) {
            printf("%d ", c[i][j]);
        }
        printf(" | %d\n", m[i]);


        printf("\n");
    }
    printf("   ");
    j = 0;
    for(j = 0; j < tailleJ; j++) {
        printf("%d  ", n[j]);
    }
}

void affichageQuantite_Transporte(int tailleJ, int x[][tailleJ], char mA[], int tailleI) {
    int i = 0;
    int j = 0;
    for(i = 0; i < 4; i++) {
        printf("%c   ", mA[i]);
        for(j = 0; j < 6; j++) {
            if(x[i][j] != 0) {
                printf("%d  ", x[i][j]);
            } else {
                printf("%c  ", '-');
            }
        }
        printf("\n");
    }
}

int affichageZ(int tailleJ, int x[][tailleJ], int c[][tailleJ], int tailleI) {
    int i = 0;
    int j = 0;
    int z = 0;
    int dernierIndice;
    for(i = 0; i < tailleI; i++) {
        for(j = 0; j < tailleJ; j++) {
            if(x[i][j] != 0) {
                z = z + x[i][j]*c[i][j];
                printf("%d x %d +", x[i][j], c[i][j]);
            }
        }
    }
    return z;
}


/******************************** ALGORITHME CODE *****************************************/
/******************************** ALGORITHME CODE *****************************************/

/************ COIN NORD-OUEST *************/

void algo_Coin_nordOuest(int m[], int n[], int tailleI, int tailleJ, int x[][tailleJ]) {
    int i = 0;
    int j = 0;
    int choix = 1;
    if(choix == 1) {
        printf("\n\n ------Coin Nord-Ouest--------\n");

        i = 0;
        j = 0;
        for(i = 0; i < tailleI; i++) {
            for(j = 0; j < tailleJ; j++) {
                //printf("m :%d|n :%d\n", m[i], n[j]);
                if(m[i] != 0) {
                    if(n[j] != 0) {
                        if(m[i] > n[j]) {
                            x[i][j] = n[j];
                            m[i] = m[i] - n[j];
                            n[j] = n[j] - n[j];
                            //printf("x%d%d = %d ", i, j, x[i][j]);

                        } else {
                            x[i][j] = m[i];
                            n[j] = n[j] - m[i];
                            m[i] = m[i] - m[i];
                        }
                    }
                }
             }
        }
    }
}
/************ FIN COIN NORD-OUEST *************/

/************ DEBUT MINILI *************/
void algo_Minili(int m[], int n[], int tailleI, int tailleJ,int c[][tailleJ], int x[][tailleJ]) {
    int choix = 2;
    int i, j;
    if(choix == 2) {
        printf("\n\n  --------MINILI---------\n");
        i = 0;
        j = 0;
        int r;
        int indiceCopie[6];
        for(i = 0; i < tailleI; i++) {
            int indiceMin = -1;
            //printf("Ligne %d\n", i);
            int t = 0;
            for(t = 0; t < tailleJ; t++) {
                indiceCopie[t] = -1;
            }
            while(m[i] != 0) {
                j = 0;
                int min = -1;
                //printf("\nindice :%d, indice copie %d, min : %d\n", indiceMin, indiceCopie, min);
                 for(j = 0; j < tailleJ; j++) {
                    if(j != indiceCopie[j]) {
                        if(min == -1 || min > c[i][j]) {
                            min = c[i][j];
                            indiceMin = j;
                        }
                    }
                  }
                indiceCopie[indiceMin] = indiceMin;
                //scanf("%d", &r);
                //printf("indice :%d, indice copie %d, min : %dDebbbbb\n", indiceMin, indiceCopie[indiceMin], min);
                if(n[indiceMin] != 0) {
                    if(m[i] > n[indiceMin]) {
                        //printf("sup\n");
                        x[i][indiceMin] = n[indiceMin];
                        m[i] = m[i] - n[indiceMin];
                        n[indiceMin] = n[indiceMin] - n[indiceMin];
                        //printf("x%d[%d] = %d ", i, indiceMin, x[i][indiceMin]);
                    } else {
                        //printf("inf\n");
                        x[i][indiceMin] = m[i];
                        n[indiceMin] = n[indiceMin] - m[i];
                        m[i] = m[i] - m[i];
                        //printf("x%d[%d] = %d ", i, indiceMin, x[i][indiceMin]);
                    }
                }
            }

        }
    }
}
/************ FIN MINILI *********************************/

/************** DEBUT MINICO ****************************/
void algo_Minico(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]) {
    int choix = 3;
    int i, j;
    if(choix == 3) {
        printf("\n\n  --------MINICO---------\n");

        i = 0;
        j = 0;
        int r;
        int indiceCopie[4] = {-1};
        for(j = 0; j < tailleJ; j++) {
            int indiceMin = -1;
            //printf("\nCol %d\n", j);
            int t = 0;
            for(t = 0; t < tailleI; t++) {
                indiceCopie[t] = -1;
            }
            while(n[j] != 0) {
                i = 0;
                int min = -1;
                //printf("\nindice :%d, indice copie %d, min : %d\n", indiceMin, indiceCopie[indiceMin], min);
                 for(i = 0; i < tailleI; i++) {
                    if(i != indiceCopie[i]) {
                        if(min == -1 || min > c[i][j]) {
                            min = c[i][j];
                            indiceMin = i;
                        }
                    }
                  }
                //printf("TTTTindice min %d\n", indiceMin);
                indiceCopie[indiceMin] = indiceMin;
                //scanf("%d", &r);
                //printf("indice :%d, indice copie %d, min : %d Debbbbb\n", indiceMin, indiceCopie[indiceMin], min);
    /************************************* Debut Operation ******************************************/
    /************************************* Debut Operation ******************************************/
                if(m[indiceMin] != 0) {
                    if(m[indiceMin] > n[j]) {
                        //printf("sup\n");
                        x[indiceMin][j] = n[j];
                        m[indiceMin] = m[indiceMin] - n[j];
                        n[j] = n[j] - n[j];
                        //printf("x%d[%d] = %d ", indiceMin, j, x[indiceMin][j]);
                    } else {
                        //printf("inf\n");
                        x[indiceMin][j] = m[indiceMin];
                        n[j] = n[j] - m[indiceMin];
                        m[indiceMin] = m[indiceMin] - m[indiceMin];
                        //printf("x%d[%d] = %d ", indiceMin, j, x[indiceMin][j]);
                    }
                }
        /************************************* FIN Operation ******************************************/
                //printf(" %d\n", n[j]);
            }

        }

    }

}
/************** FIN MINICO ****************************/

/******************** DEBUT MINITAB *******************/
void algo_MiniTab(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]) {
    int choix = tailleI;
    int i, j;
    if(choix == tailleI) {
        printf("\n\n  --------MINITAB---------\n");

        i = 0;
        j = 0;
        int r;
        int min = -1;
        int mincopie = -1;
        int indiceI = -1;
        int indiceJ = -1;
        int indiceCol[6] = {0};
        int indiceLig[4] = {0};
        for(i = 0; i < tailleI; i++) {
            indiceLig[i] = -1;
        }
        for(j = 0; j < tailleJ; j++) {
            indiceCol[j] = -1;
        }
        int indiceCopieI = -1;
        int indiceCopieJ = -1;
        int indiceRayeI = -1;
        int indiceRayeJ = -1;
        int arrete = -1;
        while(arrete != 0) {
                mincopie = -1;
                //x[0][2] = 3;
            //printf("Debut : min %d, X %d, Y %d\n", min,indiceRayeI, indiceRayeJ);
            for(i = 0; i < tailleI; i++) {
                //printf("I:%d\n", i);
                for(j = 0; j < tailleJ; j++) {
                    if(min == -1) {
                        min = c[i][j];
                        mincopie = min;
                        indiceI = i;
                        indiceJ = j;
                    } else if(indiceRayeI == -1 && indiceRayeJ == -1) {
                        if(min > c[i][j]) {
                            min = c[i][j];
                            indiceI = i;
                            indiceJ = j;
                            mincopie = min;
                        }
                        //printf("\nDeb 1:%d\n", min);
                    }
                    //printf("j:%d\n", j);
                    if(indiceRayeI != -1) {
                        if(i == indiceLig[i]) {
                            min = 0;
                        } else {
                            if(n[j] != 0) {
                                if(x[i][j] == 0) {
                                    if(min == 0) {
                                        min = c[i][j];
                                        mincopie = min;
                                        indiceI = i;
                                        indiceJ = j;
                                    } else {
                                        if(min > c[i][j]) {
                                            min = c[i][j];
                                            mincopie = min;
                                            indiceI = i;
                                            indiceJ = j;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(indiceRayeJ != -1) {
                        if(j == indiceCol[j]) {
                            min = 0;
                        } else {
                            if(m[i] != 0) {
                                if(x[i][j] == 0) {
                                    if(min == 0 && mincopie == -1) {
                                        min = c[i][j];
                                        mincopie = min;
                                        indiceI = i;
                                        indiceJ = j;
                                    } else {
                                        if(mincopie > c[i][j]) {
                                            min = c[i][j];
                                            mincopie = min;
                                            indiceI = i;
                                            indiceJ = j;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }
            min = mincopie;
            //printf("Min %d, minCopie %d\n", min, mincopie);
            indiceCopieI = indiceI;
            indiceCopieJ = indiceJ;
            //mincopie = min;
            /*for(j = 0; j < 6; j++) {
                printf(" \nCol %d:%d\n", j, indiceCol[j]);
            }*/
            /*printf("\nmin %d, i=%d, j=%d\n\debbbb Operation", min, indiceI, indiceJ);
            scanf("%d", &r);*/
            //Operation
            //printf("CCCCC X %d %d\n", indiceI, m[indiceI]);
            //printf("CCCCC Y %d %d\n", indiceJ, n[indiceJ]);
    /****************** DEBUT OPERATION ************************************************/
            if(m[indiceI] > n[indiceJ]) {
                x[indiceI][indiceJ] = n[indiceJ];
                m[indiceI] = m[indiceI] - n[indiceJ];
                n[indiceJ] = n[indiceJ] - n[indiceJ];
            } else {
                x[indiceI][indiceJ] = m[indiceI];
                n[indiceJ] = n[indiceJ] - m[indiceI];
                m[indiceI] = m[indiceI] - m[indiceI];
            }
            //printf("CCCCCFarany X %d %d\n", indiceI, m[indiceI]);
            //printf("CCCCCFarany Y %d %d\n", indiceJ, n[indiceJ]);
            if(m[indiceI] == 0) {
                indiceLig[indiceI] = indiceI;
                indiceRayeI = indiceI;
                indiceRayeJ = -1;
            } else if(n[indiceJ] == 0){
                indiceCol[indiceJ] = indiceJ;
                indiceRayeJ = indiceJ;
                indiceRayeI = -1;
            }
        /****************** FIN OPERATION ************************************************/
            min = 0;
            if(m[indiceI] == 0 && n[indiceJ] == 0) {
                arrete = 0;
            }
        }
    }
}
/****************** FIN MINITAB ******************************/

/**************** DEBUT BALAS HAMMER *************************/
void algo_Balas_Hammer(int m[], int n[], int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ]) {
    int choix = 5;
    int i, j;
    if(choix == 5) {
        printf("\n\n  --------Balas Hammer---------\n");

        i = 0;
        j = 0;
        int arrete = -1;
        int indiceRayeI[4];
        int indiceRayeJ[6];
        int indiceI = -1;
        int indiceJ = -1;
        int mm[tailleI];
        int nn[6];
        int diff_max = -1;
        int min = -1;
        int minIm = -1;
        for(i = 0; i < tailleI; i++) {
            mm[i] = -1;
            indiceRayeI[i] = -1;
        }
        for(j = 0; j < tailleJ; j++) {
            nn[j] = -1;
            indiceRayeJ[j] = -1;
        }

        while(arrete != 0) {
            /****************************** Deb Trouve minimal et minimal immediat ***************************/
            /******************************* Trouver dans ligne ****************************************/
            for(i = 0; i < tailleI; i++) {
                mm[i] = 0;
            }
            for(j = 0; j < tailleJ; j++) {
                nn[j] = 0;
            }
            //printf("\n******Debut procedure*******************\n\n");
            for(i = 0; i < tailleI; i++) {
                min = 0;
                minIm = 0;
                indiceI = -1;
                indiceJ = -1;
                //printf("Deb min %d, min Im %d\n", min, minIm);
                if(i != indiceRayeI[i]) {
                    //printf("Lig %d\n", i);
                    for(j = 0; j < tailleJ; j++) {
                        if(j != indiceRayeJ[j]) {       ///Tsy @ Colonne rayee
                            //printf("Diff C%d\n", j);
                            if(min == 0) {
                                min = c[i][j];
                            } else {
                                if(min >= c[i][j]) {
                                    minIm = min;
                                    min = c[i][j];
                                } else {
                                    if(minIm == 0)
                                        minIm = c[i][j];
                                    else {
                                        if (minIm >= c[i][j]) {
                                            minIm = c[i][j];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if(minIm != 0) {
                    mm[i] = minIm - min;
                    //printf("i:%d Diff, minIm = %d, min=%d |", i, minIm, min);
                } else {
                    mm[i] = min;
                    minIm = min;
                    //printf("i:%d Diff, minIm = %d, min=%d |", i, minIm, min);
                }
                //printf("Lig %d, Min %d, min Ime %d\n", i, min, minIm);
                //printf(" diff max %d\n", mm[i]);
            }
            //printf("\n");
            /******************************* Trouver diff dans Colonne ****************************************/
            for(j = 0; j < tailleJ; j++) {
                min = 0;
                minIm = 0;
                //printf("Deb min %d, min Im %d\n", min, minIm);
                if(j != indiceRayeJ[j]) {
                    //printf("\nCol %d\n", j);
                    for(i = 0; i < tailleI; i++) {
                        if(i != indiceRayeI[i]) {
                            if(min == 0) {
                                min = c[i][j];
                            } else {
                                if(min >= c[i][j]) {
                                    minIm = min;
                                    min = c[i][j];
                                } else {
                                    if(minIm == 0)
                                        minIm = c[i][j];
                                    else {
                                        if (minIm >= c[i][j]) {
                                            minIm = c[i][j];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if(minIm != 0) {
                    nn[j] = minIm - min;
                    //printf("j:%d Diff, minIm = %d, min=%d |", j, minIm, min);
                } else {
                    nn[j] = min;
                    minIm = min;
                    //printf("j:%d Diff, minIm = %d, min=%d |", j, minIm, min);
                }
                //printf("Col %d, Min %d, min Ime %d\n", j, min, minIm);
                //printf(" diff max %d\n", nn[j]);
            }
            //printf("\n");
            /*for(i = 0; i < tailleI; i++) {
                printf("%d ", mm[i]);
            }
            printf("\n");
            for(j = 0; j < 6; j++) {
                printf("%d ", nn[j]);
            }*/
            /****************************** Fin Trouve minimal et minimal immediat ***************************/

            /***************** Trouver difference maximal dans tab Ligne et Colonne diff_max *****************/
            int deb = -1;
            int diff_max_copie = -1;
            int indiceCopieI = -1;
            int indiceCopieJ = -1;
            for(i = 0; i < tailleI; i++) {
                if(deb == -1) {
                    diff_max = mm[i];
                    indiceCopieI = i;
                } else {
                    if(mm[i] > diff_max){
                        diff_max = mm[i];
                        indiceCopieI = i;
                    }
                }
                deb = 1;
                //printf("%d ", mm[i]);   ///difference entre min et min immediate
            }
            /************************ Max Copie sur Tableau Ligne ***********************************/
            diff_max_copie = diff_max;
            ///printf("&&&Max lig = %d ", diff_max_copie);
            //printf("Diffmax copie %d\n", diff_max_copie);
            diff_max = -1;
            //printf("\n");
            deb = -1;
            indiceCopieJ = -1;
            for(j = 0; j < tailleJ; j++) {
                if(deb == -1) {
                    diff_max = nn[j];
                    indiceCopieJ = j;
                } else {
                    if(nn[j] > diff_max) {
                        diff_max = nn[j];
                        indiceCopieJ = j;
                    }
                }
                deb = 1;
                //printf("indiceJ %d, diff max,%d \n", indiceCopieJ, diff_max, nn[j]);
            }
            //printf("Diff max %d\n, indice %d", diff_max, indiceCopieJ);
            if(diff_max_copie < diff_max) {
                diff_max = diff_max;
                indiceJ = indiceCopieJ;
            } else {
                diff_max = diff_max_copie;
                indiceI = indiceCopieI;
            }
            /************** FIN Trouve diff max sur tab Ligne et Colonne ***********************/
            /***********************************************************************************/
            //printf("\nDeb:Diff_max %d, %d:%d\n", diff_max, indiceI, indiceJ);

            /********************* Chercher Indice de minimal pour Ligne ou Colonne nahitagna diff max ************/
            /******************************************************************************************************/
            deb = -1;
            min = -1;
            int indiceCase = -1;
            /***************** Chercher minimum nahitagna diff max pour chaque Colonne ************************************/
            if(indiceI != -1) {
                for(j = 0; j < tailleJ; j++) {
                    if(indiceRayeJ[j] != j) {
                        if(deb == -1) {
                            min = c[indiceI][j];
                            indiceCase = j;
                        } else {
                            if(min > c[indiceI][j]) {
                                min = c[indiceI][j];
                                indiceCase = j;
                            }
                        }
                        deb = 1;
                    }
                }
                //printf("Case a remplir %d:%d, min trouve %d\n", indiceI, indiceCase, c[indiceI][indiceCase]);
            } else {
            /***************** Chercher minimum nahitagna diff max pour chaque ligne ************************************/
                for(i = 0; i < tailleI; i++) {
                    if(indiceRayeI[i] != i) {
                        if(deb == -1) {
                            min = c[i][indiceJ];
                            indiceCase = i;
                        } else {
                            if(min > c[i][indiceJ]) {
                                min = c[i][indiceJ];
                                indiceCase = i;
                            }
                        }
                        deb = 1;
                    }
                }
                //printf("Case a remplir %d:%d\n", indiceCase, indiceJ);
                 //printf("Case a remplir %d:%d, min trouve %d\n", indiceCase, indiceJ, c[indiceCase][indiceJ]);
            }

            /***************** Fin cherche indice pour minimal ***************************************/
            //int r;
            //printf("\nDeb Remplissage\n");
            //scanf("%d", &r);
            /************************* Remplissage Case X[][] ****************************************/
            /****************************************************************************************/
            if(indiceI != -1) {
                if(x[indiceI][indiceCase] == 0) {
                    if(m[indiceI] > n[indiceCase]) {
                        x[indiceI][indiceCase] = n[indiceCase];
                        m[indiceI] = m[indiceI] - n[indiceCase];
                        n[indiceCase] = n[indiceCase] - n[indiceCase];
                        indiceRayeJ[indiceCase] = indiceCase;
                    } else {
                        x[indiceI][indiceCase] = m[indiceI];
                        n[indiceCase] = n[indiceCase] - m[indiceI];
                        m[indiceI] = m[indiceI] - m[indiceI];
                        indiceRayeI[indiceI] = indiceI;
                    }
                }
                //printf("Resultat m[%d]=%d, n[%d]=%d\n", indiceI, m[indiceI], indiceCase, n[indiceCase]);
            } else {
                if(x[indiceCase][indiceJ] == 0) {
                    if(m[indiceCase] > n[indiceJ]) {
                        x[indiceCase][indiceJ] = n[indiceJ];
                        m[indiceCase] = m[indiceCase] - n[indiceJ];
                        n[indiceJ] = n[indiceJ] - n[indiceJ];
                        indiceRayeJ[indiceJ] = indiceJ;
                    } else {
                        x[indiceCase][indiceJ] = m[indiceCase];
                        n[indiceJ] = n[indiceJ] - m[indiceCase];
                        m[indiceCase] = m[indiceCase] - m[indiceCase];
                        indiceRayeI[indiceCase] = indiceCase;
                    }
                }
                //printf("Resultat m[%d]=%d, n[%d]=%d\n", indiceCase, m[indiceCase], indiceJ, n[indiceJ]);
            }

            /*for(i = 0; i < tailleI; i++) {
                printf("Case a RayerI %d:%d\n", i, indiceRayeI[i]);
            }
            printf("-----------------------------------\n");
            for(j = 0; j < 6; j++) {
                printf("Case a RayerJ %d:%d\n", j, indiceRayeJ[j]);
            }*/
            /************************* FIN Remplissage Case X[][] ****************************************/
           /************************* FIN Remplissage Case X[][] ****************************************/
            if(m[indiceI] == 0 && n[indiceCase] == 0) {
                arrete = 0;
            }
        }

         /************************* FIN Boucle While ****************************************/
        /************************* FIN Boucle While ****************************************/
    }
}
/************* FIN BALAS HAMMER **********************************/

/************** REMPLISSAGE GRAPHE *******************************/
void rempli_graphe(int tailleI, int tailleJ, int c[][tailleJ], int x[][tailleJ] , int graphe[][tailleJ]) {
     int i, j;
     for(i = 0; i < tailleI; i++) {
        for(j = 0; j < tailleJ; j++) {
            if(x[i][j] != 0) {
                graphe[i][j] = c[i][j];
            }
        }
    }
}

void affichageGraphe(char mA[], int tailleI, int tailleJ, int graphe[][tailleJ]) {
    int i, j;
    for(i = 0; i < tailleI; i++) {
        printf("%c ", mA[i]);
        for(j = 0; j < 6; j++) {
            if(graphe[i][j] == 0) {
                printf(" -");
            } else {
                printf("  %d ", graphe[i][j]);
            }
        }
        printf("\n");
    }
}


