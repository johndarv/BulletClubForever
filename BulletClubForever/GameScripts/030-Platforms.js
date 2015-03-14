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