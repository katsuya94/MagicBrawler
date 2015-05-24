function Actor(frame) {
    var frames = [];
    for (var id = 0; id < 256; id++)
        frames.push(PIXI.Texture.fromFrame(frame + id + '.png'));

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
    this.pzMin = 0;

    this.depth = 1;
}

Actor.prototype = Object.create(CustomAnimation.prototype);
Actor.prototype.constructor = Actor;

Actor.prototype.movementUpdate = function() {
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

Actor.prototype.attack = function() {
    if (!this.attacking) {
        this.attacking = true;
        this.loop = false;
        var _this = this;
        scheduler(function() {_this.movementUpdate.call(_this);})();
        tickFor(function() {_this.endAttack.call(_this);}, 20);
    }
}

Actor.prototype.endAttack = function() {
    this.attacking = false;
    this.loop = true;
    var _this = this;
    scheduler(function() {_this.movementUpdate.call(_this);})();
}

Actor.prototype.updatePosition = function(dt) {
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
        this.depth = this.px + this.py;
    }
    this.pz -= dt / 200;
    this.pz = Math.max(this.pzMin, this.pz);
    this.x = (this.px - 1.5) * 32 + (this.py - 1.5) * -32 + 400 - 64;
    this.y = (this.px - 1.5) * -16 + (this.py - 1.5) * -16 + this.pz * -32 + 300 - 112;
}
