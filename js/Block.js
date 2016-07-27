"use strict";
function Block() {

    this.cells = [];

    this.centerCell = null;

    this.forwardStreet = null;

    this.backwardStreet = null;

    this.numberOfStreets = 0;

    this.availableDirections = null;

    this.tickEnabled = false;

    this.instrument = null;

    this.intensity = null;

    this.pattern = null;

    this.strokeColorAnimation = null;

    this.fillColorAnimation = null;
}

Block.prototype.add = function (cell) {
    this.cells.push(cell);
};

Block.prototype.remove = function (cell) {
    removeElement(this.cells, cell);
    cell.block = null;
    grid.addCellToPathfinding(cell);

    if (this.hasBuildings() == false) {
        this.destroy();
    }
};

Block.prototype.hasBuildings = function () {
    return this.cells.some(function (cell) {
        if (cell.state == CellState.BUILT) {
            return true;
        }
    });
};

Block.prototype.isEmpty = function () {
    return this.cells.length === 0;
};

Block.prototype.getSize = function () {
    return this.cells.length;
};

Block.prototype.getPattern = function () {
    if (breakPattern != null) {
        return breakPattern.getPattern(this.instrument);
    }
    return this.pattern;
};

Block.prototype.destroy = function () {
    grid.blocks.remove(this);

    if (this.forwardStreet != null) {
        this.forwardStreet.destroy();
    }

    if (this.backwardStreet != null) {
        this.backwardStreet.destroy();
    }

    this.cells.forEach(function (cell) {
        cell.block = null;
        cell.state = CellState.EMPTY;
        grid.addCellToPathfinding(cell);
    });
};

Block.prototype.getNumberOfStreets = function () {
    return this.numberOfStreets;
};

Block.prototype.getInstrument = function () {
    return this.instrument;
};
Block.prototype.getIntensity = function () {
    return this.intensity;
};

Block.prototype.setNumberOfStreets = function (numberOfStreets) {
    var oldValue = this.numberOfStreets;
    this.numberOfStreets = numberOfStreets;
    grid.blocks.update(this, oldValue);
};

Block.prototype.finish = function () {
    /*
     * Find center of block
     */
    this.minGridX = grid.getMaxGridX();
    this.maxGridX = 0;
    this.minGridY = grid.getMaxGridY();
    this.maxGridY = 0;

    var self = this;

    this.cells.forEach(function (cell) {
        if (cell.gridX < self.minGridX) {
            self.minGridX = cell.gridX;
        }
        if (cell.gridX > self.maxGridX) {
            self.maxGridX = cell.gridX;
        }
        if (cell.gridY < self.minGridY) {
            self.minGridY = cell.gridY;
        }
        if (cell.gridY > self.maxGridY) {
            self.maxGridY = cell.gridY;
        }

        /*
         * Register this block as "parent"
         */
        cell.block = self;

        grid.removeCellFromPathfinding(cell);
    });

    var debugPath = new DebugPath();

    this.centerCell = grid.getCell(
        floor((this.minGridX + this.maxGridX) / 2),
        floor((this.minGridY + this.maxGridY) / 2));
    debugPath.add(new DebugCell(DebugTitle.BLOCK_CENTER, this.centerCell));

    Sounds.onBlockCreation(this);

    this.availableDirections = new RandomEnumSet(Direction);
    this.availableDirections.newSet = function () {
        return self.checkForBlockedDirections(RandomEnumSet.prototype.newSet.call(this));
    };

    if (this.availableDirections.isEmpty() == false) {
        /*
         * Get a local copy to track a local random set (e.g don't connect to
         * the same block twice)
         */
        var localBlocks = new SortedBlocks(grid.blocks);

        var cellPair = this.findCellsOnSide(localBlocks, this.availableDirections.pickOne());
        var startCell = cellPair.cell1;
        var blockStartCell = cellPair.cell2;

        debugPath.add(new DebugCell(DebugTitle.START, startCell));
        debugPath.add(new DebugCell(DebugTitle.BLOCK_START, blockStartCell));

        var streetNodes = grid.findPath(blockStartCell, startCell);

        /*
         * Only create streets were actually a path could have been found.
         */
        if (streetNodes.length > 0) {
            this.forwardStreet = new Street({
                block: this,
                nodes: streetNodes,
                debugPath: debugPath,
                forward: true,
                pattern: this.pattern,
                instrument: this.instrument
            });
            this.numberOfStreets++;
        }


        cellPair = this.findCellsOnSide(localBlocks, this.availableDirections.pickOne());
        var endCell = cellPair.cell1;
        var blockEndCell = cellPair.cell2;

        debugPath.add(new DebugCell(DebugTitle.BLOCK_END, blockEndCell));
        debugPath.add(new DebugCell(DebugTitle.END, endCell));

        streetNodes = grid.findPath(endCell, blockEndCell);

        /*
         * Only create streets were actually a path could have been found.
         */
        if (streetNodes.length > 0) {
            this.backwardStreet = new Street({
                block: this,
                nodes: streetNodes,
                debugPath: debugPath,
                forward: false,
                pattern: this.pattern,
                instrument: this.instrument
            });
            this.numberOfStreets++;
        }
    }

    grid.blocks.add(this);
};


/**
 * Removes all directions from the set that are outside the grid.
 *
 * @param set
 */
Block.prototype.checkForBlockedDirections = function (set) {

    if (this.minGridY <= 0) {
        removeElement(set, Direction.TOP);
        this.numberOfStreets++;
    }

    if ((this.maxGridX + 1) >= grid.getMaxGridX()) {
        removeElement(set, Direction.RIGHT);
        this.numberOfStreets++;
    }

    if ((this.maxGridY + 1) >= grid.getMaxGridY()) {
        removeElement(set, Direction.BOTTOM);
        this.numberOfStreets++;
    }

    if (this.minGridX <= 0) {
        removeElement(set, Direction.LEFT);
        this.numberOfStreets++;
    }

    return set;
};

Block.prototype.findCellsOnSide = function (localBlocks, side) {
    var result = new CellPair();
    result.cell1 = this.findOppositeCell(localBlocks, side);
    result.cell2 = this.getCell(side);
    return result;
};

Block.prototype.findOppositeCell = function (localBlocks, side) {
    if (localBlocks.isEmpty()) {
        return this.findGridCell(side);
    }

    var otherBlock = localBlocks.first();

    if (otherBlock != null) {
        /*
         * The found block has free slots.
         */
        return this.createConnectionToOtherBlock(otherBlock, localBlocks);
    } else {
        /*
         * No block with free slots found, so it will be 50/50 if one of the
         * least trafficked blocks gets another route or a grid edge.
         */
        if (randomInt(1) == 0) {
            /*
             * Grid edge
             */
            return this.findGridCell(side);
        } else {
            /*
             * Find block
             */
            otherBlock = localBlocks.getRandomFullBlock();
            return this.createConnectionToOtherBlock(otherBlock, localBlocks);
        }
    }
};

Block.prototype.createConnectionToOtherBlock = function (otherBlock, localBlocks) {
    localBlocks.remove(otherBlock);
    otherBlock.setNumberOfStreets(otherBlock.getNumberOfStreets() + 1);
    return otherBlock.getCell(otherBlock.availableDirections.pickOne());
};

Block.prototype.findGridCell = function (side) {
    switch (side) {
        case Direction.TOP:
            return grid.cellGrid
                [randomInt(0, grid.getMaxGridX() - 1)]
                [0];
        case Direction.RIGHT:
            return grid.cellGrid
                [grid.getMaxGridX() - 1]
                [randomInt(0, grid.getMaxGridY() - 1)];
        case Direction.BOTTOM:
            return grid.cellGrid
                [randomInt(0, grid.getMaxGridX() - 1)]
                [grid.getMaxGridY() - 1];
        case Direction.LEFT:
            return grid.cellGrid
                [0]
                [randomInt(0, grid.getMaxGridY() - 1)];
    }
    return null;
};

Block.prototype.getCell = function (side) {
    switch (side) {
        case Direction.TOP:
            return grid.getCell(this.centerCell.gridX, this.minGridY - 1);
        case Direction.BOTTOM:
            return grid.getCell(this.centerCell.gridX, this.maxGridY + 1);
        case Direction.RIGHT:
            return grid.getCell(this.maxGridX + 1, this.centerCell.gridY);
        case Direction.LEFT:
            return grid.getCell(this.minGridX - 1, this.centerCell.gridY);
    }
    return null;
};

Block.prototype.draw = function () {
    if (this.forwardStreet != null) {
        this.forwardStreet.draw();
    }
    if (this.backwardStreet != null) {
        this.backwardStreet.draw();
    }
    if (this.strokeColorAnimation != null) {
        this.strokeColorAnimation.step();
    }
    if (this.fillColorAnimation != null) {
        this.fillColorAnimation.step();
    }
};

// Block.prototype.onTick = function (currentTick) {
//     var velocity;
//     if (this.tickEnabled) {
//         if (this.forwardStreet != null) {
//             velocity = this.forwardStreet.tickCarSpawn(currentTick);
//             if (velocity > 0) {
//                 this.onCarSpawn(velocity, true);
//             }
//         }
//         if (this.backwardStreet != null) {
//             velocity = this.backwardStreet.tickCarSpawn(currentTick);
//             if (velocity > 0) {
//                 this.onCarSpawn(velocity, false);
//             }
//         }
//     } else {
//         if (currentTick % Config.get().globalTickDivider() == 0) {
//             this.tickEnabled = true;
//         }
//     }
// };

Block.prototype.onCarSpawn = function () {
    this.strokeColorAnimation = new ColorAnimation(this.instrument.color, Building.STROKE, 15);
    this.fillColorAnimation =
        new ColorAnimation(this.instrument.color, Building.BACKGROUND, 15);
};

Block.prototype.getStrokeColor = function () {
    if (this.strokeColorAnimation != null && this.strokeColorAnimation.isValid()) {
        return this.strokeColorAnimation.getColor();
    }
    return Building.STROKE;
};

Block.prototype.getFillColor = function () {
    if (this.fillColorAnimation != null && this.fillColorAnimation.isValid()) {
        return this.fillColorAnimation.getColor();
    }
    return Building.BACKGROUND;
};

function CellPair() {

    this.cell1 = null;

    this.cell2 = null;
}

CellPair.prototype.toString = function () {
    return "CellPair(" + this.cell1 + ", " + this.cell2 + ")";
};