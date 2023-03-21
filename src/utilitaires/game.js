class Game{
    constructor(tabJoueurs,nbImposteur, nbInnocent,nbMrWhite,boolRole){
        this.boolRole = boolRole;
        this.tabJoueurs = tabJoueurs;
        this.wrapperGame = document.querySelector(".game");   
        this.gameApi = new gameApi("../data/data.json");
        this.wrapperGame.innerHTML = "";
        this.data = "";
        this.main();
        this.nbInnocents = nbInnocent;
        this.nbImposteurs = nbImposteur;
        this.nbMrWhite = nbMrWhite;
        this.constInnocent = 0;
        this.constImposteur = 1;
        this.constMrWhite = 2;
        this.tabRoles = [];
        console.log(this.tabJoueurs)
        for(let i=1;i<=this.nbInnocents;i++)
        {
            this.tabRoles.push(this.constInnocent);
        }
        for(let i=1;i<=this.nbImposteurs;i++)
        {
            this.tabRoles.push(this.constImposteur);
        }
        for(let i=1;i<=this.nbMrWhite;i++)
        {
            this.tabRoles.push(this.constMrWhite);
        }
        
        this.tabRoles = this.shuffle(this.tabRoles); // Mélange le tableau de rôle
        for(let i=0;i<this.tabJoueurs.length;i++)
        {
            this.tabJoueurs[i].role = this.tabRoles[i];
        }

        

    }

    async main(){
        var data = await this.gameApi.getMots();
        let nbMax = data.length+1;
        let nbRandom = Math.random() ;
        let idRandom = Math.floor(nbRandom*(nbMax-1)+1);
        this.dataGame = await this.gameApi.getMot(idRandom);
        this.dataGame = this.dataGame.mots;
        this.dataGame = this.shuffle(this.dataGame); // mélanger les mots
        console.log(this.dataGame);
        this.attributionMot();
        console.log(this.tabJoueurs);
        //console.log(data);
    }
    attributionMot(){
        // console.log("this.mots",this.data);
        for(const joueur of this.tabJoueurs)
        {
            joueur.mot = this.dataGame[joueur.role];
        }
        let currentJoueur = 0;
        this.revealMot(currentJoueur,0);
        return this.tabJoueurs;
    }

    revealMot(currentJoueur,etape){
        let affichage = "";
        if(etape == 0)
        {
            affichage = `<div class=container-tour>
            <div class=contenu-tour>Au tour de : <span class=important>${this.tabJoueurs[currentJoueur].pseudo}</span></div>
            <div class=next>Next</div>
            </div>`
        }
        else if(etape == 1)
        {
            let affichageRole = '';
            if(this.boolRole)
            {
                let libelleRole = '';
                switch(this.tabJoueurs[currentJoueur].role){
                    case 0 :
                        libelleRole = 'innocent'; 
                        break;
                    case 1 : 
                        libelleRole = 'imposteur';
                        break;
                    // case 2 : 
                    //     libelleRole = 'détective';
                    //     break;
                }
                affichageRole = `<div class=row-role>Vous êtes : <span class=important>${libelleRole}</span></div>`;
            }
            let detailsRole = `Ton mot est : <span class=important>${this.tabJoueurs[currentJoueur].mot}</span>`;
            if(this.tabJoueurs[currentJoueur].role == 2)
            {
                detailsRole = `<div class=row-role>Vous êtes : <span class=important>détective</span></div>
                                <div>Vous n'avez pas de mots, vous devez essayer de vous faire passer pour un innocent.</div>`
            }
            affichage = `<div class=container-tour>
            ${affichageRole}
            <div class=contenu-tour>${detailsRole}</div>
            <div class=next>Next</div>
            </div>`;
        }

        this.wrapperGame.innerHTML = affichage;

        document.querySelector(".next").addEventListener('click',(e)=>{
            console.log("NEXT");
            let newCurrentJoueur = currentJoueur;
            let nextEtape = etape + 1;
            if(nextEtape >1)
            {
                nextEtape = 0;
                newCurrentJoueur++;
            }
            if(newCurrentJoueur < this.tabJoueurs.length)
            {
                console.log("nouveau reveal")
                this.revealMot(newCurrentJoueur,nextEtape);
            }
            else{ // On commence les tours
                this.round(-1,1,1)
            }
        })
    }

    round(joueur,tour,numberRound){
        let numJoueur ;
        if(tour == 1)
        {
            numJoueur = this.getRandom(0,this.tabJoueurs.length-1);
        }
        else{
            numJoueur = joueur;
        }
        
        let newtour = tour +1;

        while(this.tabJoueurs[numJoueur].elimine == true)
        {
            numJoueur++;
            if(numJoueur>=this.tabJoueurs.length)
            {
                numJoueur=0;
            }
        }
        if(joueur == -1 && numberRound == 1) // 1er joueur au 1er tour
        {
            if(this.tabJoueurs[numJoueur].role == this.constMrWhite) // Si le premier joueur est MrWhite;
            {
                this.round(-1,1,1);
            }
        }

        let affichage = `<div class=container-tour>
                            <div class=contenu-tour>
                                <div class=titre-tour>Tour ${numberRound}</div>
                                <div>Au tour de : <span class=important>${this.tabJoueurs[numJoueur].pseudo}</span></div>
                            </div>
                            <div class=next>Joueur suivant</div>
                        </div>`;
        this.wrapperGame.innerHTML = affichage;
        document.querySelector(".next").addEventListener("click",(e)=>{
            let nouveauJoueur = numJoueur + 1;
            console.log("nouveau Joueur",nouveauJoueur);
            console.log("joueur suivant");

            if(nouveauJoueur >= this.tabJoueurs.length)
            {
                nouveauJoueur = 0;
            }
            let cptNonElimine =0;
            for(const joueur of this.tabJoueurs)
            {
                if(joueur.elimine == false)
                {
                    cptNonElimine++;
                }
            }
            console.log("cptNonElimine",cptNonElimine);
            if(tour == cptNonElimine)
            {
                this.vote(numberRound);
            }
            else
            {
                
                console.log("tour",newtour);
                this.round(nouveauJoueur,newtour,numberRound);
            }

        })
    }

    getRandom(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    vote(round){
        let affichage = `<div class=container-tour>
                            <div class=titre-tour>Tour de vote</div>`;
        let listeJoueurs = "";
        let cpt=0;
        for(const joueur of this.tabJoueurs)
        {

            listeJoueurs += `<div class='joueur #elimination#' data-joueur=${cpt}>
                                <div class=avatar>
                                    <img src=${joueur.avatar} >
                                </div>
                                <div class=nomJoueur>${joueur.pseudo}</div>
                            </div>`;
            if(joueur.elimine == true)
            {
                listeJoueurs = listeJoueurs.replace('#elimination#',"elimine");
            }
            else
            {
                listeJoueurs = listeJoueurs.replace('#elimination#',"");
            }
            
            cpt++;
        }

        affichage += `<div class=wrapper-joueurs>
                        ${listeJoueurs}
                    </div>
                    <div class=erreur></div>
                    <div class=btn-voter>Eliminer</div>
                    </div>`

        this.wrapperGame.innerHTML = affichage;
        console.log(this.tabJoueurs);
        document.querySelectorAll(".joueur").forEach(joueur=>{
            joueur.addEventListener("click",(e)=>{
                e.stopPropagation();
                e.preventDefault();
                let element = e.target;
                while(element.classList.value.search("joueur")<0)
                {
                    console.log("boucleWHile");
                    element = element.parentNode;
                }
                if(element.classList.value.search("elimine")>0)
                {
                    return;
                }
                let dataJoueur = e.target.getAttribute("data-joueur");
                if(document.querySelector(".voteElimine"))
                {
                    document.querySelector(".voteElimine").classList.remove("voteElimine");
                }
                element.classList.add("voteElimine");
            })
        })

        document.querySelector(".btn-voter").addEventListener("click",(e)=>{
            if(!document.querySelector(".voteElimine"))
            {
                document.querySelector(".erreur").innerHTML = "Veuillez éliminer une personne";
            }
            else
            {
                document.querySelector(".erreur").innerHTML = ""; // On supprime l'erreur s'il y en a une
                let dataJoueurElimine = document.querySelector(".voteElimine").getAttribute("data-joueur");
                this.tabJoueurs[dataJoueurElimine].elimine = true;
                let role;
                if(this.tabJoueurs[dataJoueurElimine].role == 0)
                {
                    role = "innocent";
                }
                else if(this.tabJoueurs[dataJoueurElimine].role == 1){
                    role = "imposteur";
                }
                else if(this.tabJoueurs[dataJoueurElimine].role == 2){
                    role = "Mr White";
                }
                let affichage = `<div class=container-tour>
                                    <div class=contenu-tour>Vous avez décidé d'éliminer <span class=important>${this.tabJoueurs[dataJoueurElimine].pseudo}</span>.</div>
                                    <div class=contenu-tour>Son rôle était <span class=important>${role}</span></div>
                                    <div class=next>Suivant</div>
                                </div>`;
                this.wrapperGame.innerHTML = affichage;
            }
            if(document.querySelector(".next"))
            {
                document.querySelector(".next").addEventListener("click",(e)=>{
                    if(!this.checkRole()){ // Il reste imposteur/mr White -> On continue
                        this.round(-1,1,round+1);
                    }
                    else{
                        this.EndGame();
                    }
                })
            }
        })
    }
    EndGame(){
        let affichage = `<div class=container-end>`;
        let survivantImposteur = false;
        let survivantMrWhite = false;
        for(const joueur of this.tabJoueurs)
        {
            // || (joueur.role == 2 && joueur.elimine == false) 
            if((joueur.role == 1 && joueur.elimine == false) ) // s'il reste au moins un imposteur ou Mr White
            {
                survivantImposteur = true;     
            }
            if((joueur.role == 2 && joueur.elimine == false) ) // s'il reste au moins un imposteur ou Mr White
            {
                survivantMrWhite = true;
            }
        }
        if(survivantImposteur)
        {   
            affichage += `<div class=resultatGame>Victoire des <span class=important>imposteurs</span></div>`;
        }
        else
        {
            affichage += `<div class=resultatGame>Victoire des <span class=important>innocents</span></div>`;
        }
        if(this.nbMrWhite>0)
        {
            if(survivantMrWhite)
            {
                affichage += `<div class=resultatGame>Mr White n'a pas été démasqué</div>`;
            }
            else
            {
                affichage += `<div class=resultatGame>Mr White a été démasqué</div>`;
            }
        }
        let motImposteur ;
        let motInnocent ;
        let joueursImposteur = "";
        let joueursInnocent = "";
        let joueursMrWhite = "";
        for(const joueur of this.tabJoueurs)
        {
            if(joueur.role == 1) // est un imposteur
            {
                joueursImposteur+= `<div class="joueur">
                                        <div class="avatar recapAvatar">
                                            <img src="${joueur.avatar}">
                                        </div>
                                        <div class="nomJoueur">${joueur.pseudo}</div>
                                    </div>`;
                motImposteur = joueur.mot
            }
            else if(joueur.role == 0) // est un innocent
            {
                joueursInnocent+= `<div class="joueur">
                                        <div class="avatar recapAvatar">
                                            <img src="${joueur.avatar}">
                                        </div>
                                        <div class="nomJoueur">${joueur.pseudo}</div>
                                    </div>`;
                motInnocent = joueur.mot
            }
            else if(joueur.role == 2) // est un MrWhite
            {
                joueursMrWhite+= `<div class="joueur">
                                        <div class="avatar recapAvatar">
                                            <img src="${joueur.avatar}">
                                        </div>
                                        <div class="nomJoueur">${joueur.pseudo}</div>
                                    </div>`;
            }

        }
        // let affichageImposteur = `<div class=bilan-imposteurs>
        //                             <h2>Le mot des imposteurs était 
        //                             <div class=wrapper-avatars>
        //                             `
        affichage += `<div class=bilan-joueurs>
                            <div class=bilan-imposteurs>
                                <h2>Le mot des imposteurs était <span class=important>${motImposteur}</span>.
                                <h3>Liste des imposteurs :<h3>
                                <div class=wrapper-avatars>
                                    ${joueursImposteur}
                                </div>
                            </div>
                            <div class=bilan-innocents>
                                <h2>Le mot des innocents était <span class=important>${motInnocent}</span>.
                                <h3>Liste des innocents :<h3>
                                <div class=wrapper-avatars>
                                    ${joueursInnocent}
                                </div>
                            </div>
                            [#MRWHITE#]
                            <div class=newGame>Rejouer ?</div>
        </div>`
        console.log("nbMrWhite",this.nbMrWhite);
        if(this.nbMrWhite>0)
        {
            console.log("Aucun MrWhite");
            let affichageMrWhite = `<div class=bilan-mrWhite>
                                        <h3>Liste des détectives :<h3>
                                        <div class=wrapper-avatars>
                                            ${joueursMrWhite}
                                        </div>
                                    </div>`
            affichage = affichage.replace("[#MRWHITE#]",affichageMrWhite);
        }
        else{
            console.log("MrWhite en jeu");
            affichage = affichage.replace("[#MRWHITE#]","");
        }
        this.wrapperGame.innerHTML = affichage;

        document.querySelector(".newGame").addEventListener("click",(e)=>{
            this.newGame();
        })
    }
    async newGame(){
        let api = new gameApi("../data/data.json");
        var avatars = await api.getAvatars();
        let newtabJoueur = [];
        for(const joueur of this.tabJoueurs)
        {
            let newJoueur = {
                pseudo:joueur.pseudo,
                avatar:joueur.avatar,
                elimine : false
            }
            newtabJoueur.push(newJoueur);
        }
        new startGame(avatars,newtabJoueur);
    }
    checkRole(){
        let finGame = false;
        let cptNonElimine = 0;
        let survivantInnocent = false;
        let survivantImposteur = false;
        for(const joueur of this.tabJoueurs)
        {
            if(joueur.elimine == false)
            {
                cptNonElimine++;
            }
            if((joueur.role == 1 && joueur.elimine == false) || (joueur.role == 2 && joueur.elimine == false) ) // s'il reste au moins un imposteur ou Mr White
            {
                survivantImposteur = true;
                // console.log("Un imposteur est toujours en jeu")
                // finGame = false;
            }
            if(joueur.role == 0 && joueur.elimine == false) // s'il reste un innocent
            {
                survivantInnocent = true;
            }
        }
        console.log("cptNonElimines",cptNonElimine);
        console.log("survivantImposteur",survivantImposteur);
        console.log("survivantInnocent",survivantInnocent);
        if(cptNonElimine == 1)
        {
            finGame = true;
        }
        else if((survivantImposteur & !survivantInnocent) || (!survivantImposteur & survivantInnocent))
        {
            finGame = true;
        }

        return finGame;
    }
    shuffle(array)
    {
        let resultat = array.sort((a, b) => 0.5 - Math.random());
        return resultat;
    }
}