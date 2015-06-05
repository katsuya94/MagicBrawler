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

    this.loop = false;
    this.animationSpeed = 0.3;

    this.alpha = 0.8;

    this.overDepth = 2;

    this.play();

    effects.push(this);
    world.addChild(this);
}

Effect.prototype = Object.create(CustomAnimation.prototype);
Effect.prototype.constructor = Effect;

Effect.prototype.updatePosition = function(dt) {
    var pos = position(this.px - 1.5, this.py - 1.5, this.pz);
    this.x = pos.x;
    this.y = pos.y;
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
}

ChargeEffect.prototype = Object.create(Effect.prototype);
ChargeEffect.prototype.constructor = ChargeEffect;

ChargeEffect.prototype.updatePosition = function(dt) {
    this.px = player.px + Number.EPSILON;
    this.py = player.py + Number.EPSILON;
    this.pz = player.pz - 0.7;
    this.pxFloor = Math.floor(this.px);
    this.pyFloor = Math.floor(this.py);
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
