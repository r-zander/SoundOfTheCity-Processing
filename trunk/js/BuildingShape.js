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

BuildingShape.prototype.canBeRotated = function () {
    return true;
};

BuildingShape.prototype.newShape = function (width, height) {
    var shape = this.createShape(width, height);

    if (this.canBeRotated()) {
        var random = randomInt(0, 3);
        switch (random) {
            case 1:
                shape.translate(width, 0);
                break;
            case 2:
                shape.translate(width, height);
                break;
            case 3:
                shape.translate(0, height);
                break;
            default:
                break;
        }
        shape.rotate(random * HALF_PI);
    }

    return shape;
};