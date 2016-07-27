"use strict";
/**
 * Created by XieLong on 21.07.2016.
 */

function Ellipse(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

/**
 * Copy of Java Ellipse.contains
 * @returns {boolean}
 */
Ellipse.prototype.contains= function(x, y){
    // Normalize the coordinates compared to the ellipse
    // having a center at 0,0 and a radius of 0.5.
    var ellw = this.width;
    if (ellw <= 0.0) {
        return false;
    }
    var normx = (x - this.x) / ellw - 0.5;
    var ellh = this.height;
    if (ellh <= 0.0) {
        return false;
    }
    var normy = (y - this.y) / ellh - 0.5;
    return (normx * normx + normy * normy) < 0.25;
};