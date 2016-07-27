"use strict";
function Building(x, y, width, height) {
    this.buildingShape = BuildingShapeFactory.getRandomBuildingShape();
    this.padding = relativeX(3);

//        if (buildingShape.maxArea > 1) {
//            float sizeX = random(1) * random(1) * random(1) * buildingShape.maxArea;
//            this.sizeY = round(random(1) * buildingShape.maxArea / sizeX);
//            this.sizeX = round(sizeX);
//        } else {
    this.sizeX = 1;
    this.sizeY = 1;
//        }

    this.shape =
        this.buildingShape.newShape(width - (2 * this.padding / this.sizeX), height
            - (2 * this.padding / this.sizeY));
    // this.shape.scale(this.sizeX, this.sizeY);

    // width *= this.sizeX;
    // height *= this.sizeY;

    this.x = x + this.padding;
    this.y = y + this.padding;

    Building.BACKGROUND = lazyColor(Building.BACKGROUND);
    Building.STROKE = lazyColor(Building.STROKE);
}

Building.BACKGROUND = 'rgba(35, 43, 255, 0.37)';

Building.STROKE = 'rgb(120, 204, 255)';

Building.prototype.draw = function (strokeColor, backgroundColor) {
    backgroundColor = defaultFor(backgroundColor, Building.BACKGROUND);
    strokeColor = defaultFor(strokeColor, Building.STROKE);
    fill(backgroundColor);
    stroke(strokeColor);
    strokeWeight(1);
    // shape(this.shape, this.x, this.y);
    this.shape.drawAtPosition(this.x, this.y);
};
