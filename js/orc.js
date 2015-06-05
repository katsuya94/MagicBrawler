function Orc(x, y, type, difficulty) {
    Actor.call(this, 'orc', x, y);

    this.xDest = this.px;
    this.yDest = this.py;
    this.xDestFloor = this.pxFloor;
    this.yDestFloor = this.pyFloor;
    this.orcType = type;

    switch(type){
        case 0: //Default
            this.animationSpeed = 0.15;
            this.attackCooldown = 1000;
            this.health = 50;
            this.damage = 5;
            this.defaultTint = 0xFFFFFF;
            this.points = 100; //points gotten for killing
            this.sight = 5; //how far the orc can see
            break;

        case 1: //BLUE Fast but less health
            this.animationSpeed = 0.25;
            this.attackCooldown = 500;
            this.health = 30;
            this.damage = 5;
            this.defaultTint = 0x4650F0;
            this.tint = 0x4650F0;
            this.points = 150;
            this.sight = 4;
            break;

        case 2: //RED Slow but more health/damage
            this.animationSpeed = 0.1;
            this.attackCooldown = 1600;
            this.health = 70;
            this.damage = 15;
            this.defaultTint = 0xD40644;
            this.tint = 0xD40644;
            this.hurtColor = 0x4650F0;
            this.points = 200;
            this.sight = 4;
            // this.scale.x = this.scale.y = 1.2;
            break;

        case 3: //GREEN can see longer distances?
            this.animationSpeed = 0.15;
            this.attackCooldown = 1000;
            this.health = 50;
            this.damage = 5;
            this.defaultTint = 0x33F236;
            this.tint = 0x33F236;
            this.points = 175;
            this.sight = 6;
            this.loseDistance = 9;
            break;

    }

    //modifiers for difficulty
    this.health *= difficulty;
    this.damage *= difficulty;
    this.points += (difficulty - 1) * 100;
    this.sight *= (difficulty * difficulty);
    this.animationSpeed *= Math.sqrt(difficulty);

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

Orc.prototype.die = function() {
    Actor.prototype.die.call(this);
    spree += 1;
    spreeTimer = 5000;
    var multiplier = Math.pow(2, spree - 1);
    score += this.points * multiplier;
    points.x = this.x + 25;
    points.y = this.y + 25;
    points.text = '+' + Math.floor(this.points) + (multiplier > 1 ? (' x ' + multiplier) : '');
    points.visible = true;
    points.visibleTime = 2000;
};

Orc.prototype.think = function(dt) {
    switch (this.mode) {
    case 0: // Patrol
        if (!player.dying && distance(this.px, this.py, player.px, player.py) < this.sight) {
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
            } else if (d > (this.loseDistance ? this.loseDistance : 7)) {
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
};
