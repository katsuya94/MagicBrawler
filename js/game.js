var world;
var player;

function gameStart() {
    var scale = 0.75;
    var orcs = [];

    /* GUI Elements */

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

    var stage = new PIXI.Container();

    world = new PIXI.Container();
    stage.addChild(world);

    mapLayers();
    for (var i = 0; i < DIM; i++)
        for (var j = 0; j < DIM; j++)
            for (var k = 0; k < HEIGHT; k++)
                if (tiles[j][i][k])
                    world.addChild(tiles[j][i][k]);

    var found = false;
    while (!found) {
        var x = Math.floor(Math.random() * DIM);
        var y = Math.floor(Math.random() * DIM);
        var pass = passRef(x, y);
        found = pass[0] || pass[1] || pass[2] || pass[3];
    }
    player = new Player(x + 0.5, y + 0.5, chosenElements);
    world.addChild(player);

    window.setInterval(function() { if (orcs.length < 10) spawnScheduled = true; }, 10000);

    /* Initialize GUI */

    var GUI = new PIXI.Container();
    GUI.alpha = 0.7;
    stage.addChild(GUI);

    var healthBackground = new PIXI.Graphics();
    healthBackground.x = 10;
    healthBackground.y = 10;
    healthBackground.beginFill(0xC2C2BA, 1);
    healthBackground.lineStyle(4, 0xC2C2BA, 1);
    healthBackground.drawRoundedRect(0, 0, 200, 20, 3);
    GUI.addChild(healthBackground);

    var healthBar = new PIXI.Graphics();
    healthBackground.addChild(healthBar);

    var elementContainer = new PIXI.Container();
    elementContainer.x = 220;
    elementContainer.y = 10;
    GUI.addChild(elementContainer);

    function createElement(type) {
        var background = new PIXI.Graphics();
        background.beginFill(0xC2C2BA, 1);
        background.lineStyle(4, 0xC2C2BA, 1);
        background.drawRoundedRect(0, 0, 50, 50, 3);
        var icon = PIXI.Sprite.fromImage('../img/icons/' + type + '_icon.png');
        background.addChild(icon);
        background.text = new PIXI.Text('', {font: 'bold 20px Arial'});
        icon.addChild(background.text);
        background.text.x = 40;
        background.text.y = 40;
        background.scaleScalar = 1.0;
        background.type = type;
        return background;
    }

    player.elements.push(createElement(chosenElements[0]));
    player.elements.push(createElement(chosenElements[1]));

    elementContainer.addChild(player.elements[0]);
    elementContainer.addChild(player.elements[1]);

    player.positionElements();

    for (var i = 0; i < player.elements.length; i++) {
        player.elements[i].x = player.elements[i].targetX;
        player.elements[i].scaleScalar = player.elements[i].targetScaleScalar;
    }

    var debug = new PIXI.Text('');
    stage.addChild(debug);

    window.setInterval(function() {
        debug.text = 'FPS = ' + ticker.FPS.toFixed(0);
        debug.x = 800 - debug.width;
    }, 1000);


    var updateGame = function () {
        var dt = ticker.elapsedMS;

        /* Remove dead */

        if (player.dying && !gameOver) {
            var gameOverText = new PIXI.Text('Game Over', {font: '100px impact charcoal'});
            gameOverText.x = 175;
            gameOverText.y = 200;
            stage.addChild(gameOverText);
            gameOver = true;
            window.setTimeout(function() {
                var continueText = new PIXI.Text('Click anywhere to continue', {font: '50px impact charcoal'});
                continueText.x = 150;
                continueText.y = 350;
                stage.addChild(continueText);
                stage.interactive = true;
                stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);
                stage.click = function(){
                    ticker.remove(updateGame);
                    showHighScores();
                };
            }, 2000);
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

            function front(i, j) {
                if (valid(i, j)) {
                    if (tiles[j][i][rampAdjusted]) {
                        add(tiles[j][i][rampAdjusted], actor);
                        if (tiles[j][i][rampAdjusted + 1])
                            add(tiles[j][i][rampAdjusted + 1], actor);
                    }
                }
            }

            front(i + 1, j);
            front(i, j + 1);
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
        scale = Math.min(1.0, Math.max(0.0, scale + dt * (target - scale) / 100));
        world.scale.x = scale;
        world.scale.y = scale;
        world.x = (-player.x * scale + 400 - 64);
        world.y = (-player.y * scale + 300 - 64);

        /* Health bar */

        healthBar.clear();
        healthBar.beginFill(0xF5252C, 1);
        healthBar.drawRect(2, 2, 196 * player.health / player.maxHealth, 16, 3);

        for (var i = 0; i < player.elements.length; i++) {
            player.elements[i].x += dt * (player.elements[i].targetX - player.elements[i].x) / 100;
            player.elements[i].scaleScalar += dt * (player.elements[i].targetScaleScalar - player.elements[i].scaleScalar) / 100;
            player.elements[i].scale.x = player.elements[i].scaleScalar;
            player.elements[i].scale.y = player.elements[i].scaleScalar;
        }

        /* render */
        renderer.render(stage);
    };
    ticker.add(updateGame);
}
