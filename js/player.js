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

function Player(x, y) {
    Actor.call(this, 'player', x, y);
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
            }else if (y === 1) {
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

        this.movementUpdate();
    }
    if (playerAttackScheduled) {
        playerAttackScheduled = false;
        this.attack();
    }
}
