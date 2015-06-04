var hitboxes = [];

function Hitbox(attack) {
    this.delay = attack.delay;
    this.ttl = attack.ttl;
    this.damage = attack.damage;
    hitboxes.push(this);
}

Hitbox.prototype = Object.create(Object.prototype);
Hitbox.prototype.constructor = Hitbox;

Hitbox.prototype.hit = function(actor) {
    if (this.delay <= 0 && this.collide(actor))
        actor.hurt(this.damage);
};

Hitbox.prototype.collide = function(actor) {
    throw new Error('Not Implemented');
};

Hitbox.prototype.update = function(dt) {
    this.delay -= dt;
    this.ttl -= dt;
    return this.ttl > 0;
};

function HitArc(attack, x, y, z, minR, maxR, direction, angle, height) {
    Hitbox.call(this, attack);
    this.x = x;
    this.y = y;
    this.minZ = z - height / 2;
    this.maxZ = z + height / 2;
    this.minR = minR;
    this.maxR = maxR;
    this.minAngle = (da[direction] - angle / 2 + 2 * Math.PI) % (2 * Math.PI);
    this.maxAngle = (da[direction] + angle / 2 + 2 * Math.PI) % (2 * Math.PI);
    this.switched = this.minAngle > this.maxAngle;
}

HitArc.prototype = Object.create(Hitbox.prototype);
HitArc.prototype.constructor = HitArc;

HitArc.prototype.collide = function(actor) {
    var x = actor.px - this.x;
    var y = actor.py - this.y;
    var angle = (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
    var angleCollide;
    if (switched)
        angleCollide = this.minAngle < angle || angle < this.maxAngle;
    else
        angleCollide = this.minAngle < angle && angle < this.maxAngle;
    if (angleCollide) {
        var r = Math.sqrt(x * x + y * y);
        if (this.minR < r && r < this.maxR) {
            if (this.minZ < actor.pz && actor.pz < this.maxZ)
                actor.hurt(this.damage);
        }
    }
};
