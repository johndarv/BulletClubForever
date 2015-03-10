Platforms = function (game, levelMap) {
    /// <param name="game" type="Phaser.Game"></param>
    /// <param name="levelMap" type="LevelMap"></param>
    this.game = game;
    this.levelMap = levelMap;
    this.group = null;

    this.scrollingTracker = 0;
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
                // create the platforms
                var newPlatform = this.group.create(j * spriteWidth, i * spriteHeight, 'platform');
                newPlatform.body.immovable = true;
                newPlatform.body.checkCollision = { up: true, down: false, left: false, right: false };
            }
        }
    }
};

Platforms.prototype.update = function () {
    // TODO: Here we need to destroy platforms that have gone too far off the left of the screen
    // and create new platforms according to looping the array. So:
    // * If offset of platforms has reached multiple of 25:
    //   * Destroy the sprites that correspond to the first column of the level map
    //   * Replace the first column of the level map with a new column
    //   * Create sprites for this new column but positioned at the far right of all the other platform sprites (using clever maths)

    if (this.scrollingTracker > 25) {
        // then we've scrolled a whole 1 platform, so can delete the platforms that can never be reached again
        this.group.forEach(function (platform) {
            if (platform.world.x <= -25) {
                platform.kill();
            }
        });

        this.scrollingTracker -= 25;
    }
};