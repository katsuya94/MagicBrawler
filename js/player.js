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
    this.chargingTime = 2000;
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
                this.chargingTime = 2000;
                this.orbs.push(new Orb(this.elements[this.elementId].type));
            }
        }
    } else if (!this.moving && !this.attacking && !this.casting && !this.swapPenalty && !this.dying && this.orbs.length < 5) {
        this.charging = true;
        this.chargeEffect.loop = false;
        this.chargeEffect.filter(elementFilters[this.elements[this.elementId].type]);
        this.chargeEffect.playAnimation(0, this.chargeEffect._animations[0].indexOf(this.chargeEffect._texture));
    }
    if (this.castDelay > 0) {
        this.castDelay -= dt;
        if (this.castDelay <= 0) {
            this.animationSpeed = Math.max(this.animationSpeed, this.airAnimationSpeed);
            this.airAnimationSpeed = this.defaultAnimationSpeed;
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

        var self = this;

        if (counts.water) {
            var aMin = da[this.direction] - Math.PI / 4;
            for (var i = 0; i <= 1 + counts.water; i++) {
                var a = aMin + (i / (1 + counts.water)) * Math.PI / 2;
                var vx = Math.cos(a);
                var vy = Math.sin(a);
                var bullet = new Bullet('water', {first: 1, last: 29},
                                        player.px, player.py, player.pz, vx, vy,
                                        {delay: 0, ttl: 200, damage: Math.pow(2, counts.water), exclude: self});
                bullet.filter({hue: 0, sat: -0.75});
            }
        }

        if (counts.air) {
            this.castDelay = 800;
            this.airAnimationSpeed = 0.2 + 0.1 * counts.air;
        }

        if (counts.fire) {
            var vx = dx[this.direction];
            var vy = dy[this.direction];
            new Missile('fire', {first: 1, last: 29}, 'explosion', {first: 1, last: 29},
                        player.px, player.py, player.pz, 2 * vx, 2 * vy, 0.75 + (counts.fire - 1) * 0.25,
                        {delay: 0, ttl: 200, damage: (25 + Math.pow(2, counts.fire)), exclude: self},
                        {delay: 0, ttl: 800, damage: (25 + Math.pow(2, counts.fire)) / 2, exclude: self});
        }

        if (counts.earth) {
            var maxR = 2 + counts.earth * 0.5
            function shake(times) {
                if (times) {
                    shaker.x = Math.random() * (5 + counts.earth);
                    shaker.y = Math.random() * (5 + counts.earth);
                    window.setTimeout(function() {shake(times - 1)}, 100);
                } else {
                    shaker.x = 0;
                    shaker.y = 0;
                }
            }
            var times = 10 + counts.earth * 3;
            shake(times);
            new HitCylinder({delay: 0, ttl: times * 100, damage: Math.pow(2, counts.earth), exclude: self}, player.px, player.py, player.pzMin, maxR, 2);
        }

        if (counts.life) {
            this.health = Math.min(this.health + Math.pow(1.5, counts.life), this.maxHealth);
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
