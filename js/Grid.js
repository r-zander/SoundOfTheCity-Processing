"use strict";
function Grid() {


    this.blocks = new SortedBlocks();

    this.currentBlock = new Block(this);

    this.maxGridX = Math.ceil(width / GridCell.DIAMETER) + 1;
    this.maxGridY = Math.ceil(height / GridCell.DIAMETER) + 1;

    this.cellGrid = new Array(this.maxGridX);

    for (var gridX = 0; gridX < this.maxGridX; gridX++) {
        this.cellGrid[gridX] = new Array(this.maxGridY);
        for (var gridY = 0; gridY < this.maxGridY; gridY++) {
            this.cellGrid[gridX][gridY] =
                new GridCell(gridX, gridY, this.getX(gridX), this.getY(gridY));
        }
    }

    this.pathFinderGraph = [];

    /*
     * Set up path finding grid. Unfortunately it is exactly transposed as the cell grid
     */
    for (gridY = 0; gridY < this.maxGridY; gridY++) {
        this.pathFinderGraph[gridY] = new Array(this.maxGridX);
        for (gridX = 0; gridX < this.maxGridX; gridX++) {
            this.addCellToPathfinding(this.getCell(gridX, gridY));
        }
    }

    this.pathFinder = ConstructionMode.pathFinding.newPathFinder(this.pathFinderGraph);


    Grid.COLOR = lazyColor(Grid.COLOR);
    Grid.ALTERNATIVE_COLOR = lazyColor(Grid.ALTERNATIVE_COLOR);
}

Grid.COLOR = '#770078';

Grid.ALTERNATIVE_COLOR = '#CC4045';

Grid.WEIGHT = 1;

// Grid.prototype.onTick = function (currentTick) {
//     this.blocks.forEach(function (block) {
//         block.onTick(currentTick);
//     });
// };

Grid.prototype.draw = function () {
    if (debug) {
        Sounds.INSTRUMENT_GRID.draw();
    } else {
        this.drawGrid();
    }

    this.forEachCell(function (cell) {
        cell.draw();
    });

    this.blocks.forEach(function (block) {
        block.draw();
    });

    this.blocks.forEach(function (block) {
        block.onAfterDraw();
    });
};

Grid.prototype.drawGrid = function () {
    if (breakPattern == null) {
        stroke(Grid.COLOR);
    } else {
        stroke(Grid.ALTERNATIVE_COLOR);
    }
    strokeWeight(Grid.WEIGHT);

    for (var x = GridCell.RADIUS; x < width; x += GridCell.DIAMETER) {
        line(x, 0, x, height);
    }

    for (var y = GridCell.RADIUS; y < height; y += GridCell.DIAMETER) {
        line(0, y, width, y);
    }
};

/*
 * TODO use appropriate GridCell method centerX/Y
 */
Grid.prototype.getX = function (gridX) {
    return GridCell.RADIUS + gridX * GridCell.DIAMETER;
};

Grid.prototype.getY = function (gridY) {
    return GridCell.RADIUS + gridY * GridCell.DIAMETER;
};

Grid.prototype.getGridX = function (x) {
    return (int)(x / GridCell.DIAMETER);
};

Grid.prototype.getGridY = function (y) {
    return (int)(y / GridCell.DIAMETER);
};

Grid.prototype.getCell = function (x, y) {
    if (isInteger(x) && isInteger(y)) {
        return this.cellGrid[x][y];
    } else {
        return this.cellGrid[this.getGridX(x)][this.getGridY(y)];
    }
};

Grid.prototype.isState = function (gridX, gridY, state) {
    return state == this.cellGrid[gridX][gridY].state;
};

Grid.prototype.changeState = function (gridX, gridY, newState) {
    var x = this.getX(gridX);
    var y = this.getY(gridY);

    var cell = this.cellGrid[gridX][gridY];

    switch (newState) {
        case CellState.BUILT:
            if (random(1) <= (1 - ConstructionMode.get().density)) {
                newState = CellState.BLOCKED;
                this.currentBlock.add(cell);
            } else {
                cell.building =
                    new Building(x, y, GridCell.DIAMETER, GridCell.DIAMETER);
                this.currentBlock.add(cell);
            }
            break;
        case CellState.EMPTY:
            if (cell.block != null) {
                cell.block.remove(cell);
            }
            break;
        default:
    }

    cell.state = newState;
};

/**
 * Schließt den momentanen Häuserblock ab und erzeugt eine Straße dazu.
 */
Grid.prototype.finishBlock = function () {
    if (this.currentBlock.isEmpty()) {
        return;
    }

    /*
     * Run the complex finish process in own thread.
     */
//        Thread later = new Thread() {
//
//            private Block block = currentBlock;
//
//            @Override
//            public void run() {
//                block.finish();
//            }
//        };
//        later.start();
    this.currentBlock.finish();

    /*
     * Reset current block
     */
    this.currentBlock = new Block(this);
};

Grid.prototype.findPath = function (fromCell, toCell) {
    var result = null;
    this.pathFinder.findPath(fromCell.gridX, fromCell.gridY, toCell.gridX, toCell.gridY, function (path) {
        result = path;
    });
    this.pathFinder.calculate();

    //noinspection JSUnusedAssignment
    if (result === null) {
        result = [];
    }

    return result;
};

Grid.prototype.getMaxGridX = function () {
    return this.cellGrid.length;
};

Grid.prototype.getMaxGridY = function () {
    return this.cellGrid[0].length;
};

Grid.prototype.addCellToPathfinding = function (cell) {
    this.pathFinderGraph[cell.gridY][cell.gridX] = 1;
};

Grid.prototype.removeCellFromPathfinding = function (cell) {
    if (ConstructionMode.streetsCanReplaceBuildings == false) {
        this.pathFinderGraph[cell.gridY][cell.gridX] = 0;
    }
};

Grid.prototype.forEachCell = function (callback) {
    this.cellGrid.forEach(function (column) {
        column.forEach(callback);
    });
};