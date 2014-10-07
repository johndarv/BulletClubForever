Player = function (game) {
    /// <param name="game" type="Phaser.Game"></param>
    this.game = game;

    this.MAXSPEED = 150; // pixels per second
    this.ACCELLERATION = 300; // pixels per second per second
    this.JUMPSPEED = 400;
    this.GRAVITY = 1200;

    this.playerSprite = null;
    this.feet = null;

    this.keyboard = null;
    this.cursorKeys = null;

    this.jumpWasReleaseSinceLastPressed = false;
}

Player.prototype.preload = function () {
    this.game.load.image('player', 'Sprites/player.png');
    this.game.load.image('playerFeet', 'Sprites/player-feet.png');
}

Player.prototype.create = function () {
    this.feet = this.game.add.sprite(0, 440, 'playerFeet');
    this.playerSprite = this.game.add.sprite(-6, -22, 'player');
    this.feet.addChild(this.playerSprite);

    this.game.physics.arcade.enable(this.feet);
    this.feet.body.collideWorldBounds = true;

    this.feet.body.gravity.y = this.GRAVITY;
    this.feet.body.maxVelocity.setTo(this.MAXSPEED, this.JUMPSPEED);

    this.keyboard = this.game.input.keyboard;
    this.cursorKeys = this.keyboard.createCursorKeys();
}

Player.prototype.update = function (platforms) {
    /// <param name="platforms" type="Platforms"></param>

    var self = this;
    // Collisions section
    platforms.group.forEach(function (child) {
        if (self.feet.body.y < child.body.y + self.feet.body.height) {
            self.game.physics.arcade.collide(self.feet, child);
        }
    });

    //this.game.physics.arcade.collide(this.feet, platforms.group);

    // Movement Section
    if (this.cursorKeys.right.isDown) {
        this.feet.body.acceleration.x = this.ACCELLERATION;
    }
    else if (this.cursorKeys.left.isDown) {
        this.feet.body.acceleration.x = -this.ACCELLERATION;
    }
    else {
        this.feet.body.acceleration.x = 0;
        this.feet.body.velocity.x = 0;
    }

    // Jumping
    var onPlatform = this.feet.body.touching.down;

    if (onPlatform && this.jumpWasReleaseSinceLastPressed) {
        if (this.keyboard.isDown(Phaser.Keyboard.X)) {
            this.feet.body.velocity.y = -this.JUMPSPEED;
            this.jumpWasReleaseSinceLastPressed = false;
        }
    }

    if (!this.keyboard.isDown(Phaser.Keyboard.X)) {
        this.jumpWasReleaseSinceLastPressed = true;
    }
};