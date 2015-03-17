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