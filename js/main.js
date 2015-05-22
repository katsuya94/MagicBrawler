function CustomAnimation(animations) {
    PIXI.extras.MovieClip.call(this, animations[0]);
    this._animations = animations;
}

CustomAnimation.prototype = Object.create(PIXI.extras.MovieClip.prototype);
CustomAnimation.prototype.constructor = CustomAnimation;

CustomAnimation.prototype.playAnimation = function(id) {
    this._textures = this._animations[id];
    this.gotoAndPlay(0);
}

var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.getElementById('wrapper').appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader.add('./img/player.json').add('./img/terrain.json').load(onAssetsLoaded);

function onAssetsLoaded() {
    var tiles = [];
    for (var id = 0; id < 150; id++)
        tiles.push(PIXI.Texture.fromFrame('terrain' + id + '.png'));
    var bg = new PIXI.Container();
    for (var id = 0; id < 150; id++) {
        var tile = PIXI.Sprite.fromFrame('terrain' + id + '.png');
        tile.x = (id * 32) % 800;
        tile.y = Math.floor(id / 16) * 32;
        bg.addChild(tile);
    }
    stage.addChild(bg);

    var frames = [];
    for (var id = 0; id < 256; id++)
        frames.push(PIXI.Texture.fromFrame('player' + id + '.png'));
    var animations = [];
    for (var i = 0; i < 8; i++) {
        animation = [];
        for (var j = 0; j < 8; j++) {
            animation.push(frames[i * 32 + 4 + j]);
        }
        animations.push(animation);
    }
    var player = new CustomAnimation(animations);
    player.animationSpeed = 0.15;
    player.play();
    stage.addChild(player);

    tick();
}

function tick() {
    requestAnimationFrame(tick);

    for (var i = 0; i < stage.children.length; i++)
        if (stage.children[i].animate !== undefined)
            stage.children[i].animate();

    renderer.render(stage);
}
