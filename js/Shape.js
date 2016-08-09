"use strict";
/**
 * Created by XieLong on 21.07.2016.
 */

function Shape(width, height, canBeRotated) {
    this.width = width;
    this.height = height;
    this.canBeRotated = defaultFor(canBeRotated, true);

    if (this.canBeRotated){
        this.rotationRandom = randomInt(0, 3);
    }
}

Shape.prototype.beforeDraw = function () {
    if (this.canBeRotated) {
        switch (this.rotationRandom) {
            case 1:
                translate(this.width, 0);
                break;
            case 2:
                translate(this.width, this.height);
                break;
            case 3:
                translate(0, this.height);
                break;
            default:
                break;
        }
        rotate(this.rotationRandom * HALF_PI);
    }
};