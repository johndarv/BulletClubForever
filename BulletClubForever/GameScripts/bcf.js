///#source 1 1 /GameScripts/010-Bullets.js
Bullets = function (game) {
    /// <param name="game" type="Phaser.Game"></param>
    this.game = game;
    this.group = null;

    this.SPEED = 3;
};

Bullets.prototype.preload = function () {
    this.game.load.image('bullet', 'Sprites/bullet.png');
};

Bullets.prototype.update = function () {
    var self = this;

    this.group.forEachAlive(function (bullet) {
        var direction = self.determineDirectionOfSprite(bullet);
        bullet.x += direction.x;
        bullet.y += direction.y;

        // Check collisions

        bullet.x += direction.x;
        bullet.y += direction.y;

        // Check collisions

        bullet.x += direction.x;
        bullet.y += direction.y;

        // Check collisions
    });
};

Bullets.prototype.create = function () {
    this.group = this.game.add.group();
    this.group.enableBody = true;
};

Bullets.prototype.shoot = function (player) {
    /// <param name="player" type="Player"></param>
    
    var x = player.playerSprite.x;
    var y = player.playerSprite.y;

    var bullet = this.group.getFirstDead();

    if (bullet != null) {
        bullet.revive();
        bullet.x = x;
        bullet.y = y;
    }
    else {
        bullet = this.group.create(x, y, 'bullet');
    }

    bullet.body.facing = player.shootDirection;
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
};

Bullets.prototype.determineDirectionOfSprite = function (sprite) {
    if (sprite.body.facing === 1) {
        return new Direction(0, -this.SPEED);
    }
    else if (sprite.body.facing === 2) {
        return new Direction(this.SPEED, -this.SPEED);
    }
    else if (sprite.body.facing === 3) {
        return new Direction(this.SPEED, 0);
    }
    else if (sprite.body.facing === 4) {
        return new Direction(this.SPEED, this.SPEED);
    }
    else if (sprite.body.facing === 5) {
        return new Direction(0, this.SPEED);
    }
    else if (sprite.body.facing === 6) {
        return new Direction(-this.SPEED, this.SPEED);
    }
    else if (sprite.body.facing === 7) {
        return new Direction(-this.SPEED, 0);
    }
    else if (sprite.body.facing === 8) {
        return new Direction(-this.SPEED, -this.SPEED);
    }
};

Direction = function (x, y) {
    this.x = x;
    this.y = y;
};
///#source 1 1 /GameScripts/020-Player.js
Player = function (game) {
    /// <param name="game" type="Phaser.Game"></param>
    this.game = game;

    this.MAXSPEED = 150; // pixels per second
    this.ACCELLERATION = 300; // pixels per second per second
    this.JUMPSPEED = 400;
    this.GRAVITY = 1200;
    this.SHOOT_FREQUENCY = 10;

    this.playerSprite = null;

    this.keyboard = null;
    this.cursorKeys = null;

    this.shootDirection = 3;

    this.jumpWasReleaseSinceLastPressed = false;

    this.previousDistance = 0;

    this.shootingCount = 0;
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

Player.prototype.update = function (platforms, bullets) {
    /// <param name="platforms" type="Platforms"></param>
    /// <param name="bullets" type="Bullets"></param>

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

    // Shooting
    this.setShootDirection();

    if (this.keyboard.isDown(Phaser.Keyboard.Z)) {
        if (this.shootingCount % 10 === 0) {
            bullets.shoot(this);
        }

        this.shootingCount++;
    }
    else {
        this.shootingCount = 0;
    }

    this.totalDistance += this.playerSprite.x - this.previousDistance;
    this.previousDistance = this.playerSprite.x;
};

Player.prototype.setShootDirection = function () {
    if (this.keyboard.isDown(Phaser.Keyboard.Z)) {
        return;
    }

    if (this.cursorKeys.right.isDown && this.cursorKeys.up.isDown) {
        this.shootDirection = 2;
    }
    else if (this.cursorKeys.right.isDown && this.cursorKeys.down.isDown) {
        this.shootDirection = 4;
    }
    else if (this.cursorKeys.left.isDown && this.cursorKeys.up.isDown) {
        this.shootDirection = 8;
    }
    else if (this.cursorKeys.left.isDown && this.cursorKeys.down.isDown) {
        this.shootDirection = 6;
    }
    else if (this.cursorKeys.up.isDown) {
        this.shootDirection = 1;
    }
    else if (this.cursorKeys.right.isDown) {
        this.shootDirection = 3;
    }
    else if (this.cursorKeys.down.isDown) {
        this.shootDirection = 5;
    }
    else if (this.cursorKeys.left.isDown) {
        this.shootDirection = 7;
    }
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
var bullets = new Bullets(game);
var player = new Player(game);

function preload() {
    platforms.preload();
    bullets.preload();
    player.preload();
}

function create() {
    game.stage.backgroundColor = "#66CCFF";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms.create();
    bullets.create();
    player.create();
}

function update() {
    player.update(platforms, bullets);
    platforms.update();
    bullets.update();

    doScrolling();
}

function render() {
    //this.game.debug.text('Scrolling tracker: ' + platforms.scrollingTracker, 432, 32);
    //this.game.debug.text('Player x value: ' + player.playerSprite.x, 32, 64);
    //this.game.debug.text('Number of platforms: ' + platforms.group.length, 432, 64);
    this.game.debug.text('Number of bullets: ' + bullets.group.length, 32, 32);
    this.game.debug.text('Player direction: ' + player.shootDirection, 432, 32);
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

        // Update bullets

        // Update the tiles array that keeps track of the platforms
        this.platforms.tilesArray.forEach(function (column) {
            column.x += distanceToActuallyScroll;
        });

        this.platforms.scrollingTracker += -distanceToActuallyScroll;
    }
}
