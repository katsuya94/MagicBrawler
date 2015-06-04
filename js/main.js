var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var stage;
var world;
var scale = 0.75;
var player;
var orcs = [];
var debug;

/* GUI Elements */
var GUI;
var healthText;
var healthbar;
var healthBackground;

var magicBox1;
var magic1;
var magicText1;
var magicBox2;
var magic2;
var magicText2;
var magicBox3;
var magic3;
var magicText3;

var fireIcon = PIXI.Texture.fromImage('../img/icons/fire_icon.png');
var waterIcon = PIXI.Texture.fromImage('../img/icons/water_icon.png');

/* Start Page Elements */
var magicBoxes = [];
var magicLogos = [];
var magicTexts = [];

var chosenElementBoxes = [];
var chosenElementIcons = [];
var chosenElements = [false, false];

var startGameButton;
var startGameText;

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

PIXI.loader.add('./img/player.json').add('./img/terrain.json').add('./img/orc.json').load(testIntro);
// PIXI.loader.load(testIntro);

function testIntro() {
    stage = new PIXI.Container();



    var logo = PIXI.Sprite.fromImage('../img/game_logo.png');
    logo.x = 170;
    logo.y = 70;
    stage.addChild(logo);

    var elementText = new PIXI.Text('Choose your elements', {font:'30px Arial'});
    elementText.x = 80;
    elementText.y = 240;
    stage.addChild(elementText);

    startGameButton = new PIXI.Graphics();
    startGameButton.beginFill(0xC42333, 0.5);
    startGameButton.lineStyle(4, 0xF5B3B9, 1);
    startGameButton.drawRoundedRect(400, 450, 300, 50, 5);
    stage.addChild(startGameButton);

    startGameText = new PIXI.Text('Select an element to continue', {font: '20px Arial'});
    startGameText.x = 410;
    startGameText.y = 455;
    startGameText.alpha = 0.8;
    stage.addChild(startGameText);


    magicLogos[0] = PIXI.Sprite.fromImage('../img/icons/fire_icon.png');
    magicLogos[0].type = 'fire';
    magicLogos[1] = PIXI.Sprite.fromImage('../img/icons/water_icon.png');
    magicLogos[1].type = 'water';
    magicLogos[2] = PIXI.Sprite.fromImage('../img/icons/earth_icon.png');
    magicLogos[2].type = 'earth';
    magicLogos[3] = PIXI.Sprite.fromImage('../img/icons/air_icon.png');
    magicLogos[3].type = 'air';
    magicLogos[4] = PIXI.Sprite.fromImage('../img/icons/life_icon.png');
    magicLogos[4].type = 'life';



    for (var i = 0; i < 5; i++){
        magicTexts[i] = new PIXI.Text('');
        magicTexts[i].x = 100 + i * 40;
        magicTexts[i].y = i%2 == 1 ? 275 : 355;
        magicTexts[i].style = {font:'20px Arial'};
        stage.addChild(magicTexts[i]);

        magicBoxes[i] = new PIXI.Graphics();
        magicBoxes[i].beginFill(0xC2C2BA, 0.7);
        magicBoxes[i].lineStyle(4, 0xC2C2BA, 1);
        magicBoxes[i].drawRoundedRect(100 + i * 40, i%2 == 1 ? 300 : 380, 50, 50, 3);
        stage.addChild(magicBoxes[i]);

        magicLogos[i].x = 100 + i * 40;
        magicLogos[i].y = i%2 == 1 ? 300 : 380;
        magicLogos[i].interactive = true;
        magicLogos[i].click = function(e) {
            if (!chosenElements[0]) {
                chosenElements[0] = e.target.type;
            } else if (!chosenElements[1]){
                chosenElements[1] = e.target.type;
            }
        };

        stage.addChild(magicLogos[i]);
    }
    magicTexts[0].text = 'Fire';
    magicTexts[1].text = 'Water';
    magicTexts[2].text = 'Earth';
    magicTexts[3].text = 'Air';
    magicTexts[4].text = 'Life';

    for (i = 0; i < 3; i++){
        chosenElementBoxes[i] = new PIXI.Graphics();
        chosenElementBoxes[i].beginFill(0xC2C2BA, 0.7);
        chosenElementBoxes[i].lineStyle(4, 0xC2C2BA, 1);
        chosenElementBoxes[i].drawRoundedRect(i == 2 ? 580 : 500, i == 2 ? 340 : 300 + i * 75, 50, 50, 3);
        stage.addChild(chosenElementBoxes[i]);

    }



    animate();

    function animate() {
        for (var i = 0; i < 2; i++){
            if(chosenElements[i]){
                chosenElementIcons[i] = PIXI.Sprite.fromImage('../img/icons/' + chosenElements[i] + '_icon.png');
                chosenElementIcons[i].x = 500;
                chosenElementIcons[i].y = 300 + i * 75;
                chosenElementIcons[i].interactive = true;
                chosenElementIcons[i].number = i;
                chosenElementIcons[i].click = function(e) {
                            if(chosenElements[e.target.number]){
                                chosenElements[e.target.number] = false;
                                stage.removeChild(e.target);
                            }
                        };
                stage.addChild(chosenElementIcons[i]);
            }
        }

        if(chosenElements[0] && chosenElements[1]){

            startGameButton.clear();
            startGameButton.beginFill(0x0AC900, 0.8);
            startGameButton.lineStyle(4, 0x5AF752, 1);
            startGameButton.drawRoundedRect(400, 450, 200, 50, 5);
            stage.addChild(startGameButton);

            startGameText.text = 'Start Brawling!';
            startGameText.style = {font: 'bold 25px Arial'};
            startGameText.x = 410;
            startGameText.y = 455;
            startGameText.alpha = 0.8;
            stage.addChild(startGameText);

        }

        requestAnimationFrame(animate);

        // render the root container
        renderer.render(stage);
    }
}

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

    //Initialize GUI
    GUI = new PIXI.Container();
    healthText = new PIXI.Text('Health:', {font: '30px Arial'});
    healthText.x = 38;
    healthText.y = 2;
    GUI.addChild(healthText);

    healthBackground = new PIXI.Graphics();
    healthBackground.beginFill(0xC2C2BA, 0.7);
    healthBackground.lineStyle(4, 0xC2C2BA, 1);
    healthBackground.drawRoundedRect(150, 10, 110, 20, 3);
    GUI.addChild(healthBackground);

    healthbar = new PIXI.Graphics();
    GUI.addChild(healthbar);

    magicBox1 = new PIXI.Graphics();
    magicBox1.beginFill(0xC2C2BA, 0.7);
    magicBox1.lineStyle(4, 0xC2C2BA, 1);
    magicBox1.drawRoundedRect(300, 10, 50, 50, 3);
    GUI.addChild(magicBox1);

    magic1 = PIXI.Sprite.fromImage('../img/icons/fire_icon.png');
    magic1.x = 300;
    magic1.y = 10;
    magic1.alpha = 0.8;
    GUI.addChild(magic1);

    magicText1 = new PIXI.Text('1', {font: 'bold 15px Arial'});
    magicText1.x = 303;
    magicText1.y = 12;
    GUI.addChild(magicText1);

    magicBox2 = new PIXI.Graphics();
    magicBox2.beginFill(0xC2C2BA, 0.7);
    magicBox2.lineStyle(4, 0xC2C2BA, 1);
    magicBox2.drawRoundedRect(370, 10, 50, 50, 3);
    GUI.addChild(magicBox2);

    magic2 = PIXI.Sprite.fromImage('../img/icons/earth_icon.png');
    magic2.x = 370;
    magic2.y = 10;
    magic2.alpha = 0.8;
    GUI.addChild(magic2);

    magicText2 = new PIXI.Text('2', {font: 'bold 15px Arial'});
    magicText2.x = 373;
    magicText2.y = 12;
    GUI.addChild(magicText2);

    magicBox3 = new PIXI.Graphics();
    magicBox3.beginFill(0xC2C2BA, 0.7);
    magicBox3.lineStyle(4, 0xC2C2BA, 1);
    magicBox3.drawRoundedRect(440, 10, 50, 50, 3);
    GUI.addChild(magicBox3);

    magic3 = PIXI.Sprite.fromImage('../img/icons/air_icon.png');
    magic3.x = 440;
    magic3.y = 10;
    magic3.alpha = 0.8;
    GUI.addChild(magic3);

    magicText3 = new PIXI.Text('3', {font: 'bold 15px Arial'});
    magicText3.x = 443;
    magicText3.y = 12;
    GUI.addChild(magicText3);

    stage.addChild(GUI);

    // window.setInterval(function() {
    //     debug.text = 'FPS = ' + ticker.FPS.toFixed(0) + '; ' +
    //                  'p = (' + player.px.toFixed(2) + ', ' + player.py.toFixed(2) + ', ' + player.pz.toFixed(2) + '); ' +
    //                  'health = ' + player.health;
    // }, 1000);

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

        /* Change health bar */
        healthbar.clear();
        healthbar.beginFill(0xF5252C, 0.7);
        healthbar.drawRect(155, 15, 100 * player.health / player.maxHealth, 10);

        /* render */

        renderer.render(stage);
    });
}
