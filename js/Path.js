"use strict";
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following

function ShiffmanPath() {

    // A ShiffmanPath is an arraylist of points (PVector objects)
    this.points = [];

    // A path has a radius, i.e how far is it ok for the boid to wander off
    this.radius = GridCell.DIAMETER;
}


// Add a point to the path
ShiffmanPath.prototype.addPoint = function (x, y) {
    var point = createVector(x, y);
    this.points.push(point);
};

ShiffmanPath.prototype.getPoint = function (index) {
    /*
     * FIXME: why does it even occur? No good solution but at least the program doesn't crash.
     */
    if ((index < 0) || (index >= this.points.length)) {
        return null;
    }
    return this.points[index];
};

ShiffmanPath.prototype.length = function () {
    return this.points.length;
};

// Draw the path
ShiffmanPath.prototype.draw = function () {
    strokeJoin(ROUND);

    // Draw thick line for radius
    stroke(175);
    strokeWeight(this.radius * 2);
    noFill();
    beginShape();
    this.points.forEach(function (v) {
        vertex(v.x, v.y);
    });
    endShape(CLOSE);
    // Draw thin line for center of path
    stroke(0);
    strokeWeight(1);
    noFill();
    beginShape();
    this.points.forEach(function (v) {
        vertex(v.x, v.y);
    });
    endShape(CLOSE);
};