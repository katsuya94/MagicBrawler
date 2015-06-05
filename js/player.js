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

function Player(x, y) {
    Actor.call(this, 'player', x, y);
    this.elements = [];
    this.elementId = 0;
    this.charging = false;
    this.swapPenalty = false;
    this.chargeEffect = new ChargeEffect();
    this.defaultTint = 0xFFFFFF;
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

        if (!this.attacking)
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
    if (this.charging) {
        if (this.moving || this.attacking || this.swapPenalty || this.dying) {
            this.charging = false;
            this.chargeEffect.loop = false;
            this.chargeEffect.playAnimation(2, this.chargeEffect._animations[2].indexOf(this.chargeEffect._texture));
        } else {
            this.chargingTime -= dt
            if (this.chargingTime <= 0) {
                //do stuff
            }
        }
    } else if (!this.moving && !this.attacking && !this.swapPenalty && !this.dying) {
        this.charging = true;
        this.chargeEffect.loop = false;
        this.chargeEffect.filter(elementFilters[this.elements[this.elementId].type]);
        this.chargeEffect.playAnimation(0, this.chargeEffect._animations[0].indexOf(this.chargeEffect._texture));
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
