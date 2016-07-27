"use strict";
function Patterns() {
    this.numberOfIntensities = 0;

    this.variants = {};
}

Patterns.EXTENSION = ".pattern.txt";


Patterns.files = {};

Patterns.preload = function () {
    Instrument.values.forEach(function (instrument) {
        Patterns.files[instrument.toString] = loadStrings(CONFIG_PATH + instrument.fileName + Patterns.EXTENSION);
    });
};

Patterns.instrumentPatterns = {};

Patterns.setup = function () {
    Instrument.values.forEach(function (instrument) {
        Patterns.instrumentPatterns[instrument.toString] = Patterns.readFile(Patterns.files[instrument.toString], instrument);
    });
};


Patterns.INTENSITY_REGEX = /---(\d+)---/;

Patterns.GROUP_SEPERATOR = /-/g;

Patterns.readFile = function (file, instrument) {
    var patterns = new Patterns();
    var currentVariants = [];

    file.forEach(function (line) {
        if (line.length > 0) {
            var match = line.match(Patterns.INTENSITY_REGEX);
            if (match != null) {
                var foundIntensity = parseInt(match[1]);
                if (foundIntensity > patterns.numberOfIntensities) {
                    patterns.numberOfIntensities = foundIntensity;
                }
                currentVariants = [];
                patterns.variants[foundIntensity.toString()] = currentVariants;
            } else {
                if (currentVariants == null) {
                    throw "Found a pattern for '" + instrument.toString + "' without introducing '---Intensity---'";
                }
                currentVariants.push(new Pattern(line));
            }
        }
    });

    return patterns;
};

Patterns.getNumberOfIntensities = function (instrument) {
    return Patterns.instrumentPatterns[instrument.toString].numberOfIntensities;
};

Patterns.getRandomPattern = function (instrument, intensity) {
    var patterns = Patterns.instrumentPatterns[instrument.toString];
    var variantsForIntensity = patterns.variants[intensity.toString()];
    return variantsForIntensity[randomInt(variantsForIntensity.length)];
};


function Pattern(line) {
    var values = line.split(" ");
    this.tickDivider = parseInt(values[0]);
    this.forwardSequence = this.readSequence(values[1]);
    this.backwardSequence = this.readSequence(values[2]);
}

Pattern.prototype.readSequence = function (string) {
    string = string.replace(Patterns.GROUP_SEPERATOR, "");
    var sequence = [];
    for (var i = 0, len = string.length; i < len; i++) {
        sequence.push(parseInt(string[i]));
    }

    return sequence;
};

Pattern.prototype.getVelocity = function (steps, forward) {
    var sequence;
    if (forward) {
        sequence = this.forwardSequence;
    } else {
        sequence = this.backwardSequence;
    }

    var index = steps % sequence.length;
    return sequence.get(index);
};

Pattern.prototype.mainPattern = function () {
    return this.sequenceToString(this.forwardSequence);
};

Pattern.prototype.complementaryPattern = function () {
    return this.sequenceToString(this.backwardSequence);
};

Pattern.prototype.sequenceToString = function (sequence) {
    if (sequence.length % 4 == 0) {
        return this.sequenceToString(sequence, 4);
    } else {
        return this.sequenceToString(sequence, 2);
    }
};

Pattern.prototype.sequenceToString = function (sequence, groupLength) {
    var out = "";
    var currentGroupLength = 0;
    sequence.forEach(function (integer) {
        if (currentGroupLength == groupLength) {
            out += Patterns.GROUP_SEPERATOR;
            currentGroupLength = 0;
        }
        out += integer;
        currentGroupLength++;
    });
    return out;
};

Pattern.prototype.toString = function () {
    var out = this.tickDivider;
    out += ' ';
    out += this.mainPattern();
    out += ' ';
    out += this.complementaryPattern();
    return out;
};

