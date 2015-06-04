var effects = [];

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function Effect(frame, n, s, l) {
    var frames = [];
    for (var id = s; id < s + l; id++)
        frames.push(PIXI.Texture.fromFrame(frame + pad(id, 4) + '.png'));

    CustomAnimation.call(this, frames);

    effects.push(this);
}

Effect.prototype = Object.create(CustomAnimation.prototype);
Effect.prototype.constructor = Effect;
