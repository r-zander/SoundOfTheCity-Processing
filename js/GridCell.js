"use strict";
function GridCell(gridX, gridY, x, y) {
    this.x = x;
    this.y = y;

    this.gridX = gridX;
    this.gridY = gridY;

    this.block = null;

    /**
     * {@link CellState}
     */
    this.state = CellState.EMPTY;

    this.building = null;

    this.instrument = Sounds.INSTRUMENT_GRID.getInstrument(this);
}

GridCell.setup = function () {
    GridCell.DIAMETER = relativeX(20);

    GridCell.RADIUS = GridCell.DIAMETER / 2;
};


GridCell.prototype.xf = function () {
    return this.x;
};

GridCell.prototype.yf = function () {
    return this.y;
};

GridCell.prototype.draw = function () {
//        if (debug) {
//            noStroke();
//            switch (state) {
//                case CellState.EMPTY:
//                    break;
//                case CellState.STREET:
//                    fill(0xff0000ff);
//                    rect(xf(), yf(), DIAMETER, DIAMETER);
//                    break;
//                case CellState.BLOCKED:
//                    fill(128);
//                    rect(xf(), yf(), DIAMETER, DIAMETER);
//                    break;
//                default:
//                    break;
//            }
//
//            if (grid.pathFinderGraph.hasNode(id)) {
//                stroke(0xffff0000);
//                noFill();
//                line(xf(), yf(), xf() + DIAMETER, yf() + DIAMETER);
//                line(xf() + DIAMETER, yf(), xf(), yf() + DIAMETER);
//            }
//        }

    if (this.state == CellState.BUILT) {
        stroke(Colors.BACKGROUND);
        strokeWeight(Grid.WEIGHT);
        fill(Colors.BACKGROUND);
        rect(this.xf(), this.yf(), GridCell.DIAMETER, GridCell.DIAMETER);

        if (this.building != null) {
            if (this.block != null) {
                this.building.draw(this.block.getStrokeColor(), this.block.getFillColor());
            } else {
                this.building.draw();
            }
        }
    }
};

GridCell.prototype.isInside = function (v) {
    return (this.xf() <= v.x && (this.xf() + GridCell.DIAMETER) > v.x && this.yf() <= v.y && (this.yf() + GridCell.DIAMETER) > v.y);
};

GridCell.prototype.centerX = function () {
    return this.xf();
};

GridCell.prototype.toString = function () {
    return "GridCell (" + this.gridX + " / " + this.gridY + ")";
};

/**
 * Enum
 */
var CellState = {
    EMPTY: 0,
    BUILT: 1,
    STREET: 2,
    BLOCKED: 3
};