function keyListener(keyCode) {
    this.code = keyCode;
    this.isDown = false;
    this.press = undefined;
    this.release = undefined;
    window.addEventListener("keydown", this.downHandler.bind(this), false);
    window.addEventListener("keyup", this.upHandler.bind(this), false);
}

keyListener.prototype.downHandler = function(event) {
    if (event.keyCode === this.code) {
        if (!this.isDown) {
            this.isDown = true;
            if (this.press) this.press();
        }
    }
    event.preventDefault();
};

keyListener.prototype.upHandler = function(event) {
    if (event.keyCode === this.code) {
        if (this.isDown) {
            this.isDown = false;
            if (this.release) this.release();
        }
    }
    event.preventDefault();
};
