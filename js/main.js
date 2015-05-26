var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var stage;
var world;
var layers;
var player;
var orcs = [];
var debug;

var klLeft = new keyListener(37);
var klUp = new keyListener(38);
var klRight = new keyListener(39);
var klDown = new keyListener(40);
var klX = new keyListener(88);

var playerMovementUpdateScheduled = false;
var playerMovementUpdateScheduler = function() { playerMovementUpdateScheduled = true; };

klLeft.press = playerMovementUpdateScheduler;
klLeft.release = playerMovementUpdateScheduler;
klUp.press = playerMovementUpdateScheduler;
klUp.release = playerMovementUpdateScheduler;
klRight.press = playerMovementUpdateScheduler;
klRight.release = playerMovementUpdateScheduler;
klDown.press = playerMovementUpdateScheduler;
klDown.release = playerMovementUpdateScheduler;

function controlMovement() {
    var x = 0;
    var y = 0;

    if (klLeft.isDown) x -= 1;
    if (klUp.isDown) y += 1;
    if (klRight.isDown) x += 1;
    if (klDown.isDown) y -= 1;

    if (x === -1) {
        if (y === -1) {
            player.direction = 7;
        } else if (y === 0) {
            player.direction = 0;
        } else if (y === 1) {
            player.direction = 1;
        }
    } else if (x === 0) {
        if (y === -1) {
            player.direction = 6;
        }else if (y === 1) {
            player.direction = 2;
        }
    } else if (x === 1) {
        if (y === -1) {
            player.direction = 5;
        } else if (y === 0) {
            player.direction = 4;
        } else if (y === 1) {
            player.direction = 3;
        }
    }

    player.moving = !(x === 0 && y === 0);
}

var playerAttackScheduled = false;
var playerAttackScheduler = function() { playerAttackScheduled = true; };

var spawnScheduled = false;

klX.press = playerAttackScheduler;

function spawn() {
    var orc = new Orc();
    orc.play();
    world.addChild(orc);
    orcs.push(orc);
}

PIXI.loader.add('./img/player.json').add('./img/terrain.json').add('./img/orc.json').load(onAssetsLoaded);

function onAssetsLoaded() {
    stage = new PIXI.Container();

    world = new PIXI.Container();
    stage.addChild(world);

    layers = mapLayers();
    for (var i = 0; i < layers.length; i++)
        world.addChild(layers[i]);

    player = new Actor('player');
    player.play();
    world.addChild(player);

    player.pathFind = function() {
        for (var i = 0; i < orcs.length; i++)
            orcs[i].setDest(player.px, player.py);
    };

    window.setInterval(function() { spawnScheduled = true; }, 10000);

    debug = new PIXI.Text('');
    stage.addChild(debug);

    window.setInterval(function() {
        debug.text = 'FPS = ' + ticker.FPS.toFixed(0) + '; ' +
                     'p = (' + player.px.toFixed(2) + ', ' + player.py.toFixed(2) + ', ' + player.pz.toFixed(2) + '); ' +
                     'health = ' + player.health;
    }, 1000);

    ticker.add(function () {
        var dt = ticker.elapsedMS;

        if (player.dying) {
            player.fadeTime -= dt;
            if (player.fadeTime <= 0)
                world.removeChild(player);
        }
        for (var i = 0; i < orcs.length; i++) {
            if (orcs[i].dying) {
                orcs[i].fadeTime -= dt;
                if (orcs[i].fadeTime <= 0)
                    world.removeChild(orcs[i]);
            }
        }

        if (playerMovementUpdateScheduled) {
            playerMovementUpdateScheduled = false;
            controlMovement();
            player.movementUpdate();
        }
        if (playerAttackScheduled) {
            playerAttackScheduled = false;
            player.attack();
        }

        if (spawnScheduled) {
            spawnScheduled = false;
            spawn();
        }

        for (var i = 0; i < orcs.length; i++) {
            if (!orcs[i].attacking && !player.dying && distance(orcs[i].px, orcs[i].py, player.px, player.py) <= 1){
                orcs[i].faceObject(player.px, player.py);
                orcs[i].attack();
            }

        }

        for (var i = 0; i < hitboxes.length; i++) {
            if (hitboxes[i].update(dt)) {
                hitboxes[i].hit(player);
                for (var j = 0; j < orcs.length; j++)
                    hitboxes[i].hit(orcs[j]);
            } else {
                hitboxes.splice(i, 1);
                i--;
            }
        }

        player.updatePosition(dt);
        for (var i = 0; i < orcs.length; i++) {
            orcs[i].updatePosition(dt);
        }


        world.children.sort(function(a, b) {return b.depth - a.depth;});

        renderer.render(stage);
    });
}
