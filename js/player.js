var klLeft = new keyListener(37);
var klUp = new keyListener(38);
var klRight = new keyListener(39);
var klDown = new keyListener(40);

var playerMoveScheduled = false;
var playerMoveScheduler = function() { playerMoveScheduled = true; };

klLeft.press = playerMoveScheduler;
klLeft.release = playerMoveScheduler;
klUp.press = playerMoveScheduler;
klUp.release = playerMoveScheduler;
klRight.press = playerMoveScheduler;
klRight.release = playerMoveScheduler;
klDown.press = playerMoveScheduler;
klDown.release = playerMoveScheduler;

var klX = new keyListener(88);

var playerAttackScheduled = false;
var playerAttackScheduler = function() { playerAttackScheduled = true; };

klX.press = playerAttackScheduler;

var klV = new keyListener(86);

var playerSwapScheduled = false;
var playerSwapScheduler = function() { playerSwapScheduled = true; };

klV.press = playerSwapScheduler

var klC = new keyListener(67);

var playerCastScheduled = false;
var playerCastScheduler = function() { playerCastScheduled = true; };

klC.press = playerCastScheduler;

function Player(x, y) {
    Actor.call(this, 'player', x, y);
    this.elements = [];
    this.elementId = 0;
    this.charging = false;
    this.swapPenalty = false;
    this.chargeEffect = new ChargeEffect();
    this.orbs = [];
    this.points = 0;
    this.defaultAnimationSpeed = this.animationSpeed;
    this.airAnimationSpeed = this.defaultAnimationSpeed;
    this.airDelay = -1;
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Orc;

Player.prototype.think = function(dt) {
    if (playerMoveScheduled) {
        playerMoveScheduled = false;
        var x = 0;
        var y = 0;

        if (klLeft.isDown) x -= 1;
        if (klUp.isDown) y += 1;
        if (klRight.isDown) x += 1;
        if (klDown.isDown) y -= 1;

        if (x === -1) {
            if (y === -1) {
                this.direction = 7;
            } else if (y === 0) {
                this.direction = 0;
            } else if (y === 1) {
                this.direction = 1;
            }
        } else if (x === 0) {
            if (y === -1) {
                this.direction = 6;
            } else if (y === 1) {
                player.direction = 2;
            }
        } else if (x === 1) {
            if (y === -1) {
                this.direction = 5;
            } else if (y === 0) {
                this.direction = 4;
            } else if (y === 1) {
                this.direction = 3;
            }
        }

        player.moving = !(x === 0 && y === 0);

        if (!this.attacking && !this.casting)
            this.movementUpdate();
    }
    if (playerAttackScheduled) {
        playerAttackScheduled = false;
        this.attack();
    }
    if (playerSwapScheduled) {
        playerSwapScheduled = false;
        this.swapPenalty = true;
        this.elementId = (this.elementId + 1) % 2;
        this.positionElements();
    }
    if (playerCastScheduled) {
        playerCastScheduled = false;
        this.cast();
    }
    if (this.charging) {
        if (this.moving || this.attacking || this.casting || this.swapPenalty || this.dying || this.orbs.length >= 5) {
            this.charging = false;
            this.chargeEffect.loop = false;
            this.chargeEffect.playAnimation(2, this.chargeEffect._animations[2].indexOf(this.chargeEffect._texture));
        } else {
            this.chargingTime -= dt
            if (this.chargingTime <= 0) {
                this.chargingTime = 1000;
                this.orbs.push(new Orb(this.elements[this.elementId].type));
            }
        }
    } else if (!this.moving && !this.attacking && !this.casting && !this.swapPenalty && !this.dying && this.orbs.length < 5) {
        this.charging = true;
        this.chargingTime = 1000;
        this.chargeEffect.loop = false;
        this.chargeEffect.filter(elementFilters[this.elements[this.elementId].type]);
        this.chargeEffect.playAnimation(0, this.chargeEffect._animations[0].indexOf(this.chargeEffect._texture));
    }
    if (this.castDelay > 0) {
        this.castDelay -= dt;
        if (this.castDelay <= 0) {
            this.animationSpeed = Math.max(this.animationSpeed, this.airAnimationSpeed);
            this.airAnimationSpeed = this.defaultAnimationSpeed;
            this.health = Math.min(this.health + this.heal, this.maxHealth);
        }
    }
    this.animationSpeed += (this.defaultAnimationSpeed - this.animationSpeed) * dt / 1000;
}

Player.prototype.cast = function() {
    if (!this.dying && !this.attacking && !this.casting) {
        this.casting = true;
        this.castTime = 800;
        this.loop = false;
        this.movementUpdate();
        var counts = {water: 0, air: 0, fire: 0, earth: 0, life: 0};
        while (this.orbs.length) {
            var orb = this.orbs.pop();
            counts[orb.type] += 1;
            orb.live = false;
        }

        if (counts.water) {
            var aMin = da[this.direction] - Math.PI / 4;
            for (var i = 0; i <= 1 + counts.water; i++) {
                var a = aMin + (i / (1 + counts.water)) * Math.PI / 2;
                var vx = Math.cos(a);
                var vy = Math.sin(a);
                new Bullet('water', {first: 2, last: 29},
                           player.px + vx, player.py + vy, player.pz, vx, vy,
                           {delay: 0, ttl: 200, damage: Math.exp(counts.water)});
            }
        }

        if (counts.air) {
            this.castDelay = 800;
            this.airAnimationSpeed = 0.2 * counts.air;
        }

        if (counts.life) {
            this.castDelay = 800;
            this.heal = Math.pow(1.8, counts.life);
        }
    }
}

Player.prototype.positionElements = function() {
    var active = this.elementId;
    var inactive = (active + 1) % 2;
    this.elements[active].targetX = 0;
    this.elements[active].targetScaleScalar = 1.0;
    this.elements[active].text.text = '';
    this.elements[inactive].targetX = 60;
    this.elements[inactive].targetScaleScalar = 0.5;
    this.elements[inactive].text.text = 'V';
}
