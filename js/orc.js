function Orc() {
    Actor.call(this, 'orc');

    this.xDest = this.px;
    this.yDest = this.py;
    this.xDestFloor = this.pxFloor;
    this.yDestFloor = this.pyFloor;

    this.animationSpeed = 0.15;
    this.attackCooldown = 600;

    this.mode = 0;
    this.thinkTime = 3000;
}

Orc.prototype = Object.create(Actor.prototype);
Orc.prototype.constructor = Orc;

Orc.prototype.setDest = function(x, y) {
    if (!this.dying) {
        this.xDest = x;
        this.yDest = y;
        this.xDestFloor = Math.floor(this.xDest);
        this.yDestFloor = Math.floor(this.yDest);
        this.moving = true;
        this.pathFind();
    }
}

Orc.prototype.pathFind = function() {
    this.direction = pathRef(this.pxFloor, this.pyFloor, this.xDestFloor, this.yDestFloor).next;
    this.movementUpdate();
}

Orc.prototype.think = function(dt) {
    switch (this.mode) {
    case 0: // Patrol
        if (this.moving && this.pxFloor === this.xDestFloor && this.pyFloor === this.yDestFloor) {
            this.moving = false;
            this.thinkTime = 3000;
            this.movementUpdate();
        } else {
            this.thinkTime -= dt;
            if (this.thinkTime <= 0) {
                if (this.moving) {
                    this.pathFind();
                    this.thinkTime = 1000;
                } else {
                    var x = Math.floor(this.px - 2 + 4 * Math.random());
                    var y = Math.floor(this.py - 2 + 4 * Math.random());
                    var path = pathRef(this.pxFloor, this.pyFloor, x, y);
                    if (path && typeof path.next === 'number') {
                        this.setDest(x, y);
                    } else {
                        this.direction = Math.floor(8 * Math.random());
                        this.movementUpdate();
                    }
                }
            }
        }
        break;
    }
}
