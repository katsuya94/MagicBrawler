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

var klLeft = new keyListener(37);
var klUp = new keyListener(38);
var klRight = new keyListener(39);
var klDown = new keyListener(40);
var klX = new keyListener(88);

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

function Player() {
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

    CustomAnimation.call(this, animations);

    this.animationSpeed = 0.2;

    this.direction = 0;

    this.moving = false;
    this.movingAnimation = false;

    this.attacking = false;
    this.attackingAnimation = false;

    this.px = 0.5;
    this.pxFloor = 0;
    this.py = 0.5;
    this.pyFloor = 0;
    this.pz = 0;
    this.pzMin = 0

    var _this = this;

    var movementUpdateScheduler = scheduler(function() {_this.movementUpdate.call(_this);});

    klLeft.press = movementUpdateScheduler;
    klLeft.release = movementUpdateScheduler;
    klUp.press = movementUpdateScheduler;
    klUp.release = movementUpdateScheduler;
    klRight.press = movementUpdateScheduler;
    klRight.release = movementUpdateScheduler;
    klDown.press = movementUpdateScheduler;
    klDown.release = movementUpdateScheduler;

    var attackScheduler = scheduler(function() {_this.attack.call(_this);});

    klX.press = attackScheduler;
}

Player.prototype = Object.create(CustomAnimation.prototype);
Player.prototype.constructor = Player;

Player.prototype.movementUpdate = function() {
    var x = 0;
    var y = 0;

    if (klLeft.isDown) x -= 1;
    if (klUp.isDown) y += 1;
    if (klRight.isDown) x += 1;
    if (klDown.isDown) y -= 1;

    if (x === -1) {
        if (y === -1) {
            this.direction = 7;
        } else if (y === 0) {
            this.direction = 0;
        } else if (y === 1) {
            this.direction = 1;
        }
    } else if (x === 0) {
        if (y === -1) {
            this.direction = 6;
        }else if (y === 1) {
            player.direction = 2;
        }
    } else if (x === 1) {
        if (y === -1) {
            this.direction = 5;
        } else if (y === 0) {
            this.direction = 4;
        } else if (y === 1) {
            this.direction = 3;          
        }
    }

    this.moving = !(x === 0 && y === 0);

    if (this.attacking) {
        this.movingAnimation = false;
        if (this.attackingAnimation)
            this.playAnimation(5 * this.direction + 2);
        else
            this.playAnimation(5 * this.direction + 2, 0);
        player.attackingAnimation = true;
    } else if (this.moving) {
        this.attackingAnimation = false;
        if (this.movingAnimation)
            this.playAnimation(5 * this.direction + 1);
        else
            this.playAnimation(5 * this.direction + 1, 0);
        this.movingAnimation = true;
    } else {
        this.movingAnimation = false;
        this.attackingAnimation = false;
        this.playAnimation(5 * this.direction, 0);
    }
}

Player.prototype.attack = function() {
    if (!this.attacking) {
        this.attacking = true;
        this.loop = false;
        var _this = this;
        scheduler(function() {_this.movementUpdate.call(_this);})();
        tickFor(function() {_this.endAttack.call(_this);}, 20);
    }
}

Player.prototype.endAttack = function() {
    this.attacking = false;
    this.loop = true;
    var _this = this;
    scheduler(function() {_this.movementUpdate.call(_this);})();
}

invsqrt2 = 1 / Math.sqrt(2);

var dx = [-invsqrt2, 0, invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1];
var dy = [invsqrt2, 1, invsqrt2, 0, -invsqrt2, -1, -invsqrt2, 0];

var heightMap = [[0, 0, 0],
                 [0, 0, 0],
                 [0, 0, 1]];
var rampMap = [[-1, -1, -1],
               [-1, -1,  1],
               [-1, -1, -1]];

function heightRef(x, y) {
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
        return 0;
    else
        return heightMap[y][x];
}

function rampRef(x, y) {
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
        return undefined;
    else
        return rampMap[y][x];
}

function heightAt(x, y, floorX, floorY) {
    var height = heightRef(floorX, floorY);
    var ramp = rampRef(floorX, floorY);
    if (ramp < 0) {
        return height;
    } else {
        switch (ramp) {
            case 0: return height + (x - floorX);
            case 1: return height + (y - floorY);
            case 2: return height + (1 - x + floorX);
            case 3: return height + (1 - y + floorY);
            default: return height;
        }
    }
}

var passMap = [[null, null, null],
               [null, null, null],
               [null, null, null]];

function passRef(x, y) {
    if (x < 0 || x >= 3 || y < 0 || y >= 3)
        return undefined;
    else
        return passMap[y][x];
}

for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
        var height = heightRef(i, j);
        var ramp = rampRef(i, j);
        var pass = [null, null, null, null];
        var r;
        var h;

        r = rampRef(i + 1, j);
        h = heightRef(i + 1, j);
        pass[0] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 0 && h === height) ||
                   (ramp === 0 && h - 1 === height));

        r = rampRef(i, j + 1);
        h = heightRef(i, j + 1);
        pass[1] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 1 && h === height) ||
                   (ramp === 1 && h - 1 === height));

        r = rampRef(i - 1, j);
        h = heightRef(i - 1, j);
        pass[2] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 2 && h === height) ||
                   (ramp === 2 && h - 1 === height));

        r = rampRef(i, j - 1);
        h = heightRef(i, j - 1);
        pass[3] = (r !== undefined) &&
                  ((h < height) ||
                   (r < 0 && h === height) ||
                   (r === 3 && h === height) ||
                   (ramp === 3 && h - 1 === height));
        
        passMap[j][i] = pass;
    }
}

console.log(passMap);

Player.prototype.updatePosition = function(dt) {
    if (!this.attacking && this.moving) {
        var _px = this.px + dt * dx[this.direction] / 250;
        var _py = this.py + dt * dy[this.direction] / 250;
        var _pxFloor = Math.floor(_px);
        var _pyFloor = Math.floor(_py);
        if (_px > this.pxFloor + 0.8) {
            if (!passRef(this.pxFloor, this.pyFloor)[0])
                _px = this.pxFloor + 0.8;
        } else if (_px < this.pxFloor + 0.2) {
            if (!passRef(this.pxFloor, this.pyFloor)[2])
                _px = this.pxFloor + 0.2;
        }
        if (_py > this.pyFloor + 0.8) {
            if (!passRef(this.pxFloor, this.pyFloor)[1])
                _py = this.pyFloor + 0.8;
        } else if (_py < this.pyFloor + 0.2) {
            if (!passRef(this.pxFloor, this.pyFloor)[3])
                _py = this.pyFloor + 0.2;
        }
        this.px = _px;
        this.py = _py;
        this.pxFloor = Math.floor(this.px);
        this.pyFloor = Math.floor(this.py);
        this.pzMin = heightAt(this.px, this.py, this.pxFloor, this.pyFloor);
    }
    this.pz -= dt / 100;
    this.pz = Math.max(this.pzMin, this.pz);
    this.x = (this.px - 1.5) * 32 + (this.py - 1.5) * -32 + 400 - 64;
    this.y = (this.px - 1.5) * -16 + (this.py - 1.5) * -16 + this.pz * -32 + 300 - 112;
}

var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var ticker = PIXI.ticker.shared;

function tickFor(callback, n) {
    if (n === 0) {
        ticker.addOnce(callback);
    } else {
        ticker.addOnce(function() {
            tickFor(callback, n - 1);
        });
    }
}

function scheduler(callback) {
    return function() {
        ticker.addOnce(callback);
    }
}

var stage = new PIXI.Container();
var bg;
var player;
var debug;

PIXI.loader.add('./img/player.json').add('./img/terrain.json').load(onAssetsLoaded);

function onAssetsLoaded() {
    bg = new PIXI.Container();
    var tile;
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 - 32;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 - 32 - 32;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 - 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain46.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 - 16 - 32;
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

    player = new Player();
    player.play();
    stage.addChild(player);

    debug = new PIXI.Text('');
    stage.addChild(debug);

    window.setInterval(function() {
        debug.text = 'FPS = ' + ticker.FPS.toFixed(0) + '; p = (' + player.px.toFixed(2) + ', ' + player.py.toFixed(2) + ', ' + player.pz.toFixed(2) + ')';
    }, 1000);

    ticker.add(function () {
        var dt = ticker.elapsedMS;
        player.updatePosition(dt);
        renderer.render(stage);
    });
}
