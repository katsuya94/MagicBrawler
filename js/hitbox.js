function HitBox(x, y, z, w, l, h, delay, ttl, damage) {
    this.xl = x - w / 2;
    this.yl = y - l / 2;
    this.zl = z - h / 2;
    this.xh = x + w / 2;
    this.yh = y + l / 2;
    this.zh = z + h / 2;
    this.delay = delay;
    this.ttl = ttl;
    this.damage = damage;
}

HitBox.prototype = Object.create(Object.prototype);
HitBox.prototype.constructor = HitBox;

HitBox.prototype.hit = function(actor) {
    var hit = (this.delay <= 0) &&
              (this.xl < actor.px) && (actor.px < this.xh) &&
              (this.yl < actor.py) && (actor.py < this.yh) &&
              (this.zl < actor.pz) && (actor.pz < this.zh);
    if (hit) actor.hurt(this.damage);
}

HitBox.prototype.update = function(dt) {
    this.delay -= dt;
    this.ttl -= dt;
    return this.ttl > 0
}

var hitboxes = [];
