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