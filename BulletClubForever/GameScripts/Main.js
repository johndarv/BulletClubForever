var spriteWidth = 25;
var spriteHeight = 25;

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create });

var levelMap = new LevelMap(100, 20);
var platforms = new Platforms(game, levelMap);
var player = null;

function preload() {
    platforms.preload();
    game.load.image('player', 'Sprites/player.png');
}

function create() {
    game.stage.backgroundColor = "#66CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    levelMap.init();

    platforms.create();

    player = game.add.sprite(0, 450, 'player');
}

function update() {

}