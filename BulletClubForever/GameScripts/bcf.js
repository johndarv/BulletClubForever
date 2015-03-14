///#source 1 1 /GameScripts/010-LevelMap.js
LevelMap = function (x, y) {
    this.map = [];
    this.x = x;
    this.y = y;
};

LevelMap.prototype.init = function () {
    for (var i = 0; i < this.x; i++) {
        // First, create the array within the array
        this.map[i] = [];

        for (var j = 0; j < this.y; j++) {
            this.map[i][j] = ".";
        }
    }

    this.initPlatforms();
    this.overrideFirstPlatform(); // The platform underneath where the player first appears needs to be a piece of ground
};

LevelMap.prototype.initPlatforms = function () {
    for (var i = 0; i < this.x; i++) {
        this.makePieceOfMap(i);
    }
};

LevelMap.prototype.overrideFirstPlatform = function () {
    this.map[0][this.y - 1] = "G";
};

LevelMap.prototype.addNewPieceOfMap = function () {
    this.map[this.x] = [];
    this.makePieceOfMap(this.x);
    this.x++;
};

LevelMap.prototype.makePieceOfMap = function (xAxisPos) {
    var hasGround = !createRandomBool(9);
    var groundPiece = "."

    // The ground tile
    if (hasGround) {
        groundPiece = "G";
    }

    this.map[xAxisPos][this.y - 1] = groundPiece;

    // Now cycle through all but the ground tiles and randomly create platforms
    for (var i = 0; i < this.y - 1; i++) {
        var hasPlatform = createRandomBool(20);

        // Don't ever create tiles for the first two (right at the top of the map)
        if (i < 2) {
            hasPlatform = false;
        }

        var newPiece = ".";

        if (hasPlatform) {
            newPiece = "P";
        }

        this.map[xAxisPos][i] = newPiece;
    }
};

function createRandom(n) {
    return Math.floor((Math.random() * n) + 1);
}

function createRandomBool(n) {
    var r = createRandom(n);
    return r === 1;
}
///#source 1 1 /GameScripts/020-Player.js
Player = function (game) {
    /// <param name="game" type="Phaser.Game"></param>
    this.game = game;

    this.MAXSPEED = 150; // pixels per second
    this.ACCELLERATION = 300; // pixels per second per second
    this.JUMPSPEED = 400;
    this.GRAVITY = 1200;

    this.playerSprite = null;

    this.keyboard = null;
    this.cursorKeys = null;

    this.jumpWasReleaseSinceLastPressed = false;

    this.previousDistance = 0;
};

Player.prototype.preload = function () {
    this.game.load.image('player', 'Sprites/player.png');
};

Player.prototype.create = function () {
    this.playerSprite = this.game.add.sprite(0, 445, 'player');
    //activeObjects.add(this.playerSprite);

    this.game.physics.arcade.enable(this.playerSprite);
    this.playerSprite.body.collideWorldBounds = true;

    // set bounding box
    this.playerSprite.body.setSize(12, 25, 6, 0);

    this.playerSprite.body.gravity.y = this.GRAVITY;
    this.playerSprite.body.maxVelocity.setTo(this.MAXSPEED, this.JUMPSPEED);

    this.keyboard = this.game.input.keyboard;
    this.cursorKeys = this.keyboard.createCursorKeys();
};

Player.prototype.update = function (platforms) {
    /// <param name="platforms" type="Platforms"></param>

    var self = this;

    // Collisions section
    self.game.physics.arcade.collide(self.playerSprite, platforms.group);

    // Movement Section
    // Next set the new values according to player input
    if (this.cursorKeys.right.isDown) {
        this.playerSprite.body.acceleration.x = this.ACCELLERATION;
    }
    else if (this.cursorKeys.left.isDown) {
        this.playerSprite.body.acceleration.x = -this.ACCELLERATION;
    }
    else {
        this.playerSprite.body.acceleration.x = 0;
        this.playerSprite.body.velocity.x = 0;
    }

    // Jumping
    var onPlatform = this.playerSprite.body.touching.down;

    if (onPlatform && this.jumpWasReleaseSinceLastPressed) {
        if (this.keyboard.isDown(Phaser.Keyboard.X)) {
            this.playerSprite.body.velocity.y = -this.JUMPSPEED;
            this.jumpWasReleaseSinceLastPressed = false;
        }
    }

    if (!this.keyboard.isDown(Phaser.Keyboard.X)) {
        this.jumpWasReleaseSinceLastPressed = true;
    }

    this.totalDistance += this.playerSprite.x - this.previousDistance;
    this.previousDistance = this.playerSprite.x;
};
///#source 1 1 /GameScripts/030-Platforms.js
Platforms = function (game) {
    /// <param name="game" type="Phaser.Game"></param>
    this.game = game;
    this.group = null;

    this.tilesArray = [];

    this.tileBuffer = -5;

    this.scrollingTracker = 0;
};

Platforms.prototype.preload = function () {
    this.game.load.image('platform', 'Sprites/platform.png');
};

Platforms.prototype.create = function () {
    this.group = this.game.add.group();
    this.group.enableBody = true;

    var numberOfXTilesNeeded = WINDOW_WIDTH / TILE_WIDTH + this.tileBuffer;
    var numberOfYTilesNeeded = WINDOW_HEIGHT / TILE_HEIGHT;

    for (var i = 0; i < numberOfXTilesNeeded; i++) {
        var newColumn = this.createNewPlatformsColumn(i * TILE_WIDTH, numberOfYTilesNeeded);

        this.tilesArray.push(newColumn);
    }

    // TODO: Overwrite the tile in the bottom left corner so the player never dies straight away
};

Platforms.prototype.update = function () {
    if (this.scrollingTracker >= TILE_WIDTH) {
        // then we've scrolled a whole 1 platform, so can delete the platforms that can never be reached again
        this.tilesArray[0].array.forEach(function (platform) {
            platform.kill();
        });

        this.tilesArray.shift();

        var xValueOfPreviousColumn = this.tilesArray[this.tilesArray.length - 1].x;

        // and create new platforms just off the right of the screen
        var newColumn = this.createNewPlatformsColumn(xValueOfPreviousColumn + TILE_WIDTH, WINDOW_HEIGHT / TILE_HEIGHT);
        this.tilesArray.push(newColumn);

        this.scrollingTracker -= TILE_WIDTH;
    }
};

Platforms.prototype.createNewPlatformsColumn = function (x, numberOfYTilesNeeded) {
    var columnArray = [];

    // Note: we start on 2 so we don't ever create platforms for the two topmost columns.
    // And we leave 1 at the end to handle creating the ground tile.
    for (var j = 2; j < numberOfYTilesNeeded - 1; j++) {
        var hasPlatform = createRandomBool(20);

        if (hasPlatform) {
            columnArray.push(this.createPlatformSprite(x, j * TILE_HEIGHT));
        }
    }

    //var hasGroundTile = !createRandomBool(9);
    var hasGroundTile = true;

    if (hasGroundTile) {
        columnArray.push(this.createPlatformSprite(x, (numberOfYTilesNeeded - 1) * TILE_HEIGHT));
    }

    return new PlatformColumn(x, columnArray);
};

Platforms.prototype.createPlatformSprite = function (x, y) {
    var deadTile = this.group.getFirstDead();

    if (deadTile != null) {
        deadTile.revive();
        deadTile.x = x;
        deadTile.y = y;
        return deadTile;
    }
    else {
        var newPlatform = this.group.create(x, y, 'platform');
        newPlatform.body.immovable = true;
        newPlatform.body.checkCollision = { up: true, down: false, left: false, right: false };
        return newPlatform;
    }
};

PlatformColumn = function (x, array) {
    this.x = x;
    this.array = array;
};

function createRandom(n) {
    return Math.floor((Math.random() * n) + 1);
}

function createRandomBool(n) {
    var r = createRandom(n);
    return r === 1;
}
///#source 1 1 /GameScripts/040-Main.js
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
    //this.game.debug.text('Number of platforms: ' + platforms.group.length, 432, 64);
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
