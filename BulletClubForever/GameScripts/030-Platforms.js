Platforms = function (game, levelMap) {
    /// <param name="game" type="Phaser.Game"></param>
    /// <param name="levelMap" type="LevelMap"></param>
    this.game = game;
    this.levelMap = levelMap;
    this.group = null;
};

Platforms.prototype.preload = function () {
    this.game.load.image('platform', 'Sprites/platform.png');
};

Platforms.prototype.create = function () {
    this.group = this.game.add.group();
    this.group.enableBody = true;

    // for each tile on the level map, if it's a platform, create the sprites
    for (var i = 0; i < this.levelMap.y; i++) {
        for (var j = 0; j < this.levelMap.x; j++) {
            var currentTile = this.levelMap.map[j][i];
            if (currentTile === "P" || currentTile === "G") {
                // draw the mud
                var newPlatform = this.group.create(j * spriteWidth, i * spriteHeight, 'platform');
                newPlatform.body.immovable = true;
                newPlatform.body.checkCollision = { up: true, down: false, left: false, right: false };
            }
        }
    }
};

Platforms.prototype.update = function (player) {
    /// <param name="player" type="Player"></param>

    var platformsXSpeed = null;

    if (player.scrollingBackgroundTrigger == true) {
        platformsXSpeed = player.playerXSpeed * -1;
    }
    else {
        platformsXSpeed = 0;
    }

    this.group.forEach(function (child) {
        child.body.velocity.x = (platformsXSpeed);
    });
};