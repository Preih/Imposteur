class AppGame{
    constructor()
    {
        this.gameApi = new gameApi("../data/data.json");
    }

    async main(){
        var data = await this.gameApi.getMots();
        var avatars = await this.gameApi.getAvatars();
        new startGame(avatars);

    }
}

const App = new AppGame();
App.main();