function Orc(x, y) {
    Actor.call(this, 'orc', x, y);

    this.xDest = this.px;
    this.yDest = this.py;
    this.xDestFloor = this.pxFloor;
    this.yDestFloor = this.pyFloor;

    this.animationSpeed = 0.15;
    this.attackCooldown = 1000;
    this.health = 50;
    this.damage = 5;

    this.mode = 0;
    this.idleTime = 3000;
    this.thinkTime = this.idleTime;
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
};

Orc.prototype.pathFind = function() {
    var path = pathRef(this.pxFloor, this.pyFloor, this.xDestFloor, this.yDestFloor);
    this.direction = (path && path.direction) || this.direction;
    this.movementUpdate();
};

Orc.prototype.think = function(dt) {
    switch (this.mode) {
    case 0: // Patrol
        if (!player.dying && distance(this.px, this.py, player.px, player.py) < 4) {
            this.mode = 1;
        } else if (this.moving && this.pxFloor === this.xDestFloor && this.pyFloor === this.yDestFloor) {
            this.moving = false;
            this.thinkTime = this.idleTime;
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
        if (!this.attacking) {
            var d = distance(this.px, this.py, player.px, player.py);
            if (player.dying){
                this.mode = 0;
            } else if (d < 1.5) {
                this.face(player.px, player.py);
                this.attack();
            } else if (d > 10) {
                this.mode = 0;
            } else if (player.newTile) {
                this.setDest(player.px, player.py);
            } else if (this.newTile) {
                this.newTile = false;
                this.pathFind();
            } else if (!this.moving) {
                this.moving = true;
                this.setDest(player.px, player.py);
            }
        }
    }
}
