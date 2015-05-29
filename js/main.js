var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var stage;
var world;
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

    mapLayers();
    for (var i = 0; i < DIM; i++)
        for (var j = 0; j < DIM; j++)
            for (var k = 0; k < HEIGHT; k++)
                if (tiles[j][i][k])
                    world.addChild(tiles[j][i][k]);

    player = new Actor('player');
    player.play();
    world.addChild(player);

    player.pathFind = function() {
        for (var i = 0; i < orcs.length; i++)
            orcs[i].setDest(player.px, player.py);
    };

    // window.setInterval(function() { spawnScheduled = true; }, 10000);

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

        for (var i = 0; i < DIM; i++) {
            for (var j = 0; j < DIM; j++) {
                for (var k = 0; k < tiles[j][i].length; k++) {
                    tiles[j][i][k].numBehind = tiles[j][i][k].permNumBehind;
                    tiles[j][i][k].ahead = tiles[j][i][k].permAhead.slice(0);
                    tiles[j][i][k].visited = false;
                }
            }
        }

        function actorDepth(actor) {
            var i = actor.pxFloor;
            var j = actor.pyFloor;
            var h = tiles[j][i].length - 1;

            actor.ahead = [];
            actor.numBehind = 0;
            actor.visited = false;

            add(tiles[j][i][h], actor);

            var behindDiagonal = actor.px + actor.py > i + j + 1;

            function splitColumnDiagonal(i, j) {
                if (valid(i, j)) {
                    if (tiles[j][i][h])
                        add(tiles[j][i][h], actor);
                    if (behindDiagonal) {
                        if (tiles[j][i][h + 1])
                            add(actor, tiles[j][i][h + 1]);
                    } else {
                        add(tiles[j][i][tiles[j][i].length - 1], actor);
                    }
                }
            }

            function splitColumn(i, j) {
                if (valid(i, j)) {
                    if (tiles[j][i][h])
                        add(tiles[j][i][h], actor);
                    function recur(i, j) {
                        if (valid(i, j)) {
                            if (tiles[j][i][h + 1])
                                add(actor, tiles[j][i][h + 1]);
                            else {
                                recur(i - 1, j);
                                recur(i, j - 1);
                            }
                        }
                    }
                    recur(i, j);
                }
            }

            splitColumnDiagonal(i - 1, j + 1);
            splitColumnDiagonal(i + 1, j - 1);
            splitColumn(i - 1, j);
            splitColumn(i, j - 1);
        }

        actorDepth(player);
        for (var i = 0; i < orcs.length; i++) {
            actorDepth(orcs[i]);
        }

        var roots = [tiles[DIM - 1][DIM - 1][0]];

        // function dfs(node, path) {
        //     var newpath = path.slice(0);
        //     newpath.push(node);
        //     if (path.indexOf(node) >= 0) {
        //         result = newpath;
        //         console.log('cycle');
        //         return true;
        //     }
        //     for (var i = 0; i < node.ahead.length; i++) {
        //         if (dfs(node.ahead[i], newpath))
        //             return true;
        //     }
        //     return false;
        // }

        // dfs(roots[0], []);

        var depth = 0;

        while (roots.length) {
            var root = roots.pop();
            if (!root.visited) {
                root.visited = true;
                root.depth = depth++;
                for (var i = 0; i < root.ahead.length; i++) {
                    var child = root.ahead[i];
                    child.numBehind--;
                    if (child.numBehind <= 0)
                        roots.push(child);
                }
            }
        }

        world.children.sort(function(a, b) { return a.depth - b.depth; });

        renderer.render(stage);
    });
}
