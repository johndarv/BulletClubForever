LevelMap = function (game) {
    this.game = game;
    this.map = [];
    this.x = 100;
    this.y = 20;
}

LevelMap.prototype = {
    init: function () {
        for (var i = 0; i < this.y; i++) {
            // First, create the array within the array
            this.map[i] = [];

            for (var j = 0; j < this.x; j++) {
                this.map[i][j] = ".";
            }
        }
    }
}