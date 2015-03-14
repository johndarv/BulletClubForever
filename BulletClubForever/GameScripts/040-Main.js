var TILE_WIDTH = 25;
var TILE_HEIGHT = 25;

var WINDOW_WIDTH = 800;
var WINDOW_HEIGHT = 500;

var maxXValueForPlayer = 275;

var game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

var platforms = new Platforms(game);
var player = new Player(game);

function preload() {
    platforms.preload();
    player.preload();
}

function create() {
    game.stage.backgroundColor = "#66CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms.create();
    player.create();
}

function update() {
    player.update(platforms);
    platforms.update();

    doScrolling();
}

function render() {
    //this.game.debug.text('Scrolling tracker: ' + platforms.scrollingTracker, 432, 32);
    //this.game.debug.text('Player x value: ' + player.playerSprite.x, 32, 64);
    this.game.debug.text('Number of platforms: ' + platforms.group.length, 432, 64);
}

function doScrolling() {
    var distanceToScroll = maxXValueForPlayer - (player.playerSprite.x);

    if (distanceToScroll < -1) {
        var distanceToActuallyScroll = Math.floor(distanceToScroll) + 1;

        // Update player
        this.player.playerSprite.x += distanceToActuallyScroll;
        this.player.previousDistance = this.player.playerSprite.x;

        // Update platforms
        this.platforms.group.forEachAlive(function (platform) {
            platform.x += distanceToActuallyScroll;
        });

        // Update the tiles array that keeps track of the platforms
        this.platforms.tilesArray.forEach(function (column) {
            column.x += distanceToActuallyScroll;
        });

        this.platforms.scrollingTracker += -distanceToActuallyScroll;
    }
}