function HitBox(x, y, z, w, l, h, ttl) {
    this.xl = x - w / 2;
    this.yl = y - l / 2;
    this.zl = z - h / 2;
    this.xh = x + w / 2;
    this.yh = x + l / 2;
    this.zh = z + h / 2;
}

HitBox.prototype = Object.create(Object.prototype);
HitBox.prototype.constructor = HitBox;

HitBox.prototype.hit = function(actor) {
    var hit = (this.xl < actor.px) && (actor.px < this.xh) &&
              (this.yl < actor.py) && (actor.py < this.yh) &&
              (this.zl < actor.pz) && (actor.pz < this.zh);
    if (hit) actor.hurt();
}
