"use strict";
function ColorAnimation(startColor, endColor, maxFrames) {
    this.currentFrame = 0;

    this.startColor = startColor;
    this.endColor = endColor;
    this.maxFrames = maxFrames;
}

ColorAnimation.prototype.step = function () {
    this.currentFrame++;
};

ColorAnimation.prototype.isValid = function () {
    return this.currentFrame <= this.maxFrames;
};

ColorAnimation.prototype.getColor = function () {
    return lerpColor(this.startColor, this.endColor, this.currentFrame / this.maxFrames);
};
