///<reference path="../ExternalScripts/phaser.js" />
///<reference path="LevelMap.js" />

var spriteWidth = 25;
var spriteHeight = 25;

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create });

var platforms = null;
var player = null;

var levelMap = new LevelMap(100, 20);

function preload() {
    game.load.image('platform', 'Sprites/platform.png');
    game.load.image('player', 'Sprites/player.png');
}

function create() {
    //game.stage.backgroundColor = "#33CCFF";
    //game.stage.backgroundColor = "#99CCFF";
    game.stage.backgroundColor = "#66CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    levelMap.create();

    platforms = game.add.group();
    platforms.enableBody = true;
    player = game.add.sprite(0, 450, 'player');
    foreground = game.add.group();

    var newPlatform = null;

    // for each tile on the level map, if it's a platform, create the sprites
    for (var i = 0; i < levelMap.y; i++) {
        for (var j = 0; j < levelMap.x; j++) {
            var currentTile = levelMap.map[j][i];
            if (currentTile === "P" || currentTile === "G") {
                // draw the mud
                platforms.create(j * spriteWidth, i * spriteHeight, 'platform');
            }
        }
    }
}

function update() {
    
}