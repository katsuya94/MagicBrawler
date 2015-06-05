var effects = [];

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function Effect(frame, n, s, l, rewind) {
    var frames = [];
    for (var id = s; id < s + l; id++)
        frames.push(PIXI.Texture.fromFrame(frame + pad(id, 4) + '.png'));
    if (rewind)
        for (var id = s + l - 1; id >= s; id--)
            frames.push(PIXI.Texture.fromFrame(frame + pad(id, 4) + '.png'));

    CustomAnimation.call(this, [frames]);

    this.loop = false;
    this.animationSpeed = 0.1;

    this.permNumBehind = 0;
    this.permAhead = [];

    effects.push(this);
}

Effect.prototype = Object.create(CustomAnimation.prototype);
Effect.prototype.constructor = Effect;
