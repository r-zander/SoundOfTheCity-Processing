"use strict";
function SortedBlocks(sortedBlocks) {

    this.sorted = new Array(this.DIRECTION_COUNT + 1);

    if (sortedBlocks !== undefined) {
        this.all = sortedBlocks.all.slice();

        for (var i = 0; i < this.sorted.length; i++) {
            this.sorted[i] = sortedBlocks.sorted[i].slice();
        }
    } else {
        this.all = [];

        for (var j = 0; j < this.sorted.length; j++) {
            this.sorted[j] = [];
        }
    }
}

SortedBlocks.prototype.DIRECTION_COUNT = Object.keys(Direction).length;


SortedBlocks.prototype.getSortIndex = function (block) {
    var numberOfStreets = block.getNumberOfStreets();
    if (numberOfStreets > this.DIRECTION_COUNT) {
        numberOfStreets = this.DIRECTION_COUNT;
    }
    return numberOfStreets;
};

SortedBlocks.prototype.add = function (block) {
    this.sorted[this.getSortIndex(block)].push(block);
    this.all.push(block);
};

SortedBlocks.prototype.remove = function (block) {
    if (block instanceof Block) {
        removeElement(this.sorted[this.getSortIndex(block)], block);
        removeElement(this.all, block);
    }
    return false;
};

SortedBlocks.prototype.isEmpty = function () {
    return this.all.length == 0;
};

SortedBlocks.prototype.update = function (block, oldValue) {
    if (oldValue > this.DIRECTION_COUNT) {
        oldValue = this.DIRECTION_COUNT;
    }
    removeElement(    this.sorted[oldValue],block);
    this.sorted[this.getSortIndex(block)].push(block);
};

SortedBlocks.prototype.first = function () {
    for (var i = 0; i < (this.sorted.length - 1); i++) {
        var blocks = this.sorted[i];

        if (blocks.length > 0) {
            return blocks[0];
        }
    }
    return null;
};

SortedBlocks.prototype.getRandomFullBlock = function () {
    var list = this.sorted[this.sorted.length - 1];
    return list[floor(random(list.length))];
};

SortedBlocks.prototype.forEach = function(callback){
    this.all.forEach(callback);
};