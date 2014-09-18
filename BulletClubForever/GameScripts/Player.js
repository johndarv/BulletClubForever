Player = function (game) {
    /// <param name="game" type="Phaser.Game"></param>
    this.game = game;

    this.group = null;
    this.playerSprite = null;
    this.keyboard = null;
    this.cursorKeys = null
}

Player.prototype.preload = function () {
    this.game.load.image('player', 'Sprites/player.png');
}

Player.prototype.create = function () {
    this.group = this.game.add.group();
    this.playerSprite = this.group.create(0, 440, 'player');

    this.game.physics.arcade.enable(this.playerSprite);

    this.playerSprite.body.gravity.y = 300;
    this.playerSprite.body.collideWorldBounds = true;

    this.keyboard = this.game.input.keyboard;
    this.cursorKeys = this.keyboard.createCursorKeys();
}

Player.prototype.update = function () {
    this.playerSprite.body.velocity.x = 0;

    if (this.cursorKeys.right.isDown) {
        this.playerSprite.body.velocity.x = 150;
    }
    else if (this.cursorKeys.left.isDown) {
        this.playerSprite.body.velocity.x = -150;
    }

    if (this.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.playerSprite.body.velocity.y = -300;
    }
}