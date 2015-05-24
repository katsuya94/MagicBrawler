function CustomAnimation(animations) {
    PIXI.extras.MovieClip.call(this, animations[0]);
    this._animations = animations;
}

CustomAnimation.prototype = Object.create(PIXI.extras.MovieClip.prototype);
CustomAnimation.prototype.constructor = CustomAnimation;

CustomAnimation.prototype.playAnimation = function(id, frameNumber) {
    this._textures = this._animations[id];
    if (frameNumber !== undefined) {
        this.gotoAndPlay(frameNumber);
    }
}
