"use strict";
function Street(parameters) {
    this.id = ID();

    this.block = parameters.block;

    this.cells = this.nodesToCells(parameters.nodes);

    this.cells.forEach(function (cell) {
        cell.state = CellState.STREET;
    });

    this.nodes = this.findNodes(parameters.nodes);

    this.debugPath = parameters.debugPath;

    this.instrument = parameters.instrument;

    this.pattern = parameters.pattern;

    this.carSpeed = relativeX(5);

    switch (Config.carSpawnMode) {
        case CarSpawnMode.ALTERNATING:
            this.spawnCars = 2;
            break;
        case CarSpawnMode.ONE_SIDED:
            this.spawnCars = 2;
            break;
        default:
            this.spawnCars = 1;
            break;
    }

    this.forward = parameters.forward;

    this.radius = GridCell.DIAMETER;

    this.nodes.forEach(function (cell) {
        this.addPoint(cell.xf() + this.radius, cell.yf() + this.radius);
    }, this);


    var spawnCell;

    if (this.forward) {
        spawnCell = this.debugPath.get(DebugTitle.BLOCK_START).cell;
    } else {
        spawnCell = this.debugPath.get(DebugTitle.BLOCK_END).cell;
    }
    this.spawnPoint = createVector(spawnCell.xf(), spawnCell.yf());

    Sounds.onStreetCreation(this);
}

Street.prototype = new ShiffmanPath();

Street.prototype.nodesToCells = function (nodes) {
    var cells = [];

    nodes.forEach(function (node) {
        cells.push(grid.getCell(node.x, node.y));
    });

    return cells;
};

/**
 * Entferne alle überflüssigen nodes, die keine Ecken des Pfades sind.
 *
 * @param allNodes
 */
Street.prototype.findNodes = function (allNodes) {
    var nodes = [];

    var previousNode = allNodes[0];
    var previousAngle = -1;

    allNodes.slice(1, allNodes.length).forEach(function (node) {
        var angle =
            TwoDimensional.angleBetween(
                previousNode.x,
                previousNode.y,
                node.x,
                node.y);

        if (previousAngle != angle) {
            nodes.push(previousNode);
            previousAngle = angle;
        }

        previousNode = node;
    });

    // Add last cell definitely
    nodes.push(previousNode);

    return this.nodesToCells(nodes);
};

// Street.prototype.tickCarSpawn = function () {
//     var pattern;
//
//     if (breakPattern == null) {
//         pattern = this.pattern;
//     } else {
//         pattern = breakPattern.getPattern(this.instrument);
//     }
//
//     var returnVelocity = 0;
//     if (this.spawnCars > 0 && this.steps % pattern.tickDivider == 0) {
//         var velocity = pattern.getVelocity(this.patternSequenceIndex, this.forward);
//         if (velocity > 0) {
//             this.spawnCar(this.spawnPoint, this.forward);
//             returnVelocity = velocity;
//         }
//
//         this.patternSequenceIndex++;
//     }
//
//     this.steps++;
//     return returnVelocity;
// };

Street.prototype.onNote = function () {
    this.spawnCar(this.spawnPoint, this.forward);
    this.block.onCarSpawn();
};

Street.prototype.spawnCar = function (location, forward) {
    var car = new Car(location.x, location.y);
    car.pathFollowing = new BPathFollowing(this, forward, this.carSpeed);
    cars.push(car);
    particleCars[car.particle.id] = car;
};

Street.prototype.draw = function () {
    if (debug) {
        Object.keys(this.debugPath.debugCells).forEach(function (key) {
            this.debugPath.debugCells[key].draw();
        }, this);

        if (this.nodes.length == 0) {
            return;
        }

        colorMode(HSB);
        strokeWeight(3);

        var hue = 0;

        var previousNode = this.nodes[0];

        this.nodes.slice(1, this.nodes.length).forEach(function (node) {
            stroke(hue, 255, 255);
            line(previousNode.xf(), previousNode.yf(), node.xf(), node.yf());
            previousNode = node;
            hue += 3;
            hue %= 256;
        });

        colorMode(RGB);
    }
};

Street.prototype.disableCarSpawn = function () {
    if (this.spawnCars > 0) {
        this.spawnCars--;
    }
};

Street.prototype.destroy = function () {
    this.cells.forEach(function (cell) {
        cell.state = CellState.EMPTY;
    });
};

var DebugTitle = {
    BLOCK_CENTER: "Block Center",
    START: "Start",
    BLOCK_START: "Block Start",
    BLOCK_END: "Block End",
    END: "End"
};

function DebugCell(title, cell) {
    this.title = title;

    this.cell = cell;
}

DebugCell.prototype.draw = function () {
    noStroke();
    textAlign(RIGHT, BOTTOM);
    textSize(10);
    fill(255);
    text(this.title.toString(), this.cell.xf(), this.cell.yf());

    rectMode(CORNER);
    stroke(128);
    strokeWeight(Grid.WEIGHT);
    rect(this.cell.xf(), this.cell.yf(), GridCell.DIAMETER, GridCell.DIAMETER);
};