"use strict";
// var OscReceiver = {
//
//     /* incoming osc message are forwarded to the oscEvent method. */
//     oscEvent: function (message) {
//         /* print the address pattern and the typetag of the received OscMessage */
// //            print("### received an osc message.");
// //            print(" addrpattern: " + message.addrPattern());
// //            print(" arguments: " + Arrays.toString(message.arguments()));
// //            println(" typetag: " + message.typetag());
//     }
// };

var Sounds = {

        /* start oscP5, listening for incoming messages at port 12000 */
        // osc: new OscP5(OscReceiver, Config.get().receivePort()),

        /*
         * myRemoteLocation is a NetAddress. a NetAddress takes 2 parameters,
         * an ip address and a port number. myRemoteLocation is used as parameter in
         * oscP5.send() when sending osc packets to another computer, device,
         * application. usage see below. for testing purposes the listening port
         * and the port of the remote location address are the same, hence you will
         * send messages back to this sketch.
         */
        // remoteLocation: new NetAddress(Config.get().receiveAddress(), Config.get().sendPort()),

        BASE_PATH: "/generativeCity/",

        lastTicks: [],


        /*An important point to note is that on iOS, Apple currently mutes all sound output 
        until the first time a sound is played during a user interaction event - for example, 
        calling playSound() inside a touch event handler. 
        You may struggle with Web Audio on iOS "not working" unless you circumvent this - 
        in order to avoid problems like this, just play a sound 
        (it can even be muted by connecting to a Gain Node with zero gain) inside an early UI 
        event - e.g. "touch here to play".*/

        setup: function () {

            //this.onRestart();
            //var audioCtx;

            //try{
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            //}
            //catch(e){
                //alert("Web Audio API is not supported in this browser");
            //}

            this.CLOCK_FREQUENCY = (Config.beatsPerMinute / 60) * (Config.ticksPerBar / 4);

            this.INSTRUMENT_GRID = new CenteredInstrumentGrid();

            this.clock = new WAAClock(this.audioCtx);
            this.clock.start();

            // this.part = new p5.Part(0, 1 / Config.ticksPerBar);
            // this.part.setBPM(Config.beatsPerMinute);
            // this.part.loop();
            //
            // var t0 = performance.now();
            // this.part.addPhrase('debug', function () {
            //     var t1 = performance.now();
            //     Sounds.lastTicks.push(t1 - t0);
            //     if (Sounds.lastTicks.length >= (10)){
            //         Sounds.lastTicks.shift();
            //     }
            //     t0 = t1;
            // }, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

            Break.setup();
            Patterns.setup();
            Instrument.setup();
        },

        averageTickDuration: function () {
            var sum = 0;
            this.lastTicks.forEach(function (tickDuration) {
                sum += tickDuration;
            });
            return sum / this.lastTicks.length;
        },

        // sendOscMessage: function (message) {
        //     /* send the message */
        //     osc.send(message, remoteLocation);
        // },

        onRestart: function () {
            // sendOscMessage(new OscMessage(BASE_PATH + "onClear"));
        },

        onBlockCreation: function (block) {
            block.instrument = block.centerCell.instrument;
            block.intensity = this.determineBlockIntensity(block);
            this.changeBlockPattern(block);
            block.sounds = block.instrument.chooseRandomSounds();
        },

        BLOCK_SIZE_LIMITS: {
            2: [200],
            3: [150, 300],
            4: [100, 250, 350]
        },

        /**
         * Determine intensity by checking block size against some thresholds
         */
        determineBlockIntensity: function (block) {
            var blockSize = block.getSize();
            var numberOfIntensities = Patterns.getNumberOfIntensities(block.instrument);
            var blockSizeLimits = this.BLOCK_SIZE_LIMITS[numberOfIntensities];

            for (var intensity = 0; intensity < blockSizeLimits.length; intensity++) {
                if (blockSize < blockSizeLimits[intensity]) {
                    return (intensity + 1);
                }
            }
            return numberOfIntensities;
        },

        changeBlockPattern: function (block) {
            block.pattern = Patterns.getRandomPattern(block.instrument, block.intensity);
        },

        onStreetCreation: function (street) {
            // var part = this.getPart(street.pattern.tickDivider);

            var sequence;
            if (street.primary) {
                street.sound = Sounds.audioCtx.createBufferSource();
                street.sound.buffer = street.block.sounds.primary;
                sequence = street.pattern.primarySequence;
            } else {
                street.sound = Sounds.audioCtx.createBufferSource();
                street.sound.buffer = street.block.sounds.secondary;
                sequence = street.pattern.secondarySequence;
            }

            street.step = 0;

            var t0 = performance.now();

            street.clockEvent = this.clock.callbackAtTime(function () {
                var velocity = sequence[street.step];

                street.step++;
                if (street.step >= sequence.length) {
                    street.step = 0;
                }
                if (velocity > 0) {
                    // TODO get TIME and VELOCITY
                    var time = 0;

                    street.sound.start(0);

                    // var velocity = 2;
                    // street.sound.play(time, 1, Sounds.getVolume(velocity));
                    // street.sound.play(time, 1, Sounds.getVolume(velocity));

                    street.onNote();

                    // var t1 = performance.now();
                    // console.log("Fourths: " + (t1 - t0 ));
                    // t0 = t1;
                }
            }, this.getInterval(Config.globalTickDivider)).repeat(this.getInterval(street.pattern.tickDivider));

            // street.phrase = new p5.Phrase(street.id, function (time, velocity) {
            //     street.sound.play(time, 1, Sounds.getVolume(velocity));
            //
            //     street.onNote();
            // }, sequence);
            //
            // part.addPhrase(street.phrase);
        },

        onStreetRemoval: function (street) {
            street.clockEvent.clear();
        },

        getInterval: function (tickDivider) {
            // FIXME
            // return (1 / this.CLOCK_FREQUENCY) * (Config.ticksPerBar / tickDivider * 4);
            return 1 / this.CLOCK_FREQUENCY * tickDivider;
        },

        getVolume: function (velocity) {
            return 1 / 3 * velocity;
        },

        // /**
        //  * Map<TickDivider, Part>
        //  */
        // parts: {},
        //
        // getPart: function (tickDivider) {
        //     var key = tickDivider.toString();
        //     if (this.parts.hasOwnProperty(key)) {
        //         return this.parts[key];
        //     }
        //
        //     var tatums = tickDivider / Config.ticksPerBar;
        //     var part = new p5.Part(0, tatums);
        //     part.setBPM(Config.beatsPerMinute);
        //     this.parts[key] = part;
        //     part.loop();
        //
        //     return part;
        // },

        getPart: function () {
            return this.part;
        },

        onBlockStartCollision: function (instrument, patternVelocity, soundIndex) {
            // var message = new OscMessage(BASE_PATH + "onCollision/blockStart");
            // addCollisionInfo(message, instrument, patternVelocity, soundIndex);
            // sendOscMessage(message);
        },

        onBlockEndCollision: function (instrument, patternVelocity, soundIndex) {
            // var message = new OscMessage(BASE_PATH + "onCollision/blockEnd");
            // addCollisionInfo(message, instrument, patternVelocity, soundIndex);
            // sendOscMessage(message);
        }

// addCollisionInfo: function (message, instrument, patternVelocity, soundIndex) {
//     message.add(instrument.index);
//     message.add(soundIndex);
//     message.add(patternVelocity);
//
//     return message;
// }
    }
    ;