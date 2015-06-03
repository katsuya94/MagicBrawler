function Orc(x, y) {
    Actor.call(this, 'orc', x, y);

    this.xDest = this.px;
    this.yDest = this.py;
    this.xDestFloor = this.pxFloor;
    this.yDestFloor = this.pyFloor;

    this.animationSpeed = 0.15;
    this.attackCooldown = 1000;

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
    this.direction = pathRef(this.pxFloor, this.pyFloor, this.xDestFloor, this.yDestFloor).direction;
    this.movementUpdate();
}

Orc.prototype.think = function(dt) {
    switch (this.mode) {
    case 0: // Patrol
        if (distance(this.px, this.py, player.px, player.py) < 4) {
            this.mode = 1;
        } else if (this.moving && this.pxFloor === this.xDestFloor && this.pyFloor === this.yDestFloor) {
            this.moving = false;
            this.thinkTime = 3000;
            this.movementUpdate();
        } else if (this.moving && this.newTile) {
            this.newTile = false;
            this.pathFind();
        } if (!this.moving) {
            this.thinkTime -= dt;
            if (this.thinkTime <= 0) {
                var x = Math.floor(this.px - 5 + 10 * Math.random());
                var y = Math.floor(this.py - 5 + 10 * Math.random());
                var path = pathRef(this.pxFloor, this.pyFloor, x, y);
                if (path && typeof path.direction === 'number') {
                    this.setDest(x, y);
                } else {
                    this.direction = Math.floor(8 * Math.random());
                    this.movementUpdate();
                }
            }
        }
        break;
    case 1: // Chase
        var d = distance(this.px, this.py, player.px, player.py);
        if (d < 1.5) {
            if (!this.attacking) {
                this.face(player.px, player.py);
                this.attack();
            }
        } else if (d > 10) {
            this.mode = 0;
        } else if (player.newTile) {
            this.setDest(player.px, player.py);
        } else if (this.moving && this.newTile) {
            this.newTile = false;
            this.pathFind();
        }
    }
}
