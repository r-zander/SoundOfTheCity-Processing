"use strict";
function DebugPath() {
    this.debugCells = {};
}

DebugPath.prototype.add = function (debugCell) {
    this.debugCells[debugCell.title] = debugCell;
};

DebugPath.prototype.get = function (debugTitle) {
    return this.debugCells[debugTitle];
};

DebugPath.prototype.values = function () {
    return this.debugCells;
};