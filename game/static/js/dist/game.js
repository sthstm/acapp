class AcGameMenu {
	constructor(root) {
		this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
            </div>
        `);
	this.root.$ac_game.append(this.$menu);


	}

}
class AcGame {
    constructor(id){
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.AcWingOS = AcWingOS;
        

        // this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        // this.playground = new AcGamePlayground(this);

        // this.start();
    }
}
