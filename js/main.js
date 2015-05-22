function keyListener(keyCode) {
    this.code = keyCode;
    this.isDown = false;
    this.press = undefined;
    this.release = undefined;
    window.addEventListener("keydown", this.downHandler.bind(this), false);
    window.addEventListener("keyup", this.upHandler.bind(this), false);
}

keyListener.prototype.downHandler = function(event) {
    if (event.keyCode === this.code) {
        if (!this.isDown) {
            this.isDown = true;
            if (this.press) this.press();
        }
    }
    event.preventDefault();
};

keyListener.prototype.upHandler = function(event) {
    if (event.keyCode === this.code) {
        if (this.isDown) {
            this.isDown = false;
            if (this.release) this.release();
        }
    }
    event.preventDefault();
};

function CustomAnimation(animations) {
    PIXI.extras.MovieClip.call(this, animations[0]);
    this._animations = animations;
}

CustomAnimation.prototype = Object.create(PIXI.extras.MovieClip.prototype);
CustomAnimation.prototype.constructor = CustomAnimation;

CustomAnimation.prototype.playAnimation = function(id, frameNumber) {
    this._textures = this._animations[id];
    if (frameNumber !== undefined) {
        this.gotoAndPlay(frameNumber);
    }
}

var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var ticker = PIXI.ticker.shared;

var stage = new PIXI.Container();
var player;

PIXI.loader.add('./img/player.json').add('./img/terrain.json').load(onAssetsLoaded);

function onAssetsLoaded() {
    var bg = new PIXI.Container();
    var tile;
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 - 32;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 - 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 - 32;
    tile.y = 300 - 32 - 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 64;
    tile.y = 300 - 32 + 0;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 + 0;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 - 64;
    tile.y = 300 - 32 + 0;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 + 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 - 32;
    tile.y = 300 - 32 + 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 + 32;
    bg.addChild(tile);
    stage.addChild(bg);

    var frames = [];
    for (var id = 0; id < 256; id++)
        frames.push(PIXI.Texture.fromFrame('player' + id + '.png'));
    var animations = [];
    for (var i = 0; i < 8; i++) {
        var animation;

        animation = [];
        for (var j = 0; j < 4; j++) {
            animation.push(frames[i * 32 + 0 + j]);
        }
        for (var j = 0; j < 4; j++) {
            animation.push(frames[i * 32 + 0 + (3 - j)]);
        }
        animations.push(animation);

        animation = [];
        for (var j = 0; j < 8; j++) {
            animation.push(frames[i * 32 + 4 + j]);
        }
        animations.push(animation);

        animation = [];
        for (var j = 0; j < 4; j++) {
            animation.push(frames[i * 32 + 12 + j]);
        }
        animations.push(animation);

        animation = [];
        for (var j = 0; j < 8; j++) {
            animation.push(frames[i * 32 + 16 + j]);
        }
        animations.push(animation);

        animation = [];
        for (var j = 0; j < 8; j++) {
            animation.push(frames[i * 32 + 24 + j]);
        }
        animations.push(animation);
    }

    player = new CustomAnimation(animations);
    player.play();

    player.animationSpeed = 0.2;

    player.direction = 0;
    player.moving = false;
    player.movingAnimation = false;
    player.attacking = false;
    player.attackingAnimation = false;

    player.px = 0;
    player.py = 0;

    var klLeft = new keyListener(37);
    var klUp = new keyListener(38);
    var klRight = new keyListener(39);
    var klDown = new keyListener(40);

    var klX = new keyListener(88);

    function movementUpdate() {
        var x = 0;
        var y = 0;

        if (klLeft.isDown) x -= 1;
        if (klUp.isDown) y += 1;
        if (klRight.isDown) x += 1;
        if (klDown.isDown) y -= 1;

        if (x === -1) {
            if (y === -1) {
                player.direction = 7;
            } else if (y === 0) {
                player.direction = 0;
            } else if (y === 1) {
                player.direction = 1;
            }
        } else if (x === 0) {
            if (y === -1) {
                player.direction = 6;
            }else if (y === 1) {
                player.direction = 2;
            }
        } else if (x === 1) {
            if (y === -1) {
                player.direction = 5;
            } else if (y === 0) {
                player.direction = 4;
            } else if (y === 1) {
                player.direction = 3;          
            }
        }

        player.moving = !(x === 0 && y === 0);

        if (player.attacking) {
            player.movingAnimation = false;
            if (player.attackingAnimation)
                player.playAnimation(5 * player.direction + 2);
            else
                player.playAnimation(5 * player.direction + 2, 0);
            player.attackingAnimation = true;
        } else if (player.moving) {
            player.attackingAnimation = false;
            if (player.movingAnimation)
                player.playAnimation(5 * player.direction + 1);
            else
                player.playAnimation(5 * player.direction + 1, 0);
            player.movingAnimation = true;
        } else {
            player.movingAnimation = false;
            player.attackingAnimation = false;
            player.playAnimation(5 * player.direction, 0);
        }
    }

    player.movementFlag = false;

    function scheduleMovementUpdate() {
        ticker.addOnce(movementUpdate);
    }

    klLeft.press = movementUpdate;
    klLeft.release = scheduleMovementUpdate;
    klUp.press = movementUpdate;
    klUp.release = scheduleMovementUpdate;
    klRight.press = movementUpdate;
    klRight.release = scheduleMovementUpdate;
    klDown.press = movementUpdate;
    klDown.release = scheduleMovementUpdate;

    function attack() {
        if (!player.attacking) {
            player.attacking = true;
            player.loop = false;
            movementUpdate();
            window.setTimeout(function() {
                player.attacking = false;
                player.loop = true;
                movementUpdate();
            }, 350);
        }
    }

    klX.press = attack;

    stage.addChild(player);

    invsqrt2 = 1 / Math.sqrt(2);

    var dx = [-invsqrt2, 0, invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1];
    var dy = [invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1, -invsqrt2, 0];

    ticker.add(function () {
        var dt = ticker.elapsedMS;

        if (!player.attacking && player.moving) {
            player.px += dt * dx[player.direction] / 750;
            player.py += dt * dy[player.direction] / 750;
            player.x = player.px * 64 + player.py * -64 + 400 - 64;
            player.y = player.px * -32 + player.py * -32 + 300 - 112;
        }

        renderer.render(stage);
    });
}
