"use strict";
function BuildingShape() {

    this.maxArea = 0;
}

BuildingShape.prototype.createShape = function (width, height) {
    console.error("Abstract method");
};

/**
 * Complexity of the shape to determine the minimum reasonable size.
 *
 * @return usually the number of vertices
 */
BuildingShape.prototype.getComplexity = function () {
    console.error("Abstract method");
};

BuildingShape.prototype.getProbability = function () {
    return 1;
};

BuildingShape.prototype.newShape = function (width, height) {
    return this.createShape(width, height);
};