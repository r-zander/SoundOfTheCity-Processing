"use strict";
var Direction = {
    TOP: {
        invert: function () {
            return this.BOTTOM;
        },
        clockwise: function () {
            return this.RIGHT;
        }
    },
    BOTTOM: {
        invert: function () {
            return this.TOP;
        },
        clockwise: function () {
            return this.LEFT;
        }
    },
    LEFT: {
        invert: function () {
            return this.RIGHT;
        },
        clockwise: function () {
            return this.TOP;
        }
    },
    RIGHT: {
        invert: function () {
            return this.LEFT;
        },
        clockwise: function () {
            return this.BOTTOM;
        }
    }
};

