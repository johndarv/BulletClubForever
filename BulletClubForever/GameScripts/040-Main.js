var spriteWidth = 25;
var spriteHeight = 25;

var maxXValueForPlayer = 300;

var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

var levelMap = new LevelMap(40, 20);
var platforms = new Platforms(game, levelMap);
var player = new Player(game);
var activeObjects;

function preload() {
    platforms.preload();
    player.preload();
}

function create() {
    game.stage.backgroundColor = "#66CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    activeObjects = game.add.group();

    levelMap.init();

    platforms.create(activeObjects);
    player.create(activeObjects);
}

function update() {
    player.update(platforms);
    platforms.update();

    doScrolling();
}

function render() {
    player.render();
}

function doScrolling() {
    var distanceToScroll = maxXValueForPlayer - player.playerSprite.body.x;

    if (distanceToScroll < 0) {
        this.player.playerSprite.body.x += distanceToScroll;
        this.platforms.group.x += distanceToScroll;
        this.platforms.scrollingTracker += -distanceToScroll;
    }
}