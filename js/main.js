var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x333366});
document.getElementById('wrapper').appendChild(renderer.view);

/* Start Page Elements */

var gameStarted = false;
var gameOver = false;
var magicBoxes = [];
var magicLogos = [];
// var magicTexts = [];
var hoverTexts = [];
var hoverTextBox;

var chosenElementBoxes = [];
var chosenElementIcons = [];
var chosenElementTexts = [];
var chosenElements = [false, false];
var chosenCreated = [false, false];

var startGameButton;
var startGameText;

PIXI.loader.add('./img/player.json')
           .add('./img/terrain.json')
           .add('./img/orc.json')
           .add('./img/fx/ring.json')
           .add('./img/fx/water.json')
           .load(showStartPage);

function showStartPage() {
    var stage = new PIXI.Container();

    var logo = PIXI.Sprite.fromImage('../img/game_logo.png');
    logo.x = 110;
    logo.y = 40;
    logo.scale.x = 1.2;
    logo.scale.y = 1.2;
    stage.addChild(logo);

    // var elementText = new PIXI.Text('Choose your elements', {font:'30px Arial'});
    // elementText.x = 80;
    // elementText.y = 240;
    // stage.addChild(elementText);

    function resetButton(){
        stage.removeChild(startGameButton);
        stage.removeChild(startGameText);
        startGameButton = new PIXI.Graphics();
        startGameButton.beginFill(0xC42333, 0.5);
        startGameButton.lineStyle(4, 0xF5B3B9, 1);
        startGameButton.drawRoundedRect(400, 450, 300, 50, 5);
        stage.addChild(startGameButton);

        startGameText = new PIXI.Text('Select Two Elements', {font: '25px Arial'});
        startGameText.x = 400 + (300 - startGameText.width) / 2;
        startGameText.y = 450 + (50 - startGameText.height) / 2;
        startGameText.alpha = 0.8;
        stage.addChild(startGameText);
    };
    resetButton();

    magicLogos[0] = PIXI.Sprite.fromImage('../img/icons/fire_icon.png');
    magicLogos[0].type = 'fire';
    magicLogos[0].textboxSize = [280, 50];
    hoverTexts[0] = new PIXI.Text('A fireball that shoots in a straight line\n and explodes on impact', {font: 'bold 15px Arial'});
    magicLogos[1] = PIXI.Sprite.fromImage('../img/icons/water_icon.png');
    magicLogos[1].type = 'water';
    magicLogos[1].textboxSize = [250, 50];
    hoverTexts[1] = new PIXI.Text('Fire small water orbs that fly in \n multiple directions', {font: 'bold 15px Arial'});
    magicLogos[2] = PIXI.Sprite.fromImage('../img/icons/earth_icon.png');
    magicLogos[2].type = 'earth';
    magicLogos[2].textboxSize = [260, 50];
    hoverTexts[2] = new PIXI.Text('Summon rocks from all around you\n and knock enemies away', {font: 'bold 15px Arial'});
    magicLogos[3] = PIXI.Sprite.fromImage('../img/icons/air_icon.png');
    magicLogos[3].type = 'air';
    magicLogos[3].textboxSize = [300, 50];
    hoverTexts[3] = new PIXI.Text('Jump high into the air to evade enemies\n and make an escape', {font: 'bold 15px Arial'});
    magicLogos[4] = PIXI.Sprite.fromImage('../img/icons/life_icon.png');
    magicLogos[4].type = 'life';
    magicLogos[4].textboxSize = [280, 50];
    hoverTexts[4] = new PIXI.Text('Restore health using this magic spell\n which has limited uses', {font: 'bold 15px Arial'});

    for (var i = 0; i < 5; i++){
        // magicTexts[i] = new PIXI.Text('');
        // magicTexts[i].x = 100 + i * 40;
        // magicTexts[i].y = i%2 == 1 ? 275 : 355;
        // magicTexts[i].style = {font:'20px Arial', fill: 'white'};
        // stage.addChild(magicTexts[i]);

        magicBoxes[i] = new PIXI.Graphics();
        magicBoxes[i].beginFill(0xC2C2BA, 0.7);
        magicBoxes[i].lineStyle(4, 0xC2C2BA, 1);
        var angle = i * 2 * Math.PI / 5
        var x = 200 + 100 * Math.cos(angle);
        var y = 350 + 100 * Math.sin(angle);
        magicBoxes[i].drawCircle(x + 25, y + 25, 30);
        stage.addChild(magicBoxes[i]);

        magicLogos[i].x = x;
        magicLogos[i].y = y;
        magicLogos[i].number = i;
        magicLogos[i].interactive = true;
        magicLogos[i].click = function(e) {
            if (!chosenElements[0]) {
                chosenElements[0] = e.target.type;
            } else if (!chosenElements[1] && chosenElements[0] !== e.target.type){
                chosenElements[1] = e.target.type;
            }
        };
        magicLogos[i].mouseover = function(e) {
            var num = e.target.number;
            hoverTextBox.beginFill(0xE9EAF2, 0.8);
            hoverTextBox.lineStyle(4, 0xE9EAF2, 1);
            hoverTextBox.drawRoundedRect(e.data.global.x, e.data.global.y, e.target.textboxSize[0], e.target.textboxSize[1], 4);
            hoverTextBox.visible = true;
            stage.addChild(hoverTextBox);

            hoverTexts[num].x = e.data.global.x + 5;
            hoverTexts[num].y = e.data.global.y + 5;
            hoverTexts[num].visible = true;
            stage.addChild(hoverTexts[num]);


        };
        magicLogos[i].mouseout = function(e) {
            var num = e.target.number;
            hoverTexts[num].visible = false;
            hoverTextBox.clear();
            hoverTextBox.visible = false;
        };
        stage.addChild(magicLogos[i]);

        hoverTextBox = new PIXI.Graphics();

        hoverTexts[i].visible = false;
    }

    // magicTexts[0].text = 'Fire';
    // magicTexts[1].text = 'Water';
    // magicTexts[2].text = 'Earth';
    // magicTexts[3].text = 'Air';
    // magicTexts[4].text = 'Life';

    for (i = 0; i < 2; i++){
        chosenElementBoxes[i] = new PIXI.Graphics();
        chosenElementBoxes[i].beginFill(0xC2C2BA, 0.7);
        chosenElementBoxes[i].lineStyle(4, 0xC2C2BA, 1);
        chosenElementBoxes[i].drawRoundedRect(525, i == 2 ? 340 : 300 + i * 75, 50, 50, 3);
        stage.addChild(chosenElementBoxes[i]);

        // chosenElementTexts[i] = new PIXI.Text('Element ' + (i + 1) + ':', {font: '20px Arial'});
        // chosenElementTexts[i].x = 470;
        // chosenElementTexts[i].y = 310 + i * 75;
        // stage.addChild(chosenElementTexts[i]);
    }

    function updateStartPage() {
        for (var i = 0; i < 2; i++){
            if(chosenElements[i] && !chosenCreated[i]){
                chosenElementIcons[i] = PIXI.Sprite.fromImage('../img/icons/' + chosenElements[i] + '_icon.png');
                chosenElementIcons[i].x = 524;
                chosenElementIcons[i].y = 300 + i * 75;
                chosenElementIcons[i].interactive = true;
                chosenElementIcons[i].number = i;

                chosenElementIcons[i].click = function(e) {
                    chosenElements[e.target.number] = false;
                    chosenCreated[e.target.number] = false;
                    stage.removeChild(e.target);
                    resetButton();
                };
                chosenCreated[i] = true;
                stage.addChild(chosenElementIcons[i]);
            }
        }

        if(chosenElements[0] && chosenElements[1]){
            startGameButton.clear();
            startGameButton.beginFill(0x0AC900, 0.8);
            startGameButton.lineStyle(4, 0x5AF752, 1);
            startGameButton.drawRoundedRect(400, 450, 300, 50, 5);
            startGameButton.interactive = true;
            startGameButton.click = function () {
                gameStarted = true;
            };
            stage.addChild(startGameButton);

            startGameText.text = 'Start Brawling';
            startGameText.x = 400 + (300 - startGameText.width) / 2;
            startGameText.y = 450 + (50 - startGameText.height) / 2;
            startGameText.alpha = 0.8;
            stage.addChild(startGameText);
        }
        if(!gameStarted){
            renderer.render(stage);
        } else {
            startGameText.text = 'Generating...';
            startGameText.x = 400 + (300 - startGameText.width) / 2;
            startGameText.y = 450 + (50 - startGameText.height) / 2;
            stage.addChild(startGameText);
            renderer.render(stage);

            window.setTimeout(function() {
                generateMap();
                ticker.remove(updateStartPage);
                gameStart();
            }, 0);
        }

    };
    ticker.add(updateStartPage);
}

function showHighScores() {
    var stage = new PIXI.Container();

    var highScoreText = new PIXI.Text('High Scores', {font: 'bold 60px Arial'});
    highScoreText.x = 200;
    highScoreText.y = 100;
    stage.addChild(highScoreText);

    var yourScore = new PIXI.Text('Your score: ' + score, {font: 'bold 40px Arial'});
    yourScore.x = 225;
    yourScore.y = 200;
    stage.addChild(yourScore);

    var restartText = new PIXI.Text('Click anywhere to restart', {font: '30px impact charcoal'});
    restartText.x = 225;
    restartText.y = 450;
    stage.addChild(restartText);

    stage.interactive = true;
    stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);
    stage.click = function(){
        gameOver = false;
        gameStarted = false;
        chosenElements = [false, false];
        chosenCreated = [false, false];
        score = 0;
        difficultyLevel = 0;
    };

    function updateHighScorePage() {
        if(gameOver){
            renderer.render(stage);
        } else {
            window.setTimeout(function() {
                ticker.remove(updateHighScorePage);
                showStartPage();
            }, 0)
        }
    };
    ticker.add(updateHighScorePage);
}
