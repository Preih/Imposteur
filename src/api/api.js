class Api{
    constructor(url){
        this.url = url;
    }

    async get(){
        return await fetch(this.url)
        .then(res=>res.json()) // transforme la requête en json
        //.then(res=>res.photographers) // récupère uniquement les photographes du fichier json
        .catch(err => console.log("Une erreur",err)) // Si y a une erreur
    }
}

class gameApi extends Api{
    constructor(url)
    {
        super(url);
    }

    async getMots(){

        return await this.get()
        .then(res=>res.jeu) 

    }

    async getMot(idMot){
        return await this.get()
        .then(res=>res.jeu) 
        .then(mots=>
            {
            for(const mot of mots)
            {
                if(mot.id == idMot){
                    var dataMot = mot;
                }
            }
            return dataMot;
        })
    }


    async getAvatars(){

        return await this.get()
        .then(res=>res.avatars);
        
    }
}