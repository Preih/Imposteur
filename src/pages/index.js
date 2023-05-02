class App {
    constructor() {
        this.pageWrapper = document.querySelector('.container-home')
        this.affichageAccueil();
    }

    affichageRegles()
    {
        let affichage = `<img class=arrow-return src="./assets/images/retour.png" >
                        <div class=container-rules>
                            
                            <div class=recap-rules>
                                <h1>Règle du jeu :</h1>
                                <p>Au début de chaque partie, un mot est attribué à chaque joueur parmis deux mots.</p>
                                <p>Selon le mot attribué, le joueur peut être soit innocent, soit imposteur !</p>
                                <p>Lors de chaque tour durant la partie, chaque joueur devra dire un mot se rapprochant du sien. </p>
                                <p>Après chaque tour, un vote se fera pour éliminer une personne.</p>
                                <p>Lors de ce vote, les imposteurs ne doivent pas se faire démasquer, et les innocents doivent tenter de les éliminer ...
                                <p>Pour rajouter un peu de piments au jeu, vous pouvez choisir de jouer avec le rôle détective également. </p>
                                <p>Son rôle est comme celui de l'imposteur, ne pas se faire démasquer, au détail près que le détective n'a PAS DE MOT attribué lors du début de partie. </p>
                            </div>
                        </div>`
        
        document.querySelectorAll(".menu").forEach(menu=>{
            menu.remove();
        })

        this.pageWrapper.innerHTML += affichage;

        document.querySelector(".arrow-return").addEventListener("click",(e)=>{
            this.affichageAccueil();
        })
    }

    affichageAccueil(){
        let affichage = `<div class="line-index menu">
                        </div>
                        <div class="menu-title menu">
                            <h1><a href="index.html">Imposteur</a></h1>
                        </div>
                        <div class="menu-rules menu">
                            <div class="rules">Règles du jeu</div>
                        </div>
                        <div class="menu-game menu">
                                <a href="game.html">Jouer !</a>
                        </div>`;


        this.pageWrapper.innerHTML = affichage;

        this.rules = document.querySelector(".rules")
        this.rules.addEventListener("click",(e)=>{
            console.log("Règles")
            this.affichageRegles();
        })
    }


}

const app = new App()