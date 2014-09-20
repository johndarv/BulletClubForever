var spriteWidth = 25;
var spriteHeight = 25;

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var levelMap = new LevelMap(100, 20);
var platforms = new Platforms(game, levelMap);
var player = new Player(game);

function preload() {
    platforms.preload();
    player.preload();
}

function create() {
    game.stage.backgroundColor = "#66CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    levelMap.init();

    platforms.create();
    player.create();
}

function update() {
    player.update(platforms);
}