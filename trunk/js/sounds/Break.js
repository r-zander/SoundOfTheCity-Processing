"use strict";
function Break() {
    this.patterns = {};
}

Break.preload = function () {
    Break.file = loadStrings(CONFIG_PATH + "9 Break" + Patterns.EXTENSION);
};

Break.setup = function () {
    Break.ALL_BREAKS = Break.readFile();
    Break.RANDOM_BREAKS = new RandomListSet(Break.ALL_BREAKS);
};

Break.getRandomBreak = function () {
    return Break.RANDOM_BREAKS.pickOne();
};

Break.readFile = function () {
    var breakPatterns = [];
    var breakPattern = null;
    var instrumentIndex = 1;

    Break.file.forEach(function (line) {
        if (line.length > 0) {
            if (line.startsWith("---")) {
                breakPattern = new Break();
                breakPatterns.push(breakPattern);
                instrumentIndex = 1;
            } else {
                breakPattern.patterns[
                    Instrument.valueOf(instrumentIndex).toString] =
                    new Pattern(line);
                instrumentIndex++;
            }
        }
    });

    return breakPatterns;
};

Break.prototype.getPattern = function (instrument) {
    return this.patterns[instrument.toString];
};