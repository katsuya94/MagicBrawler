var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var stage;
var world;
var scale = 1.0;
var player;
var orcs = [];
var debug;

var spawnScheduled = false;

function spawn() {
    var x = Math.floor(Math.random() * DIM);
    var y = Math.floor(Math.random() * DIM);
    var path = pathRef(x, y, player.pxFloor, player.pyFloor);
    if (path && path.direction && distance(x, y, player.px, player.py) > 10) {
        var orc = new Orc(x + 0.5, y + 0.5);
        orcs.push(orc);
        world.addChild(orc);
    }
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

    player = new Player(Math.floor(Math.random() * DIM) + 0.5, Math.floor(Math.random() * DIM) + 0.5);
    world.addChild(player);

    window.setInterval(function() { if (orcs.length < 10) spawnScheduled = true; }, 10000);

    debug = new PIXI.Text('');
    stage.addChild(debug);

    window.setInterval(function() {
        debug.text = 'FPS = ' + ticker.FPS.toFixed(0) + '; ' +
                     'p = (' + player.px.toFixed(2) + ', ' + player.py.toFixed(2) + ', ' + player.pz.toFixed(2) + '); ' +
                     'health = ' + player.health;
    }, 1000);

    ticker.add(function () {
        var dt = ticker.elapsedMS;

        /* Remove dead */

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

        /* Spawn */

        if (spawnScheduled) {
            spawnScheduled = false;
            spawn();
        }

        /* Think */

        player.think(dt);
        for (var i = 0; i < orcs.length; i++)
            orcs[i].think(dt);

        /* Hitboxes */

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

        /* Update position */

        player.updatePosition(dt);
        for (var i = 0; i < orcs.length; i++)
            orcs[i].updatePosition(dt);

        /* Create scene graph */

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
            var cap = tiles[j][i].length - 1;

            actor.ahead = [];
            actor.numBehind = 0;
            actor.visited = false;

            add(tiles[j][i][cap - 1], actor);
            add(actor,tiles[j][i][cap]);

            var rampAdjusted = cap - (rampRef(i, j) >= 0) - 1;

            function over(i, j) {
                if (valid(i, j) && tiles[j][i][rampAdjusted]) {
                    add(tiles[j][i][rampAdjusted], actor);
                }
            }

            over(i - 1, j);
            over(i, j - 1);
        }

        actorDepth(player);
        for (var i = 0; i < orcs.length; i++)
            actorDepth(orcs[i]);

        function actorActor(a, b) {
            if (a.px + a.py > b.px + b.py)
                add(a, b);
            else
                add(b, a);
        }

        for (var i = 0; i < orcs.length; i++)
            actorActor(player, orcs[i]);
        for (var i = 0; i < orcs.length; i++) {
            for (var j = i + 1; j < orcs.length; j++)
                actorActor(orcs[i], orcs[j]);
        }

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

        // dfs(tiles[DIM - 1][DIM - 1][0], []);

        /* Topsort scene graph */

        var roots = [tiles[DIM - 1][DIM - 1][0]];
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

        var target = 0.75 + 0.25 * (1 - player.pz / HEIGHT);
        scale += dt * (target - scale) / 100;
        world.scale.x = scale;
        world.scale.y = scale;
        world.x = (-player.x * scale + 400 - 64);
        world.y = (-player.y * scale + 300 - 64);

        /* render */

        renderer.render(stage);
    });
}
