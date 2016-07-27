"use strict";
/**
 * Created by XieLong on 20.07.2016.
 */

/*
 http://stackoverflow.com/a/3885844
 */
function isFloat(n) {
    return n === +n && n !== (n | 0);
}

function isInteger(n) {
    return n === +n && n === (n | 0);
}

function randomInt(min, max) {
    if (arguments.length == 1) {
        return floor(random(min));
    }
    return floor(random(min, max));

}

function removeElement(array, element) {
    var indexOf = array.indexOf(element);
    array.splice(indexOf, 1);
}

var TwoDimensional = {
    angleBetween: function (x1, y1, x2, y2) {
        var atan2 = Math.atan2(y1 - y2, x1 - x2);
        return (atan2 < 0 ? Math.PI * 2 + atan2 : atan2);
    }
};

function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}