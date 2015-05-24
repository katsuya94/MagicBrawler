var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var stage;
var world; 
var bg;
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

klX.press = playerAttackScheduler;

PIXI.loader.add('./img/player.json').add('./img/terrain.json').add('./img/orc.json').load(onAssetsLoaded);

function onAssetsLoaded() {
    stage = new PIXI.Container();

    bg = new PIXI.Container();
    var tile;
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 - 32;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 - 32 - 32;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 - 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain46.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 - 16 - 32;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 - 32;
    tile.y = 300 - 32 - 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 64;
    tile.y = 300 - 32 + 0;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 + 0;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 - 64;
    tile.y = 300 - 32 + 0;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 32;
    tile.y = 300 - 32 + 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 - 32;
    tile.y = 300 - 32 + 16;
    bg.addChild(tile);
    tile = PIXI.Sprite.fromFrame('terrain1.png');
    tile.x = 400 - 32 + 0;
    tile.y = 300 - 32 + 32;
    bg.addChild(tile);
    stage.addChild(bg);

    world = new PIXI.Container();
    stage.addChild(world);

    player = new Actor('player');
    player.play();
    world.addChild(player);

    var orc = new Actor('orc');
    orc.play();
    world.addChild(orc);
    orcs.push(orc);

    debug = new PIXI.Text('');
    stage.addChild(debug);

    window.setInterval(function() {
        debug.text = 'FPS = ' + ticker.FPS.toFixed(0) + '; p = (' + player.px.toFixed(2) + ', ' + player.py.toFixed(2) + ', ' + player.pz.toFixed(2) + ')';
    }, 1000);

    ticker.add(function () {
        if (playerMovementUpdateScheduled) {
            playerMovementUpdateScheduled = false;
            controlMovement();
            player.movementUpdate();
        }
        if (playerAttackScheduled) {
            playerAttackScheduled = false;
            player.attack();
        }

        var dt = ticker.elapsedMS;

        player.updatePosition(dt);
        for (var i = 0; i < orcs.length; i++)
            orcs[i].updatePosition(dt);

        world.children.sort(function(a, b) {return a.depth < b.depth;});

        renderer.render(stage);
    });
}
