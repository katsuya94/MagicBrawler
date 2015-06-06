var player;
var shaker;
var world;
var points;
var score = 0;
var difficultyLevel = 0;
var orcInterval;

var spree = 0;
var spreeTimer;

function gameStart() {
    var scale = 0.75;
    var orcs = [];
    var orcSpawnDistribution = [10, 3, 2, 2];
    var startingOrcs = 12;

    /* GUI Elements */

    var spawnScheduled = false;

    function spawn() {
        if (orcs.length < startingOrcs + difficultyLevel * 6) {
            var x = Math.floor(Math.random() * DIM);
            var y = Math.floor(Math.random() * DIM);
            var path = pathRef(x, y, player.pxFloor, player.pyFloor);
            var randType = selectFromDistribution(orcSpawnDistribution);
            if (path && path.direction && distance(x, y, player.px, player.py) > 10) {
                var orc = new Orc(x + 0.5, y + 0.5, randType, 2 - Math.pow(0.9, difficultyLevel));
                orcs.push(orc);
                world.addChild(orc);
            }
        }
        console.log(orcs);
    }

    var stage = new PIXI.Container();

    shaker = new PIXI.Container();
    stage.addChild(shaker);

    world = new PIXI.Container();
    shaker.addChild(world);

    points = new PIXI.Text('', {font: '20px bold arial'});
    points.showing = false;
    points.x = -1000;
    points.y = -1000;
    world.addChild(points);

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
    //Spawn x orcs to start game
    for(i = 0; i < startingOrcs; i++)
        spawn();

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
        background.text = new PIXI.Text('', {font: 'bold 30px Arial', fill: 0xffffff});
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

    function checkDifficulty() {
        if (score >= (difficultyLevel + 1) * 500){
            difficultyLevel = Math.floor(score / 500);
            if (orcInterval)
                window.clearInterval(orcInterval);
            orcInterval = window.setInterval(spawn, 2000 + 6000 / Math.pow(1.5, difficultyLevel));
            for (var j = 0; j < orcSpawnDistribution.length; j++) {
                orcSpawnDistribution[j] += 2; //Make it more likely for rare orcs to spawn
            }
        }
    };

    var updateGame = function () {
        var dt = ticker.elapsedMS;

        /* Update points display */
        if (points.showing) {
            points.showingTime -= dt;
            if (points.showingTime <= 0) {
                points.x = -1000;
                points.y = -1000;
            }
        }

        /* Update spree */

        if (spree) {
            spreeTimer -= dt;
            if (spreeTimer <= 0)
                spree = 0;
        }

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
                if (orcs[i].fadeTime <= 0) {
                    world.removeChild(orcs[i]);
                    orcs.splice(orcs.indexOf(orcs[i]), 1);
                    i--;
                }
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

        /* Effects */

        for (var i = 0; i < effects.length; i++) {
            if (effects[i].checkRemove()) {
                effects[i].updatePosition(dt);
            } else {
                effects[i].remove(i);
                i--;
            }
        }

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

        function entityDepth(entity) {
            var i = entity.pxFloor;
            var j = entity.pyFloor;

            entity.ahead = [];
            entity.numBehind = 0;
            entity.visited = false;

            if (!valid(i, j))
                return;

            var cap = tiles[j][i].length - 1;

            add(tiles[j][i][cap - 1], entity);
            add(entity, tiles[j][i][cap]);

            var rampAdjusted = cap - (rampRef(i, j) >= 0) - 1;

            function over(i, j, k) {
                if (k > 0) {
                    if (valid(i - 1, j) && tiles[j][i - 1][rampAdjusted]) {
                        add(tiles[j][i - 1][rampAdjusted], entity);
                        over(i - 1, j, k - 1)
                    }
                    if (valid(i, j - 1) && tiles[j - 1][i][rampAdjusted]) {
                        add(tiles[j - 1][i][rampAdjusted], entity);
                        over(i, j - 1, k - 1)
                    }
                }
            }

            over(i, j, entity.overDepth);

            // function front(i, j) {
            //     if (valid(i, j)) {
            //         if (tiles[j][i][rampAdjusted]) {
            //             add(tiles[j][i][rampAdjusted], actor);
            //             if (tiles[j][i][rampAdjusted + 1])
            //                 add(tiles[j][i][rampAdjusted + 1], actor);
            //         }
            //     }
            // }

            // front(i + 1, j);
            // front(i, j + 1);
        }

        entityDepth(player);
        for (var i = 0; i < orcs.length; i++)
            entityDepth(orcs[i]);
        for (var i = 0; i < effects.length; i++)
            entityDepth(effects[i]);

        function entityEntity(a, b) {
            if (a.px + a.py > b.px + b.py)
                add(a, b);
            else
                add(b, a);
        }

        for (var i = 0; i < orcs.length; i++)
            entityEntity(player, orcs[i]);
        for (var i = 0; i < effects.length; i++)
            entityEntity(player, effects[i]);
        for (var i = 0; i < orcs.length; i++) {
            for (var j = i + 1; j < orcs.length; j++)
                entityEntity(orcs[i], orcs[j]);
            for (var j = 0; j < effects.length; j++)
                entityEntity(orcs[i], effects[j]);
        }
        for (var i = 0; i < effects.length; i++)
            for (var j = i + 1; j < effects.length; j++)
                entityEntity(effects[i], effects[j]);

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

        points.depth = depth;

        world.children.sort(function(a, b) {return a.depth - b.depth;});

        var target = 0.75 + 0.25 * (1 - player.pz / HEIGHT);
        scale = Math.min(1.0, Math.max(0.0, scale + dt * (target - scale) / 100));
        world.scale.x = scale;
        world.scale.y = scale;
        world.x = (-player.x * scale + 400 - 64);
        world.y = (-player.y * scale + 300 - 64);

        /* Health bar */

        healthBar.clear();
        healthBar.beginFill(0xF5252C, 1);
        healthBar.drawRect(2, 2, 196 * Math.max(player.health, 0) / player.maxHealth, 16, 3);

        debug.text = score.toString();
        debug.x = 800 - debug.width - 10;

        for (var i = 0; i < player.elements.length; i++) {
            player.elements[i].x += dt * (player.elements[i].targetX - player.elements[i].x) / 100;
            player.elements[i].scaleScalar += dt * (player.elements[i].targetScaleScalar - player.elements[i].scaleScalar) / 100;
            player.elements[i].scale.x = player.elements[i].scaleScalar;
            player.elements[i].scale.y = player.elements[i].scaleScalar;
        }

        /* Increasing game difficulty */
        checkDifficulty();

        /* render */

        renderer.render(stage);
    };
    ticker.add(updateGame);
}
