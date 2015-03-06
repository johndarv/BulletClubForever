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