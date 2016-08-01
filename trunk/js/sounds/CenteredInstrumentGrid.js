"use strict";
function CenteredInstrumentGrid() {

    this.centerX = width / 2;
    this.centerY = height / 2;
}

CenteredInstrumentGrid.BOTTOM_RIGHT_OUTER = Instrument.SYNTH2;

CenteredInstrumentGrid.BOTTOM_RIGHT_INNER = Instrument.SNARE;

CenteredInstrumentGrid.TOP_RIGHT_OUTER = Instrument.HAT2;

CenteredInstrumentGrid.TOP_RIGHT_INNER = Instrument.BASS;

CenteredInstrumentGrid.BOTTOM_LEFT_OUTER = Instrument.PERCUSSION;

CenteredInstrumentGrid.BOTTOM_LEFT_INNER = Instrument.SYNTH1;

CenteredInstrumentGrid.TOP_LEFT_OUTER = Instrument.HAT1;

CenteredInstrumentGrid.TOP_LEFT_INNER = Instrument.KICK;

CenteredInstrumentGrid.grid = [
    [
        CenteredInstrumentGrid.TOP_LEFT_OUTER,
        CenteredInstrumentGrid.TOP_LEFT_INNER,
        CenteredInstrumentGrid.TOP_RIGHT_INNER,
        CenteredInstrumentGrid.TOP_RIGHT_OUTER
    ],
    [
        CenteredInstrumentGrid.BOTTOM_LEFT_OUTER,
        CenteredInstrumentGrid.BOTTOM_LEFT_INNER,
        CenteredInstrumentGrid.BOTTOM_RIGHT_INNER,
        CenteredInstrumentGrid.BOTTOM_RIGHT_OUTER
    ]
];


CenteredInstrumentGrid.prototype.getInstrument = function (cell) {
    var gridArea = width * height;
    var innerGridDiameter = sqrt(gridArea / 8);
    innerGridDiameter *= 0.9;
    var instrument;

    if (cell.xf() < this.centerX) {
        if (cell.yf() < this.centerY) {
            /*
             * Top Left
             */
            if (cell.xf() > (this.centerX - innerGridDiameter)
                && cell.yf() > (this.centerY - innerGridDiameter)) {
                /*
                 * Inner
                 */
                instrument = CenteredInstrumentGrid.TOP_LEFT_INNER;
            } else {
                instrument = CenteredInstrumentGrid.TOP_LEFT_OUTER;
            }
        } else {
            /*
             * Bottom Left
             */
            if (cell.xf() > (this.centerX - innerGridDiameter)
                && cell.yf() < (this.centerY + innerGridDiameter)) {
                /*
                 * Inner
                 */
                instrument = CenteredInstrumentGrid.BOTTOM_LEFT_INNER;
            } else {
                instrument = CenteredInstrumentGrid.BOTTOM_LEFT_OUTER;
            }
        }
    } else {
        if (cell.yf() < this.centerY) {
            /*
             * Top Right
             */
            if (cell.xf() < (this.centerX + innerGridDiameter)
                && cell.yf() > (this.centerY - innerGridDiameter)) {
                /*
                 * Inner
                 */
                instrument = CenteredInstrumentGrid.TOP_RIGHT_INNER;
            } else {
                instrument = CenteredInstrumentGrid.TOP_RIGHT_OUTER;
            }
        } else {
            /*
             * Bottom Right
             */
            if (cell.xf() < (this.centerX + innerGridDiameter)
                && cell.yf() < (this.centerY + innerGridDiameter)) {
                /*
                 * Inner
                 */
                instrument = CenteredInstrumentGrid.BOTTOM_RIGHT_INNER;
            } else {
                instrument = CenteredInstrumentGrid.BOTTOM_RIGHT_OUTER;
            }
        }
    }

    return instrument;
};

CenteredInstrumentGrid.prototype.draw = function () {
    // noFill();
    strokeWeight(Grid.WEIGHT);
    noStroke(Colors.BACKGROUND);
    grid.forEachCell(function (cell) {
        // stroke(cell.instrument.color);
        fill(cell.instrument.backgroundColor);
        rect(cell.xf(), cell.yf(), GridCell.DIAMETER, GridCell.DIAMETER);
    });

    textSize(relativeY(30));
    fill(Car.COLOR);

    for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 2; y++) {
            text(
                CenteredInstrumentGrid.grid[y][x].toString,
                width / 8 + width / 4 * x,
                height / 4 + height / 2 * y);
        }
    }
};