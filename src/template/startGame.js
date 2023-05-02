class startGame{
    constructor(avatars,tabJoueurs){
        this.gameApi = new gameApi("../data/data.json");
        this.avatars = avatars;
        this.wrapperGame = document.querySelector(".game");
        this.nbJoueurs = 0;
        this.tabJoueurs = [];
        this.choixAvatar ;
        this.nbJoueursMin = 4;
        this.saveTabJoueurs = false;
        if(tabJoueurs && tabJoueurs.length>=4){
            this.tabJoueurs = tabJoueurs;
            this.saveTabJoueurs = true;
        }

        this.nbImposteurConseille = Math.trunc(this.tabJoueurs.length/2);
        this.nbInnocentConseille = this.tabJoueurs.length - this.nbImposteurConseille;
        this.switch = false;

        this.createTemplate();
        
    }

    async createTemplate(){

        if(this.saveTabJoueurs)
        {
            this.recapJoueurs();
            return;
        }

        let affichage = `<div class=saisie-joueur><input type=text class=input-saisie placeholder="Pseudo"></div><div class=wrapper-avatars>`;
        for(let i=0;i<this.avatars.length;i++)
        {
            affichage += `<div class="avatar"><img class="available" src="${this.avatars[i].name}" alt=""></div>`
        }
        affichage += "</div><div class=erreur></div><input type=submit class=addJoueur value=S'inscrire><div class=startGame>Commencer !</div>";

        this.wrapperGame.innerHTML = affichage;

        document.querySelectorAll(".available").forEach(avatar=>{
            avatar.addEventListener("click",(e)=>{
                if(document.querySelector(".active")) // supprime l'ancien actif
                {
                    document.querySelector(".active").classList.remove("active");
                }
                // console.log("target Avatar");
                e.target.classList.add("active");
                this.choixAvatar = e.target.getAttribute("src");
            })
        })

        document.querySelector(".addJoueur").addEventListener("click",(e)=>{
            var saisiePseudo = document.querySelector(".input-saisie").value;
            let verifPseudo = this.verifPseudo(saisiePseudo)
            console.log("ADDJOUEUR");
            if(verifPseudo || this.choixAvatar == undefined)
            {
                // ERREUR
                if(verifPseudo)
                {
                    document.querySelector(".erreur").innerHTML = verifPseudo
                    return;
                }

                document.querySelector(".erreur").innerHTML = "Veuillez choisir un avatar";
            }
            else{

                let joueur = {
                    pseudo : saisiePseudo,
                    avatar : this.choixAvatar,
                    elimine : false
                }
                document.querySelector(".input-saisie").value = ""; // reset champs
                document.querySelector(".erreur").innerHTML = `Le joueur ${joueur.pseudo} a bien été inscrit !`; // On informe de l'inscription
                this.tabJoueurs.push(joueur);
                document.querySelector(".active").classList.remove("available");
                document.querySelector(".active").classList.add("unavailable");
                document.querySelector(".active").classList.remove("active");

                // console.log(this.tabJoueurs);
            }
        })

        document.querySelector(".startGame").addEventListener("click",(e)=>{
            if(this.tabJoueurs.length >=4)
            {
                // console.log("DEBUT DU JEU");
                this.nbImposteurConseille = Math.trunc(this.tabJoueurs.length/2)
                this.nbInnocentConseille = this.tabJoueurs.length - this.nbImposteurConseille;
                this.recapJoueurs();
            }
            else{
                document.querySelector(".erreur").innerHTML = "Veuillez inscrire au minimum 4 joueurs";
            }
        })
    }

    verifPseudo(saisie){
        if(saisie.length<1)
        {
            return "Veuillez saisir un pseudo d'au moins 4 caractères"
        }
        return;
    }

    recapJoueurs(){
        let affichage = "<div class=wrapper-joueurs>";
        let cpt = 1;
        for(const joueur of this.tabJoueurs)
        {
            if(joueur != "delete")
            {
                affichage += `<div class='joueur' data-joueur=${cpt}>
                <img class=supprJoueur src='../public/assets/images/delete.png'>
                <div class='avatar recapAvatar'>
                    <img src=${joueur.avatar} >
                </div>
                <div class=nomJoueur>
                    <input type=text class=pseudoJoueur value='${joueur.pseudo}' disabled />
                </div>
                </div>`;
                cpt++;
            }

        }

        affichage += `<div class=btnAddJoueur><img src=../public/assets/images/btn-plus.png></div></div>
                    <h2>Paramètres :</h2>
                    <div class=optionJeu>
                        <h3>Nombre d'imposteur(s)</h3>
                        <input class=saisieImposteur type=number>
                        <h3>Nombre d'innocent(s)</h3>
                        <input class=saisieInnocent type=number>
                    </div>
                    <div class=row-recap-joueurs>
                        <h3>Détective</h3>
                        <div class=container-switch>
                            <label class="switch">
                                <input class="checkbox" type="checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class=inputMrWhite>
                        </div>
                    </div>
                    <div class=row-recap-joueurs>
                        <h3>Afficher les rôles</h3>
                        <div class=container-switch>
                            <label class="switch">
                                <input class="checkbox switch-role" type="checkbox">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div class=erreur></div>
                    <div class=btnRecap>Jouer !</div>`;
        this.wrapperGame.innerHTML = affichage;
        document.querySelector(".checkbox").addEventListener("change",(e)=>{
            e.preventDefault();
            e.stopPropagation();
            this.switch = !this.switch;
            console.log(this.switch);
            let checkbox = e.target;
            let wrapperMrWhite = document.querySelector(".inputMrWhite");
            if(this.switch)
            {
                wrapperMrWhite.style.height = '80px';
                wrapperMrWhite.style.opacity = '1';
                let affichage = `<h3>Nombre de détective(s)</h3>
                                <input class=saisieMrWhite type=number value=1>`;
                wrapperMrWhite.innerHTML += affichage;
                //document.querySelector(".saisieImposteur").value = this.nbImposteurConseille-1;
                
                document.querySelector(".saisieMrWhite").addEventListener("focusout",(e)=>{
                    console.log("focusOutMrWhite");
                    let cptJoueurs = 0 ;
                    for(const joueur of this.tabJoueurs)
                    {
                        if(joueur != "delete")
                        {
                            cptJoueurs++;
                        }
                    }

                    let nbMrWhite = e.target.value;
                    if(nbMrWhite == 0)
                    {
                        this.switch = false;
                        checkbox.checked = false;
                        document.querySelector(".inputMrWhite").innerHTML = "";
                        document.querySelector(".inputMrWhite").style.height = "0px";
                        let nbImposteur = Math.trunc(cptJoueurs/2);

                        //document.querySelector(".saisieImposteur").value = nbImposteur;
                        //document.querySelector(".saisieInnocent").value = cptJoueurs-nbImposteur;
                        return;
                    }
                    //let nbImposteur = document.querySelector(".saisieImposteur").value;
                    //let nbInnocent = document.querySelector(".saisieInnocent").value;
                    if(nbMrWhite>cptJoueurs-2) // Au moins 1 imposteur et 1 innocent
                    {
                        e.target.value = cptJoueurs-2;
                        //document.querySelector(".saisieImposteur").value = 1;
                        //document.querySelector(".saisieInnocent").value = 1;
                        //console.log("AAAAAAAAA");
                        return;
                    }
                    else // nbMrWhite < tabJoueurs-2
                    {
                        let cptMrWhite = e.target.value;
                        let cptImposteur = Math.round(cptJoueurs/2)-cptMrWhite;
                        if(cptImposteur<1)
                        {
                            cptImposteur = 1;
                        }
                        let cptInnocent = cptJoueurs - cptImposteur - cptMrWhite;
                        //document.querySelector(".saisieMrWhite").value = cptMrWhite;
                        if(cptMrWhite>cptImposteur)
                        {
                            //document.querySelector(".saisieImposteur").value = 1;
                            //document.querySelector(".saisieInnocent").value = cptJoueurs - cptMrWhite - 1;
                            //console.log("BBBBBBBBBB");
                        }
                        else{ // cptMrWhite<=cptImposteur 
                            //document.querySelector(".saisieImposteur").value = cptImposteur;
                            //document.querySelector(".saisieInnocent").value = cptInnocent;
                            //console.log("cptImposteur",cptImposteur);
                            //console.log("cptInnocent",cptInnocent);
                            //console.log("CCCCCCCCCCCC");
                        }
                    }
                })
                return;

                
            }
            //document.querySelector(".saisieInnocent").value = this.nbInnocentConseille;
            //document.querySelector(".saisieImposteur").value = this.nbImposteurConseille;
            wrapperMrWhite.style.height = '0px';
            wrapperMrWhite.style.opacity = '0';
            wrapperMrWhite.innerHTML = "";

        })

        document.querySelectorAll(".nomJoueur").forEach(nomJoueur=>{
            nomJoueur.addEventListener("click",(e)=>{
                console.log("MODIFIER PSEUDO");
                let parent = e.target.parentNode;
                let input = e.target.parentNode.querySelector("input");
                if(input)
                {

                    input.removeAttribute("disabled");
                    input.focus();
                }

            })
        })


        document.querySelectorAll(".pseudoJoueur").forEach(pseudoJoueur=>{
            pseudoJoueur.addEventListener("focusout",(e)=>{

                let parent = e.target.parentNode; // On remonte de 2 dans le dom
                parent = parent.parentNode;
                let dataJoueur = parent.getAttribute("data-joueur")
                this.tabJoueurs[dataJoueur-1].pseudo = e.target.value;
                console.log("SAVE PSEUDO");
                e.target.disabled = true;
            })
        })

        document.querySelectorAll(".supprJoueur").forEach(supprJoueur=>{
            supprJoueur.addEventListener("click",(e)=>{
                let parent = e.target.parentNode;
                let numJoueur = parent.getAttribute("data-joueur");
                this.tabJoueurs[numJoueur-1] = "delete";
                console.log(numJoueur);
                parent.remove();
                console.log("SUPPRIME JOUEUR");
                let nbJoueurs = 0;
                for(const joueur of this.tabJoueurs)
                {
                    if(joueur != "delete"){
                        nbJoueurs++;
                    }
                }
                this.nbImposteurConseille = Math.trunc(nbJoueurs/2);
                //document.querySelector(".saisieImposteur").value = this.nbImposteurConseille ;
                //document.querySelector(".saisieInnocent").value = nbJoueurs - this.nbImposteurConseille;
                

            })
        })

        document.querySelector(".btnAddJoueur").addEventListener("click",(e)=>{
            
            this.addJoueur();
        })

        document.querySelector(".saisieImposteur").addEventListener("focusout",(e)=>{
            let cptJoueurs = 0;
            for(const joueur of this.tabJoueurs)
            {
                if(joueur != "delete")
                {
                    cptJoueurs++;
                }
            }
            // @TODO VERIFIER SI MRWHITE
            if(e.target.value == "" || e.target.value >= cptJoueurs || e.target.value == "0")
            {
                // e.target.value = nbImposteurConseille;
                // document.querySelector(".saisieInnocent").value = this.nbInnocentConseille;
            } 
            else{
                // document.querySelector(".saisieInnocent").value = cptJoueurs- parseInt(e.target.value,10);
            }
        })

        document.querySelector(".saisieInnocent").addEventListener("focusout",(e)=>{
            let cptJoueurs = 0;
            for(const joueur of this.tabJoueurs)
            {
                if(joueur != "delete")
                {
                    cptJoueurs++;
                }
            }
            // @TODO VERIFIER SI MRWHITE
            if(e.target.value == "" || e.target.value >= cptJoueurs || e.target.value == "0")
            {
                // e.target.value = nbInnocentConseille;
                //document.querySelector(".saisieImposteur").value = this.nbImposteurConseille;
            }
            else{
                //document.querySelector(".saisieImposteur").value = cptJoueurs- parseInt(e.target.value,10);
            }
        })


        document.querySelector(".btnRecap").addEventListener("click",(e)=>{
            // console.log("DEBUT DE PARTIE");
            //let nbImposteur = document.querySelector(".saisieImposteur").value;
            //let nbInnocent = document.querySelector(".saisieInnocent").value;
            let tabJoueursDelete = this.tabJoueurs;
            this.tabJoueurs = [];
            for(const joueur of tabJoueursDelete)
            {
                if(joueur != "delete")
                {
                    this.tabJoueurs.push(joueur);
                }

            }
            console.log("this.tabJoueurs.length",this.tabJoueurs.length);
            console.log("this.nbJoueursMin",this.nbJoueursMin);
            if(this.tabJoueurs.length<this.nbJoueursMin)
            {
                let erreur = `Vous devez être au minimum ${this.nbJoueursMin} joueurs pour lancer une partie.`;
                document.querySelector(".erreur").innerHTML = erreur;
                return;
            }
            let nbMrWhite = 0;
            let nbInnocent = parseInt(document.querySelector(".saisieInnocent").value,10);
            let nbImposteur = parseInt(document.querySelector(".saisieImposteur").value,10);
            if(this.switch)
            {
                nbMrWhite = parseInt(document.querySelector(".saisieMrWhite").value,10);
            }
            let nbJoueursRole = nbImposteur + nbInnocent + nbMrWhite;
            console.log("nbJoueursRole",nbJoueursRole);
            if(this.tabJoueurs.length ==  nbJoueursRole && nbInnocent>0 && nbImposteur>0){
                let boolRole = document.querySelector(".switch-role").checked;
                new Game(this.tabJoueurs,nbImposteur,nbInnocent,nbMrWhite,boolRole);
            }
            else{
                document.querySelector(".erreur").innerHTML = ""

                if(this.tabJoueurs.length !=  nbJoueursRole)
                {
                    document.querySelector(".erreur").innerHTML = "<div>Le nombre de joueurs ne coïncide pas, veuillez vérifier les paramètres.</div>"
                }
                if(nbInnocent<1)
                {
                    document.querySelector(".erreur").innerHTML += "<div>Vous devez avoir au minimum 1 innocent.</div>"
                }
                if(nbImposteur<1)
                {
                    document.querySelector(".erreur").innerHTML += "<div>Vous devez avoir au minimum 1 imposteur.</div>"
                }
            }

        })
    }

    addJoueur(){

        console.log("addJoueur");
        let avatarDispo = [];
        
        for(const avatar of this.avatars)
        {
            let dispo = true;
            for(const joueur of this.tabJoueurs)
            {
                if(avatar.name == joueur.avatar)
                {
                    dispo = false;
                }
            }
            if(dispo)
            {
                avatarDispo.push(avatar)
            }
        }
        console.log(avatarDispo);
        let listeAvatarsDispo = "";
        for(const avatar of avatarDispo){
            listeAvatarsDispo += `<div class="avatar">
                                        <img class="available" src="${avatar.name}" alt="">
                                    </div>`;
        }
        let domAddJoueur = `<div class=popUpAddJoueur>
            <div class=closePopUpAddJoueur>X</div>
            <input type=text class=saisieAddJoueur >
            <div class=wrapper-avatars>
                ${listeAvatarsDispo}
            </div>
            <div class=erreurAddJoueur></div>
            <input type=submit class=addJoueurPopUp value=Ajouter>
        </div>`;
        this.wrapperGame.innerHTML += domAddJoueur;
        document.querySelector(".closePopUpAddJoueur").addEventListener("click",(e)=>{
            document.querySelector(".popUpAddJoueur").remove();
            this.recapJoueurs();
        })

        document.querySelector(".saisieAddJoueur").value = "";
        document.querySelectorAll(".available").forEach(avatar=>{
            avatar.addEventListener("click",(e)=>{
                if(document.querySelector(".active")) // supprime l'ancien actif
                {
                    document.querySelector(".active").classList.remove("active");
                }
                console.log("target Avatar");
                e.target.classList.add("active");
                this.choixAvatar = e.target.getAttribute("src");
            })
        })

        document.querySelector(".addJoueurPopUp").addEventListener("click",(e)=>{
            var saisiePseudo = document.querySelector(".saisieAddJoueur").value;
            let verifPseudo = this.verifPseudo(saisiePseudo)
            if(verifPseudo)
            {
                // ERREUR
                document.querySelector(".erreurAddJoueur").innerHTML = verifPseudo
            }
            else{
                document.querySelector(".erreurAddJoueur").innerHTML = ""; // On reset l'erreur
                let joueur = {
                    pseudo : saisiePseudo,
                    avatar : this.choixAvatar
                }

                this.tabJoueurs.push(joueur);
                document.querySelector(".active").classList.remove("available");
                document.querySelector(".active").classList.add("unavailable");
                document.querySelector(".active").classList.remove("active");

                let cptJoueurs = 0;
                for(const joueur of this.tabJoueurs)
                {
                    if(joueur != "delete")
                    {
                        cptJoueurs++;
                    }
                }
                let nbImposteur = Math.trunc(cptJoueurs/2);
                //document.querySelector(".saisieImposteur").value = nbImposteur;
                //document.querySelector(".saisieInnocent").value = cptJoueurs - nbImposteur;
                this.recapJoueurs();
            }
        })
    }

}