var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create });

function preload() {
    game.load.image('player', 'Sprites/player.png');
    game.load.image('mud', 'Sprites/mud.png');
    game.load.image('grass', 'Sprites/grass.png');
}

function create() {
    game.stage.backgroundColor = "#33CCFF";

    game.add.sprite(0, 450, 'player');

    var map = initMap();
}