function Actor(frame, x, y) {
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
        for (var j = 0; j < 4; j++) {
            animation.push(frames[i * 32 + 24 + j]);
        }
        for (var j = 0; j < 2; j++) {
            animation.push(frames[i * 32 + 24 + 3]);
        }
        for (var j = 4 - 1; j >= 0; j--) {
            animation.push(frames[i * 32 + 24 + j]);
        }
        animations.push(animation);

        animation = [];
        for (var j = 0; j < 4; j++) {
            animation.push(frames[i * 32 + 28 + j]);
        }
        animations.push(animation);
    }

    CustomAnimation.call(this, animations);

    this.defaultTint = 0xFFFFFF;

    this.animationSpeed = 0.2;

    this.direction = Math.floor(8 * Math.random());

    this.moving = false;
    this.movingAnimation = false;

    this.attacking = false;
    this.attackingAnimation = false;

    this.casting = false;
    this.castingAnimation = false;

    this.dying = false;
    this.timeDead = 0;

    this.px = x;
    this.pxFloor = Math.floor(x);
    this.py = y;
    this.pyFloor = Math.floor(y);
    this.pzMin = heightAt(this.px, this.py, this.pxFloor, this.pyFloor);
    this.pz = this.pzMin;
    this.vz = 0;

    this.health = 100;
    this.maxHealth = this.health;

    this.invulnerable = false;

    this.attackCooldown = 400;
    this.damage = 10;

    this.newTile = false;

    this.play();
    this.movementUpdate();

    this.overDepth = 1;
}

Actor.prototype = Object.create(CustomAnimation.prototype);
Actor.prototype.constructor = Actor;

Actor.prototype.movementUpdate = function() {
    if (this.dying) {
        this.playAnimation(6 * this.direction + 3, 0);
    } else if (this.attacking) {
        this.movingAnimation = false;
        this.castingAnimation = false;
        if (this.attackingAnimation)
            this.playAnimation(6 * this.direction + 2);
        else
            this.playAnimation(6 * this.direction + 2, 0);
        player.attackingAnimation = true;
    } else if (this.casting) {
        this.movingAnimation = false;
        this.attackingAnimation = false;
        if (this.castingAnimation)
            this.playAnimation(6 * this.direction + 4);
        else
            this.playAnimation(6 * this.direction + 4, 0);
    } else if (this.moving) {
        this.attackingAnimation = false;
        this.castingAnimation = false;
        if (this.movingAnimation)
            this.playAnimation(6 * this.direction + 1);
        else
            this.playAnimation(6 * this.direction + 1, 0);
        this.movingAnimation = true;
    } else {
        this.movingAnimation = false;
        this.attackingAnimation = false;
        this.castingAnimation = false;
        this.playAnimation(6 * this.direction, 0);
    }
};

Actor.prototype.attack = function() {
    if (!this.dying && !this.attacking && !this.casting) {
        this.attacking = true;
        this.attackTime = this.attackCooldown;
        var damage = this.damage;
        new HitArc({delay: 200, ttl: 400, damage: damage}, this.px, this.py, this.pz + 0.25, 0.25, 1.5, this.direction, Math.PI / 2, 1.5);
        this.loop = false;
        this.movementUpdate();
    }
};

Actor.prototype.hurt = function(damage) {
    if (!this.invulnerable) {
        this.invulnerable = true;
        this.invulnerableTime = 200;
        this.tint = (this.hurtColor ? this.hurtColor : 0xFF0000);
        this.tintTime = 200;
        this.health -= damage;
        if (this.health <= 0) {
            this.fadeTime = 5000;
            this.dying = true;
            this.loop = false;
            score += this.points;
            this.movementUpdate();
        }
    }
};

Actor.prototype.updatePosition = function(dt) {
    this.newTile = false;

    if (!this.dying) {
        if (!this.attacking && this.moving) {
            /* Calculate proposed position */

            var _px = this.px + dt * (this.animationSpeed / 0.2) * dx[this.direction] / 250;
            var _py = this.py + dt * (this.animationSpeed / 0.2) * dy[this.direction] / 250;
            var _pxFloor = Math.floor(_px);
            var _pyFloor = Math.floor(_py);

            /* Correct if prevented by terrain */

            var xPass;
            var yPass;
            var xyPass;

            switch (this.direction) {
            case 0:
                xPass = pass8Ref(this.pxFloor, this.pyFloor)[7];
                yPass = pass8Ref(this.pxFloor, this.pyFloor)[1];
                xyPass = pass8Ref(this.pxFloor, this.pyFloor)[0];
                if (_px < this.pxFloor + 0.2 && !xPass)
                    _px = this.pxFloor + 0.2;
                if (_py > this.pyFloor + 0.8 && !yPass)
                    _py = this.pyFloor + 0.8;
                if (_px < this.pxFloor + 0.2 && _py > this.pyFloor + 0.8 && !xyPass) {
                    _px = this.pxFloor + 0.2;
                    _py = this.pyFloor + 0.8;
                }
                break;
            case 1:
                yPass = pass8Ref(this.pxFloor, this.pyFloor)[1];
                if (_py > this.pyFloor + 0.8 && !yPass)
                    _py = this.pyFloor + 0.8;
                break;
            case 2:
                xPass = pass8Ref(this.pxFloor, this.pyFloor)[3];
                yPass = pass8Ref(this.pxFloor, this.pyFloor)[1];
                xyPass = pass8Ref(this.pxFloor, this.pyFloor)[2];
                if (_px > this.pxFloor + 0.8 && !xPass)
                    _px = this.pxFloor + 0.8;
                if (_py > this.pyFloor + 0.8 && !yPass)
                    _py = this.pyFloor + 0.8;
                if (_px > this.pxFloor + 0.8 && _py > this.pyFloor + 0.8 && !xyPass) {
                    _px = this.pxFloor + 0.8;
                    _py = this.pyFloor + 0.8;
                }
                break;
            case 3:
                xPass = pass8Ref(this.pxFloor, this.pyFloor)[3];
                if (_px > this.pxFloor + 0.8 && !xPass)
                    _px = this.pxFloor + 0.8;
                break;
            case 4:
                xPass = pass8Ref(this.pxFloor, this.pyFloor)[3];
                yPass = pass8Ref(this.pxFloor, this.pyFloor)[5];
                xyPass = pass8Ref(this.pxFloor, this.pyFloor)[4];
                if (_px > this.pxFloor + 0.8 && !xPass)
                    _px = this.pxFloor + 0.8;
                if (_py < this.pyFloor + 0.2 && !yPass)
                    _py = this.pyFloor + 0.2;
                if (_px > this.pxFloor + 0.8 && _py < this.pyFloor + 0.2 && !xyPass) {
                    _px = this.pxFloor + 0.8;
                    _py = this.pyFloor + 0.2;
                }
                break;
            case 5:
                yPass = pass8Ref(this.pxFloor, this.pyFloor)[5];
                if (_py < this.pyFloor + 0.2 && !yPass)
                    _py = this.pyFloor + 0.2;
                break;
            case 6:
                xPass = pass8Ref(this.pxFloor, this.pyFloor)[7];
                yPass = pass8Ref(this.pxFloor, this.pyFloor)[5];
                xyPass = pass8Ref(this.pxFloor, this.pyFloor)[6];
                if (_px < this.pxFloor + 0.2 && !xPass)
                    _px = this.pxFloor + 0.2;
                if (_py < this.pyFloor + 0.2 && !yPass)
                    _py = this.pyFloor + 0.2;
                if (_px < this.pxFloor + 0.2 && _py < this.pyFloor + 0.2 && !xyPass) {
                    _px = this.pxFloor + 0.2;
                    _py = this.pyFloor + 0.2;
                }
                break;
            case 7:
                xPass = pass8Ref(this.pxFloor, this.pyFloor)[7];
                if (_px < this.pxFloor + 0.2 && !xPass)
                    _px = this.pxFloor + 0.2;
                break;
            }

            /* Update */

            this.px = Math.min(this.px + 0.5, Math.max(this.px - 0.5, _px));
            this.py = Math.min(this.py + 0.5, Math.max(this.py - 0.5, _py));
            var pxFloor = Math.floor(this.px);
            var pyFloor = Math.floor(this.py);
            if (this.pxFloor !== pxFloor || this.pyFloor !== pyFloor) {
                this.newTile = true;
                this.pxFloor = pxFloor;
                this.pyFloor = pyFloor;
            }
            this.pzMin = heightAt(this.px, this.py, this.pxFloor, this.pyFloor);
        }

        if (this.attacking) {
            this.attackTime -= dt;
            if (this.attackTime <= 0) {
                this.attacking = false;
                this.loop = true;
                this.movementUpdate();
            }
        }

        if (this.casting) {
            this.castTime -= dt;
            if (this.castTime <= 0) {
                this.casting = false;
                this.loop = true;
                this.movementUpdate();
            }
        }

        if (this.invulnerable) {
            this.invulnerableTime -= dt;
            if (this.invulnerableTime <= 0)
                this.invulnerable = false;
        }
    }

    if (this.tint !== 0xFFFFFF) {
        this.tintTime -= dt;
        if (this.tintTime <= 0)
            this.tint = this.defaultTint;
    }

    /* Gravity */

    this.vz -= dt / 10000;
    this.pz += dt * this.vz;
    if (this.pz < this.pzMin) {
        this.pz = this.pzMin;
        this.vz = 0;
    }

    /* Screen Position */

    var pos = position(this.px - 1.5, this.py - 1.5, this.pz);
    this.x = pos.x - 64;
    this.y = pos.y - 112;
};

Actor.prototype.face = function(x, y){
    var angle = (Math.atan2(y - this.py, x - this.px) + 2 * Math.PI) % (2 * Math.PI);

    if (angle < 1 * Math.PI / 8 || angle >= 15 * Math.PI / 8)
        this.direction = 3;
    else if (angle >= 1 * Math.PI / 8 && angle < 3 * Math.PI / 8)
        this.direction = 2;
    else if (angle >= 3 * Math.PI / 8 && angle < 5 * Math.PI / 8)
        this.direction = 1;
    else if (angle >= 5 * Math.PI / 8 && angle < 7 * Math.PI / 8)
        this.direction = 0;
    else if (angle >= 7 * Math.PI / 8 && angle < 9 * Math.PI / 8)
        this.direction = 7;
    else if (angle >= 9 * Math.PI / 8 && angle < 11 * Math.PI / 8)
        this.direction = 6;
    else if (angle >= 11 * Math.PI / 8 && angle < 13 * Math.PI / 8)
        this.direction = 5;
    else if (angle >= 13 * Math.PI / 8 && angle < 15 * Math.PI / 8)
        this.direction = 4;
    this.movementUpdate();
};

Actor.prototype.think = function(dt) {
    throw new Error('Not Implemented');
};

Actor.prototype.distance = function(actor) {
    var x = actor.px - this.px;
    var y = actor.py - this.py;
    return Math.sqrt(x * x + y * y);
};
