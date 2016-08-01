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
        kick: 5,
        bass: 9,
        synth1: 8,
        synth2: 11,
        snare: 6,
        hat1: 8,
        hat2: 5,
        percussion: 8
    },

    scaleResolution: true,

    barsBetweenBreaks: 16,

    breakBars: 1,

    afterBreakChangeChance: 0.125,

    afterBreakDeleteChance: 0.125,

    colors: {
        berlin: [
            '#DC6BA6', // S1
            '#007B3C', // S2, S25,
            '#0065AD', // S3
            '#AE5836', // S41
            '#CB6219', // S42
            '#CD9C53', // S45, S46, S47
            '#ED7102', // S5
            '#836CAA', // S7, S75, U6
            '#61AC2C', // S8, S85, U1
            '#9A2A47', // S9
            '#E84D0E', // U2
            '#00A091', // U3
            '#FFD400', // U4
            '#815137', // U5, U55
            '#009AD9', // U7
            '#005999', // U8
            '#F18700'  // U9
        ]
    }
};
