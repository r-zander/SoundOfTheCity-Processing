"use strict";
function Triangle(x1, y1, x2, y2, x3, y3) {

    this.v1 = createVector(x1, y1);
    this.v2 = createVector(x2, y2);
    this.v3 = createVector(x3, y3);
}

Triangle.prototype.sign = function (p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

Triangle.prototype.contains = function (x, y) {
    var b1, b2, b3;

    var p = createVector(x, y);

    b1 = this.sign(p, this.v1, this.v2) < 0.0;
    b2 = this.sign(p, this.v2, this.v3) < 0.0;
    b3 = this.sign(p, this.v3, this.v1) < 0.0;

    return ((b1 == b2) && (b2 == b3));
};

Triangle.prototype.draw = function () {
    triangle(this.v1.x, this.v1.y, this.v2.x, this.v2.y, this.v3.x, this.v3.y);
};
