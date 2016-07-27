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

        setup: function () {

            this.onRestart();

            // CLOCK_FREQUENCY: round((Config.beatsPerMinute / 60) * (Config.ticksPerBar /

            this.INSTRUMENT_GRID = new CenteredInstrumentGrid();
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
            var part = this.getPart(street.pattern.tickDivider);


            var sequence;
            if (street.forward) {
                street.sound = street.block.sounds.forwardSound;
                sequence = street.pattern.forwardSequence;
            } else {
                street.sound = street.block.sounds.backwardSound;
                sequence = street.pattern.backwardSequence;
            }

            street.phrase = new p5.Phrase(street.id, function (time, velocity) {
                street.sound.play(time, 1, Sounds.getVolume(velocity));

                street.onNote();
            }, sequence);

            part.addPhrase(street.phrase);
        },

        getVolume: function (velocity) {
            return 1 / 3 * velocity;
        },

        /**
         * Map<TickDivider, Part>
         */
        parts: {}
        ,

        getPart: function (tickDivider) {
            var key = tickDivider.toString();
            if (this.parts.hasOwnProperty(key)) {
                return this.parts[key];
            }

            var tatums = tickDivider / Config.ticksPerBar;
            var part = new p5.Part(0, tatums);
            part.setBPM(Config.beatsPerMinute);
            this.parts[key] = part;
            part.loop();

            return part;
        }
        ,

        onBlockStartCollision: function (instrument, patternVelocity, soundIndex) {
            // var message = new OscMessage(BASE_PATH + "onCollision/blockStart");
            // addCollisionInfo(message, instrument, patternVelocity, soundIndex);
            // sendOscMessage(message);
        }
        ,

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