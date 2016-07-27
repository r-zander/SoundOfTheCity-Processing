"use strict";
/**
 * Created by XieLong on 21.07.2016.
 */

function Shape() {
}

Shape.prototype.drawAtPosition = function (x, y) {
    push();
    translate(x, y);
    this.draw();
    pop();
};

Shape.prototype.draw = function () {
    throw "Not implemented!";
};