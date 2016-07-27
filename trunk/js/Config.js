"use strict";
var DisplayMode = {
    FULLSCREEN: 0,
    WINDOWED: 1
};

var CarSpawnMode = {
    ALTERNATING: 0,
    ONE_SIDED: 1,
    DOUBLE_SIDED: 2
};

var CarBehavior = {
    BACK_AND_FORTH: 0,
    RESPAWN: 1,
    RECYCLE: 2
};

var BlockCollision = {
    SINGLE: 0,
    DOUBLE: 1
};

var Config = {

    get: function () {
        return this;
    },

    displayMode: DisplayMode.FULLSCREEN,

    renderer: 'p2d',
    // renderer: 'webgl',

    carSpawnMode: CarSpawnMode.DOUBLE_SIDED,

    carBehavior: CarBehavior.RESPAWN,

    blockCollision: BlockCollision.SINGLE,

    beatsPerMinute: 135,

    ticksPerBar: 96,

    globalTickDivider: 48,

    numberOfSounds: {
        kick: 2,
        bass: 2,
        synth1: 2,
        synth2: 2,
        snare: 2,
        hat1: 2,
        hat2: 2,
        percussion: 2
    },

    scaleResolution: true,

    barsBetweenBreaks: 16,

    breakBars: 1,

    afterBreakChangeChance: 0.125,

    afterBreakDeleteChance: 0.125
};
