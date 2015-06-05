var effects = [];

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function Effect(frame, specs, x, y, z) {
    var animations = [];
    for (var i = 0; i < specs.length; i++) {
        var spec = specs[i];
        var frames = [];
        if (Object.prototype.toString.call(spec) === '[object Array]') {
            for (var j = 0; j < spec.length; j++) {
                frames.push(PIXI.Texture.fromFrame(frame + pad(spec[j], 4) + '.png'))
            }
        } else {
            if (spec.first < spec.last) {
                for (var id = spec.first; id <= spec.last; id++)
                    frames.push(PIXI.Texture.fromFrame(frame + pad(id, 4) + '.png'));
            } else {
                for (var id = spec.first; id >= spec.last; id--)
                    frames.push(PIXI.Texture.fromFrame(frame + pad(id, 4) + '.png'));
            }
        }
        animations.push(frames);
    }

    CustomAnimation.call(this, animations);

    this.px = x;
    this.py = y;
    this.pz = z;

    this.pxFloor = Math.floor(this.px);
    this.pyFloor = Math.floor(this.py);

    this.offset = new PIXI.Point(0, 0);

    this.loop = false;
    this.animationSpeed = 0.3;

    this.alpha = 0.8;

    this.overDepth = 2;

    this.play();

    this.filters = [new PIXI.filters.ColorMatrixFilter()];

    effects.push(this);
    world.addChild(this);
}

Effect.prototype = Object.create(CustomAnimation.prototype);
Effect.prototype.constructor = Effect;

Effect.prototype.filter = function(filter) {
    this.filters[0].hue(filter.hue);
    this.filters[0].saturate(filter.sat, true);
};

Effect.prototype.updatePosition = function(dt) {
    var pos = position(this.px - 1.5, this.py - 1.5, this.pz);
    this.x = pos.x - 64 + this.offset.x;
    this.y = pos.y - 112 + this.offset.y;
};

Effect.prototype.checkRemove = function() {
    return this.playing;
};

Effect.prototype.remove = function(i) {
    i = i || effects.indexOf(this);
    effects.splice(i, 1);
    world.removeChild(this);
};

function ChargeEffect() {
    Effect.call(this, 'ring', [{first: 1, last: 16}, [15, 14, 15, 16], {first: 16, last: 1}], 0, 0, 0);
    this.offset.y = 20;
}

ChargeEffect.prototype = Object.create(Effect.prototype);
ChargeEffect.prototype.constructor = ChargeEffect;

ChargeEffect.prototype.updatePosition = function(dt) {
    this.px = player.px + Number.EPSILON;
    this.py = player.py + Number.EPSILON;
    this.pxFloor = Math.floor(this.px);
    this.pyFloor = Math.floor(this.py);
    this.pz = player.pz;
    Effect.prototype.updatePosition.call(this, dt);
    if (!this.playing) {
        if (player.charging) {
            this.loop = true;
            this.playAnimation(1, 0);
        }
        player.swapPenalty = false;
    }
};

ChargeEffect.prototype.checkRemove = function() {
    return true;
};

function Bullet(frame, spec, x, y, z, vx, vy, attack) {
    Effect.call(this, frame, [spec], x, y, z);
    this.vx = vx;
    this.vy = vy;
    this.attack = attack;
}

Bullet.prototype = Object.create(Effect.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.updatePosition = function(dt) {
    this.px += this.vx * dt / 250;
    this.py += this.vy * dt / 250;
    this.pxFloor = Math.floor(this.px);
    this.pyFloor = Math.floor(this.py);
    new HitCylinder(this.attack, this.px, this.py, this.pz, 0.75, 2.0);
    Effect.prototype.updatePosition.call(this, dt);
};

function Missile(mFrame, mSpec, eFrame, eSpec, x, y, z, vx, vy, radius, mAttack, eAttack) {
    Bullet.call(this, mFrame, mSpec, x, y, z, vx, vy, mAttack);
    var scale = radius / 0.75;

    var self = this;
    function explode() {
        self.hit = true;
        var explosion = new Effect(eFrame, [eSpec], self.px, self.py, self.pz)
        explosion.scale.x = scale;
        explosion.scale.y = scale;
        explosion.offset.x = 128 * (1 - scale) / 2;
        explosion.offset.y = 128 * (1 - scale) * 0.75;
        new HitCylinder(eAttack, self.px, self.py, self.pz, radius, 2.0);
    }
    this.attack.callback = explode;

    this.hit = false;
}

Missile.prototype = Object.create(Bullet.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.checkRemove = function() {
    return this.playing && !this.hit;
};

function Orb(type) {
    PIXI.Graphics.call(this);

    effects.push(this);
    world.addChild(this);

    var color = elementColors[type];
    this.moveTo(0, 0);
    this.beginFill(color.diffuse, 1);
    this.lineStyle(1, color.highlight, 1);
    this.drawCircle(0, 0, 3);

    this.alpha = 0.8;

    this.overDepth = 0;

    this.live = true;
    this.type = type;

    this.angle = 2 * Math.PI * Math.random();
    this.offset = 2 * Math.PI * Math.random();

    this.angleFrequency = 0.5 + Math.random();
    this.offsetFrequency = 0.5 + Math.random();

    this.radius = 0.5;

    this.flip = Math.random() < 0.5;
}

Orb.prototype = Object.create(PIXI.Graphics.prototype);
Orb.prototype.constructor = Orb;

Orb.prototype.remove = Effect.prototype.remove;

Orb.prototype.checkRemove = function() {
    return this.radius > 0;
};

Orb.prototype.updatePosition = function(dt) {
    if (!this.live) {
        this.radius -= dt / 500;
    }

    this.angle = (this.angle + this.angleFrequency * dt / 750) % (2 * Math.PI);
    this.offset = (this.offset + this.offsetFrequency * dt / 750) % (2 * Math.PI);

    var angle;
    if (this.flip)
        angle = -this.angle;
    else
        angle = this.angle;

    this.px = player.px + this.radius * Math.cos(angle) + (0.5 - this.radius);
    this.py = player.py + this.radius * Math.sin(angle) + (0.5 - this.radius);
    this.pxFloor = Math.floor(this.px);
    this.pyFloor = Math.floor(this.py);
    this.pz = player.pz + 0.5 + Math.sin(this.offset) / 4 - (0.5 - this.radius);

    var pos = position(this.px, this.py, this.pz);
    this.x = pos.x;
    this.y = pos.y + 16;
};
