"use strict";
var Instrument = {
    KICK: {
        color: '#69FFAC',
        index: 1, fileName: '1 Kick',
        configKey: 'kick',
        toString: 'Kick'
    },
    BASS: {
        color: '#FFB169',
        index: 2, fileName: '2 Bass',
        configKey: 'bass',
        toString: 'Bass'
    },
    SYNTH1: {
        color: '#69FF70',
        index: 3, fileName: '3 Synth 1',
        configKey: 'synth1',
        toString: 'Synth'
    },
    SYNTH2: {
        color: '#FF7F69',
        index: 4, fileName: '4 Synth 2',
        configKey: 'synth2',
        toString: 'One Shots'
    },
    SNARE: {
        color: '#FC69FF',
        index: 5, fileName: '5 Snare',
        configKey: 'snare',
        toString: 'Snare'
    },
    HAT1: {
        color: '#9B69FF',
        index: 6, fileName: '6 Hat 1',
        configKey: 'hat1',
        toString: 'Hat 1'
    },
    HAT2: {
        color: '#FFDB5B',
        index: 7, fileName: '7 Hat 2',
        configKey: 'hat2',
        toString: 'Hat 2'
    },
    PERCUSSION: {
        color: '#78CCFF',
        index: 8, fileName: '8 Perc',
        configKey: 'percussion',
        toString: 'Percussion'
    },
    valueOf: function (index) {
        var valueOf = null;
        Instrument.values.some(function (instrument) {
            if (instrument.index === index) {
                valueOf = instrument;
                return true;
            }
        });
        return valueOf;
    }
};

Instrument.values = [
    Instrument.KICK,
    Instrument.BASS,
    Instrument.SYNTH1,
    Instrument.SYNTH2,
    Instrument.SNARE,
    Instrument.HAT1,
    Instrument.HAT2,
    Instrument.PERCUSSION
];

Instrument.setup = function () {

    Instrument.values.forEach(function (instrument) {
        instrument.color = color(instrument.color);

        colorMode(HSB);

        instrument.backgroundColor = color(
            hue (instrument.color),
            saturation(instrument.color) / 2,
            brightness(instrument.color) / 2);

        colorMode(RGB);

        var soundArraySize = Config.numberOfSounds[instrument.configKey] - 1;

        instrument.sounds = new Array(soundArraySize);

        for (var i = 0; i <= soundArraySize; i++) {
            instrument.sounds[i] = {
                forwardSound: loadSound(CONFIG_PATH + instrument.configKey + "/" + (i + 1) + ".A.wav"),
                backwardSound: loadSound(CONFIG_PATH + instrument.configKey + "/" + (i + 1) + ".B.wav"),
            }
        }

        instrument.sounds = new RandomListSet(instrument.sounds);

        instrument.chooseRandomSounds = function () {
            return this.sounds.pickOne();
        }
    });
};



