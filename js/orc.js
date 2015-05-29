function Orc() {
    Actor.call(this, 'orc');

    this.xDest = 0;
    this.yDest = 0;

    this.animationSpeed = 0.15;
    this.attackCooldown = 600;
}

Orc.prototype = Object.create(Actor.prototype);
Orc.prototype.constructor = Orc;

Orc.prototype.setDest = function(x, y) {
    if (!this.dying) {
        this.xDest = x;
        this.yDest = y;
        this.moving = true;
        this.pathFind();
    }
}

Orc.prototype.pathFind = function() {
    var xDestFloor = Math.floor(this.xDest);
    var yDestFloor = Math.floor(this.yDest);
    if (xDestFloor === this.pxFloor && yDestFloor === this.pyFloor)
        this.moving = false;
    else
        this.direction = pathRef(this.pxFloor, this.pyFloor, xDestFloor, yDestFloor).next;
    this.movementUpdate();
};

Orc.prototype.think = function() {
    
}
