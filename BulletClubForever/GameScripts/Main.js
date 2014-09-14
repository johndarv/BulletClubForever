///<reference path="../ExternalScripts/phaser.js" />
///<reference path="LevelMap.js" />

var spriteWidth = 25;
var spriteHeight = 25;

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create});

var platforms = null;
var levelMap = new LevelMap(100, 20);
var cameraXPos = 0;

function preload() {
    game.load.image('player', 'Sprites/player.png');
    game.load.image('mud', 'Sprites/mud2.png');
    game.load.image('topGrass', 'Sprites/topGrass.png');
    game.load.image('bottomGrass', 'Sprites/bottomGrass.png');
}

function create() {
    game.stage.backgroundColor = "#33CCFF";

    levelMap.create();

    platforms = game.add.group();
    platforms.enableBody = true;
    platforms.addMultiple(200, 'platform');

    // for each tile on the level map, if it's a platform, display the sprites
    for (var i = 0; i < levelMap.y; i++) {
        for (var j = 0; j < levelMap.x; j++) {
            var currentTile = levelMap.map[j][i];
            if (currentTile === "P" || currentTile === "G") {
                // draw the mud
                game.add.sprite(j * spriteWidth, i * spriteHeight, 'mud');

                // draw the grass if necessary
                var tileAbove = levelMap.map[j][i - 1];
                if (tileAbove === ".") {
                    game.add.sprite(j * spriteWidth, (i - 1) * spriteHeight, 'topGrass');
                    game.add.sprite(j * spriteWidth, i * spriteHeight, 'bottomGrass');
                }
            }
        }
    }

    game.add.sprite(0, 450, 'player');
}

function update() {

}