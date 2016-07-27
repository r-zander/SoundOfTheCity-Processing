"use strict";
/**
 * Singleton!
 * @constructor
 */
function BuildingShapeFactory() {

    this.knownShapes = [];

    this.totalSum = 0;

    this.minComplexity = Number.MAX_VALUE;

    this.maxComplexity = 0;

    this.add = function (buildingShape) {
        this.knownShapes.push(buildingShape);
    };

    this.getRandomBuildingShapeInternal = function () {
        // http://stackoverflow.com/a/9330493
        var index = randomInt(this.totalSum) + 1;
        var sum = 0;
        var i = 0;
        while (sum < index) {
            var item = this.knownShapes[i++];
            sum += item.getProbability();
        }
        return this.knownShapes[i - 1];
    };


    var buildingShape;
    /*
     * Einfaches Rechteck
     * +-+
     * | |
     * +-+
     */
    buildingShape = new BuildingShape();
    buildingShape.createShape = function (width, height) {
        var shape = new Shape();
        shape.draw = function () {
            rect(0, 0, width, height);
        };
        return shape;
    };
    buildingShape.canBeRotated = function () {
        return false;
    };
    buildingShape.getComplexity = function () {
        return 4;
    };
    this.add(buildingShape);

    /*
     * Rechteck mit einbuchteter Ecke
     * +--+
     * + ++
     * +-+
     */
    buildingShape = new BuildingShape();
    buildingShape.createShape = function (width, height) {
        var shape = new Shape();
        shape.draw = function () {
            beginShape();
            vertex(0, 0);
            vertex(width, 0);
            vertex(width, height);
            var notchWidth = width * random(0.1, 0.7);
            vertex(notchWidth, height);
            var notchHeight = height * random(0.3, 0.9);
            vertex(notchWidth, notchHeight);
            vertex(0, notchHeight);
            endShape(CLOSE);
        };
        return shape;
    };
    buildingShape.getComplexity = function () {
        return 6;
    };
    this.add(buildingShape);

    /*
     * Viereck mit schräger Kante
     * +--+
     * + /
     * +/
     */
    buildingShape = new BuildingShape();
    buildingShape.createShape = function (width, height) {
        var shape = new Shape();
        shape.draw = function () {
            beginShape();
            vertex(0, 0);
            vertex(width, 0);
            var mainWidth = width * random(0.5, 0.9);
            vertex(mainWidth, height);
            vertex(0, height);
            endShape(CLOSE);
        };
        return shape;
    };
    buildingShape.getComplexity = function () {
        return 4;
    };
    this.add(buildingShape);

    /*
     * Viereck mit Spitze am Rand
     * +--/
     * + +
     * +-+
     */
    buildingShape = new BuildingShape();
    buildingShape.createShape = function (width, height) {
        var shape = new Shape();
        shape.draw = function () {
            beginShape();
            vertex(0, 0);
            vertex(width, 0);
            var mainWidth = width * random(0.5, 0.9);
            var mainHeight = height * random(0.5, 0.8);
            vertex(mainWidth, height - mainHeight);
            vertex(mainWidth, height);
            vertex(0, height);
            endShape(CLOSE);
        };
        return shape;
    };
    buildingShape.getComplexity = function () {
        return 5;
    };
    this.add(buildingShape);

    /*
     * Viereck mit Spitze auf Kante
     * +-+
     * + >
     * +-+
     */
    buildingShape = new BuildingShape();
    buildingShape.createShape = function (width, height) {
        var shape = new Shape();
        shape.draw = function () {
            beginShape();
            vertex(0, 0);
            var mainWidth = width * random(0.5, 0.9);
            vertex(mainWidth, 0);

            var peakOffset = height * random(0.2, 0.3);
            vertex(mainWidth, peakOffset);

            var peakHeight = height * random(0.2, 0.5);
            vertex(width, peakOffset + peakHeight / 2);
            vertex(mainWidth, peakOffset + peakHeight);

            vertex(mainWidth, height);
            vertex(0, height);
            endShape(CLOSE);
        };
        return shape;
    };
    buildingShape.getComplexity = function () {
        return 7;
    };
    this.add(buildingShape);

    /*
     * Zwei Vierecke
     */
    buildingShape = new BuildingShape();
    buildingShape.createShape = function (width, height) {
        var shape = new Shape();
        shape.draw = function () {
            var firstHeight = height * random(0.3, 0.7);
            var distance = height * random(0.1, 0.3);
            rect(0, 0, width, firstHeight - distance);
            rect(0, firstHeight, width, height - firstHeight);
        };
        return shape;
    };
    buildingShape.getComplexity = function () {
        return 8;
    };
    this.add(buildingShape);


    this.knownShapes.forEach(function (shape) {
        BuildingShapeFactory.totalSum += shape.getProbability();
        if (shape.getComplexity() < this.minComplexity) {
            this.minComplexity = shape.getComplexity();
        }
        if (shape.getComplexity() > this.maxComplexity) {
            this.maxComplexity = shape.getComplexity();
        }
    }, this);

    this.knownShapes.forEach(function (shape) {
        shape.maxArea = map(shape.getComplexity(), this.minComplexity, this.maxComplexity, 1, 8);
    }, this);

}

var BuildingShapeFactory_INSTANCE = null;

BuildingShapeFactory.getRandomBuildingShape = function () {
    if (BuildingShapeFactory_INSTANCE == null){
        BuildingShapeFactory_INSTANCE = new BuildingShapeFactory();
    }
    return BuildingShapeFactory_INSTANCE.getRandomBuildingShapeInternal();
};