"use strict";
function RandomSet() {

    this.availableChoices = null;

}

RandomSet.getRandomElementFromSet = function (set) {
    return set[randomInt(set.length)];
};

RandomSet.prototype.newSet = function () {
    console.error("Abstract method!");
};

RandomSet.prototype.pickOne = function () {
    var element;
    if (this.getAvailableChoices().length == 1) {
        element = this.getAvailableChoices()[0];

        this.availableChoices = this.newSet();

        return element;
    } else {
        element = RandomSet.getRandomElementFromSet(this.getAvailableChoices());
        removeElement(this.getAvailableChoices(), element);
        return element;
    }

};

RandomSet.prototype.getAvailableChoices = function () {
    if (this.availableChoices == null) {
        this.availableChoices = this.newSet();
    }
    return this.availableChoices;
};

/**
 * If this is <code>true</code>, you may not call {@link #pickOne()} at all
 *
 */
RandomSet.prototype.isEmpty = function () {
    return this.getAvailableChoices().length === 0;
};


function RandomEnumSet(classToken) {

    this.classToken = classToken;

}

RandomEnumSet.prototype = new RandomSet();

RandomEnumSet.prototype.newSet = function () {
    var enumSet = [];

    Object.keys(this.classToken).forEach(function (element) {
        enumSet.push(this[element]);
    }, this.classToken);

    return enumSet;
};


function RandomIntegerSet(numberOfElements) {

    this.numberOfElements = numberOfElements;
}

RandomIntegerSet.prototype = new RandomSet();

RandomIntegerSet.prototype.newSet = function () {
    var set = [];
    for (var i = 0; i < this.numberOfElements; i++) {
        set.push(i);
    }
    return set;
};


function RandomListSet(elements) {

    this.elements = elements;

}

RandomListSet.prototype = new RandomSet();

RandomListSet.prototype.newSet = function () {
    /*
     * Copy the array.
     */
    return this.elements.slice();
};