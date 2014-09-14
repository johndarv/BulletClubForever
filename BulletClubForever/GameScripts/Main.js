///<reference path="../ExternalScripts/phaser.js" />
///<reference path="LevelMap.js" />

var spriteWidth = 25;
var spriteHeight = 25;

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create});

var background = null;
var foreground = null;
var platforms = null;
var player = null;
var levelMap = new LevelMap(100, 20);
var cameraXPos = 0;

function preload() {
    game.load.image('mud', 'Sprites/mud2.png');
    game.load.image('topGrass', 'Sprites/topGrass.png');
    game.load.image('bottomGrass', 'Sprites/bottomGrass.png');
    game.load.image('player', 'Sprites/player.png');
}

function create() {
    game.stage.backgroundColor = "#33CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    levelMap.create();

    background = game.add.group();
    platforms = game.add.group();
    platforms.enableBody = true;
    player = game.add.sprite(0, 450, 'player');
    foreground = game.add.group();

    var newPlatform = null;

    // for each tile on the level map, if it's a platform, display the sprites
    for (var i = 0; i < levelMap.y; i++) {
        for (var j = 0; j < levelMap.x; j++) {
            var currentTile = levelMap.map[j][i];
            if (currentTile === "P" || currentTile === "G") {
                // draw the mud
                background.create(j * spriteWidth, i * spriteHeight, 'mud');
                // draw the grass if necessary
                var tileAbove = levelMap.map[j][i - 1];
                if (tileAbove === ".") {
                    // create the actual platform
                    newPlatform = platforms.create(j * spriteWidth, i * spriteHeight, 'bottomGrass');
                    // stop it from ever moving
                    newPlatform.body.immovable = true;
                    foreground.create(j * spriteWidth, (i - 1) * spriteHeight, 'topGrass');
                }
            }
        }
    }
}

function update() {

}