LevelMap = function (x, y) {
    this.map = [];
    this.x = x;
    this.y = y;
}

LevelMap.prototype = {
    init: function () {
        for (var i = 0; i < this.x; i++) {
            // First, create the array within the array
            this.map[i] = [];

            for (var j = 0; j < this.y; j++) {
                this.map[i][j] = ".";
            }
        }

        this.initPlatforms();
        this.overrideFirstPlatform();
    },

    initPlatforms: function () {
        for (var i = 0; i < this.x; i++) {
            this.makePieceOfMap(i);
        }
    },

    overrideFirstPlatform: function () {
        this.map[0][this.y - 1] = "G";
    },

    makeNewPieceOfMap: function () {
        this.map[this.x] = [];
        this.makePieceOfMap(this.x);
        this.x++;
    },

    makePieceOfMap: function (xAxisPos) {
        var hasGround = !createRandomBool(9);
        var groundPiece = "."

        // The ground tile
        if (hasGround) {
            groundPiece = "G";
        }
        
        this.map[xAxisPos][this.y - 1] = groundPiece;

        // Now cycle through all but the ground tile and randomly create platforms
        for (var i = 0; i < this.y - 1; i++) {
            var hasPlatform = createRandomBool(20);
            var newPiece = ".";

            if (hasPlatform) {
                newPiece = "P";
            }

            this.map[xAxisPos][i] = newPiece;
        }
    }
}

function createRandom(n) {
    return Math.floor((Math.random() * n) + 1);
}

function createRandomBool(n) {
    var r = createRandom(n);
    return r === 1;
}