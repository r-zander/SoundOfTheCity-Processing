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

    this.primary = parameters.primary;

    this.radius = GridCell.DIAMETER;

    var spawnCell;

    if (this.primary) {
        spawnCell = this.debugPath.get(DebugTitle.BLOCK_START).cell;
    } else {
        spawnCell = this.debugPath.get(DebugTitle.BLOCK_END).cell;
    }
    this.spawnPoint = createVector(spawnCell.xf(), spawnCell.yf());

    Sounds.onStreetCreation(this);

    streets.push(this);
}

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

Street.prototype.getPoint = function (index) {
    /*
     * FIXME: why does it even occur? No good solution but at least the program doesn't crash.
     */
    if ((index < 0) || (index >= this.nodes.length)) {
        return null;
    }
    var node = this.nodes[index];
    return createVector(node.xf(), node.yf());
};

Street.prototype.length = function () {
    return this.nodes.length;
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
//         var velocity = pattern.getVelocity(this.patternSequenceIndex, this.primary);
//         if (velocity > 0) {
//             this.spawnCar(this.spawnPoint, this.primary);
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
    this.spawnCar(this.spawnPoint, this.primary);
    this.block.onCarSpawn();
};

Street.prototype.spawnCar = function (location, primary) {
    var car = new Car(location.x, location.y);
    car.pathFollowing = new BPathFollowing(this, primary, this.carSpeed);
    cars.push(car);
    particleCars[car.particle.id] = car;
};

Street.prototype.draw = function () {
    if (debug && this.nodes.length > 0) {
        strokeWeight(Grid.WEIGHT * 6);
        stroke(this.block.streetColor);

        var previousNode = this.nodes[0];
        this.nodes.slice(1, this.nodes.length).forEach(function (node) {
            line(previousNode.xf() + GridCell.RADIUS, previousNode.yf() + GridCell.RADIUS, node.xf() + GridCell.RADIUS, node.yf() + GridCell.RADIUS);
            previousNode = node;
        });

        // noStroke();
        // if (this.primary) {
        //     fill(255, 0, 0);
        // } else {
        //     fill(0, 196, 0);
        // }
        // this.cells.forEach(function (cell) {
        //     if (this.primary) {
        //         triangle(
        //             cell.xf() + GridCell.DIAMETER, cell.yf(),
        //             cell.xf() + GridCell.DIAMETER, cell.yf() + GridCell.DIAMETER,
        //             cell.xf(), cell.yf() + GridCell.DIAMETER
        //         );
        //     } else {
        //         triangle(
        //             cell.xf() + GridCell.DIAMETER, cell.yf(),
        //             cell.xf(), cell.yf(),
        //             cell.xf(), cell.yf() + GridCell.DIAMETER
        //         );
        //     }
        // }, this);
    }
};

Street.prototype.drawStations = function () {
    if (debug) {
        Object.keys(this.debugPath.debugCells).forEach(function (key) {
            this.debugPath.debugCells[key].draw();
        }, this);
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

    Sounds.onStreetRemoval(this);

    streets.slice( streets.indexOf(this), 1);
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

    ellipseMode(CORNER);
    stroke(128);
    strokeWeight(Grid.WEIGHT);
    ellipse(this.cell.xf(), this.cell.yf(), GridCell.DIAMETER, GridCell.DIAMETER);
};