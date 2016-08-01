"use strict";
var Colors = {
    BACKGROUND: '#000000'
};

var grid;

var currentInteraction = null;

var cars = [];

var particleCars = {};

var debug = false;

var deletionActivated = true;

var currentTick = 0;

var currentBar = 1;

var breakPattern;

var resetButton;

const CONFIG_PATH = "config/";

//noinspection JSUnusedGlobalSymbols
function preload() {
    Break.preload();
    Patterns.preload()
}

//noinspection JSUnusedGlobalSymbols
function setup() {
    //noinspection JSUnresolvedFunction
    createCanvas(windowWidth, windowHeight, Config.renderer);

    // TODO implement FULLSCREEN mode

    Sounds.setup();
    Break.setup();
    Patterns.setup();
    Instrument.setup();

    Car.setup();
    GridCell.setup();

    grid = new Grid();

    Colors.BACKGROUND = color(Colors.BACKGROUND);

    background(Colors.BACKGROUND);

    Sounds.setup();

    // new TimedEventGenerator(
    //     this,
    //     "onTick",
    //     true,
    //     round(1000 / Sounds.CLOCK_FREQUENCY));

    var buttonSize = width * 0.1;
    resetButton =
        new Triangle(
            width - buttonSize,
            height,
            width,
            height - buttonSize,
            width,
            height);
}

function relativeX(x) {
    if (Config.scaleResolution) {
        return x * width / 1920 * 1.25;
    }
    return x;
}

function relativeY(y) {
    if (Config.scaleResolution) {
        return y * height / 1080 * 1.25;
    }
    return y;
}

function draw() {
    fill(Colors.BACKGROUND, 100);
    noStroke();
    rect(0, 0, width, height);

    checkInteraction();

    grid.draw();

    if (!debug) {
        cars.forEach(function (car) {
            car.followPath();
            car.draw();
        });

        if (grid.blocks.isEmpty()) {
            if (grid.currentBlock.isEmpty()) {
                drawSplashScreen();
            }
        } else {
            drawButtons();
        }
    } else {
        drawFPS();
        drawBlockInfo();
        drawTicks();
    }
}

function drawSplashScreen() {
    noStroke();
    fill(Car.COLOR);
    textAlign(CENTER, TOP);

    var fontSize = height * 0.12;
    textSize(fontSize);

    text("Sound of the City", width / 2, height * 0.3);

    textSize(fontSize / 3);
    text("Left Click - Create!", mouseX, mouseY - fontSize / 3);

    textSize(fontSize / 5);
    text("Right Click - Erase!", mouseX, mouseY + fontSize / 5);

    textSize(fontSize / 3);
    textAlign(LEFT, TOP);
    text("by Ramon Wiegratz", relativeX(50), height * 0.95 - fontSize / 3);

    textAlign(RIGHT, TOP);
    text("and Raoul Zander", width - relativeX(50), height * 0.95 - fontSize / 3);

}

function drawButtons() {
    noStroke();
    fill(Grid.COLOR);
    resetButton.draw();
    if (mouseIsPressed && mouseButton == LEFT && resetButton.contains(mouseX, mouseY)) {
        fill(255);
    } else {
        fill(Car.COLOR);
    }
    var fontSize = width * 0.02;
    textSize(fontSize);
    push();
    translate(resetButton.v1.x + (fontSize * 2), height - fontSize);
    rotate(radians(-45));
    textAlign(LEFT, TOP);
    text("Reset", 0, 0);
    pop();
}

function drawBlockInfo() {
    var x = mouseX;
    var y = mouseY;
    var cell = grid.getCell(x - GridCell.RADIUS, y - GridCell.RADIUS);
    var block = cell.block;
    if (block != null) {
        var lineHeight = relativeY(16);

        fill(Colors.BACKGROUND);
        noStroke();
        rect(x, y, 250, 11.5 * lineHeight);

        textSize(relativeY(12));
        textAlign(LEFT, TOP);
        fill(Car.COLOR);

        //noinspection JSSuspiciousNameCombination
        x += lineHeight;
        y += lineHeight;
        text("Block Size: " + block.getSize(), x, y);
        y += lineHeight;
        text("Instrument: " + block.getInstrument().toString, x, y);
        y += lineHeight;
        text(
            "Intensity: " + block.getIntensity() + " / "
            + Patterns.getNumberOfIntensities(block.getInstrument()),
            x,
            y);
        y += lineHeight;
        text("Tick Divider: " + block.getPattern().tickDivider, x, y);
        y += lineHeight;

        if (block.forwardStreet !== null) {
            text("Forward Street: " + block.forwardStreet.id, x, y);
            y += lineHeight;
            text("    Sound: " + block.sounds.forwardSound.file, x, y);
            y += lineHeight;
            text("    Pattern: " + block.getPattern().mainPattern, x, y);
            y += lineHeight;
        }

        if (block.backwardStreet !== null) {
            text("Backward Street: " + block.backwardStreet.id, x, y);
            y += lineHeight;
            text("    Sound: " + block.sounds.backwardSound.file, x, y);
            y += lineHeight;
            text("    Pattern: " + block.getPattern().complementaryPattern, x, y);
        }
    }
}

function checkInteraction() {
    if (mouseIsPressed) {
        if (resetButton.contains(mouseX, mouseY)) {
            if (mouseButton == LEFT) {
                restart();
            }
            return;
        }

        if (currentInteraction == null) {
            currentInteraction = new Interaction();
        } else {
            currentInteraction.update();
        }

        switch (mouseButton) {
            case LEFT:
                changeGrid(CellState.BUILT);
                break;
            case RIGHT:
                changeGrid(CellState.EMPTY);
                break;
            default:
                break;
        }
    }
}

// function onTick() {
//     currentTick++;
//     grid.onTick(currentTick);
//     if (currentTick >= Config.get().ticksPerBar()) {
//         currentTick = 0;
//         currentBar++;
//         if (breakPattern == null) {
//             if (currentBar >= Config.get().barsBetweenBreaks()) {
//                 currentBar = 1;
//                 if (grid.blocks.isEmpty() == false) {
//                     breakPattern = Break.getRandomBreak();
//                 }
//             }
//         } else {
//             if (currentBar >= Config.get().breakBars()) {
//                 currentBar = 1;
//                 breakPattern = null;
//                 onAfterBreak();
//             }
//         }
//     }
// }
//
// function onAfterBreak() {
//     if (grid.blocks.isEmpty()) {
//         return;
//     }
//
//     if (grid.blocks.size() == 1) {
//         if (deletionActivated) {
//             grid.blocks.get(0).destroy();
//         }
//         return;
//     }
//
//     var toDelete = [];
//     var toChange = [];
//     grid.blocks.forEach(function (block) {
//         if (random(100) <= Config.get().afterBreakDeleteChance()) {
//             toDelete.push(block);
//         }
//         if (random(100) <= Config.get().afterBreakChangeChance()) {
//             toChange.push(block);
//         }
//     });
//
//     var blocks = new RandomListSet(grid.blocks);
//     /*
//      * At least delete 1 block.
//      */
//     if (toDelete.isEmpty()) {
//         toDelete.push(blocks.pickOne());
//     }
//     /*
//      * At least change 1 block.
//      */
//     if (toChange.isEmpty()) {
//         toChange.push(blocks.pickOne());
//     }
//
//     if (deletionActivated) {
//         toDelete.forEach(function (block) {
//             block.destroy();
//         });
//     }
//
//     toChange.forEach(function (block) {
//         Sounds.changeBlockPattern(block);
//     });
// }

//noinspection JSUnusedGlobalSymbols
function mouseReleased() {
    if (currentInteraction != null && currentInteraction.currentMouseButton == LEFT) {
        grid.finishBlock();
    }
}

//noinspection JSUnusedGlobalSymbols
function keyPressed() {
    switch (key) {
        case 'D':
        case 'd':
            debug = !debug;
            break;
        case 'B':
        case 'b':
            deletionActivated = !deletionActivated;
            break;
        case ' ':
            restart();
            break;
        default:
            switch (keyCode){
                case KEY.ESC:
                    restart();
                    break;
            }
            break;
    }
}

function restart() {
    window.location.reload(false);
    // grid = new Grid();
    //
    // currentInteraction = null;
    //
    // cars.forEach(function (car) {
    //     car.particle.remove();
    // });
    // /*
    //  * Clear the array
    //  */
    // cars = [];
    // particleCars = {};
    //
    // currentTick = 0;
    // currentBar = 1;
    // breakPattern = null;
    //
    // Sounds.onRestart();
}

function drawFPS() {
    noStroke();
    fill(Car.COLOR);
    textSize(relativeY(12));
    textAlign(CENTER, BOTTOM);
    text(frameRate().toFixed(1), GridCell.DIAMETER * 2.5, GridCell.DIAMETER * 2.5);
}

function drawTicks() {
    // strokeWeight(Grid.WEIGHT);
    // stroke(Car.COLOR);
    // fill(Colors.BACKGROUND);
    var x = GridCell.DIAMETER * 4.5;
    // var y = GridCell.DIAMETER * 1.5;
    // rect(x, y, 8 * GridCell.DIAMETER, GridCell.DIAMETER);
    //
    // var quarter = floor(currentTick / Config.ticksPerBar * 4);
    //
    // fill(Car.COLOR);
    // rect(
    //     x + (quarter * 2 * GridCell.DIAMETER),
    //     y,
    //     2 * GridCell.DIAMETER,
    //     GridCell.DIAMETER);

    // noStroke();
    // fill(Car.COLOR);
    // textSize(relativeY(12));
    // textAlign(RIGHT, BOTTOM);
    // // text(currentTick + " / " + Config.ticksPerBar, x + (3 + 8)
    // //     * GridCell.DIAMETER, GridCell.DIAMETER * 2.5);
    // text(Sounds.averageTickDuration().toFixed(2), x + (3 + 8)
    //     * GridCell.DIAMETER, GridCell.DIAMETER * 2.5);

    textAlign(LEFT, BOTTOM);
    text(
        "Bar " + currentBar,
        x + (4 + 8) * GridCell.DIAMETER,
        GridCell.DIAMETER * 2.5);
    if (breakPattern != null) {
        text("Break!", x + (6 + 8) * GridCell.DIAMETER, GridCell.DIAMETER * 2.5);
    }

    if (deletionActivated == false) {
        text(
            "Permanence Mode",
            x + (9 + 8) * GridCell.DIAMETER,
            GridCell.DIAMETER * 2.5);
    }
}

function changeGrid(newState) {

    var intensity = currentInteraction.frames;

    var buildDiameter = intensity * GridCell.DIAMETER;

    var ellipse = new Ellipse(
        mouseX - buildDiameter / 2,
        mouseY - buildDiameter / 2,
        buildDiameter,
        buildDiameter);

    var half_intensity = floor(intensity / 2);
    for (var gridX = currentInteraction.gridX - half_intensity; gridX <= currentInteraction.gridX
    + half_intensity; gridX++) {
        if (gridX < 0) {
            continue;
        }
        if (gridX >= grid.getMaxGridX()) {
            break;
        }
        for (var gridY = currentInteraction.gridY - half_intensity; gridY <= currentInteraction.gridY
        + half_intensity; gridY++) {
            if (gridY < 0) {
                continue;
            }
            if (gridY >= grid.getMaxGridY()) {
                break;
            }
            if (grid.isState(gridX, gridY, newState)
                || grid.isState(gridX, gridY, CellState.STREET)
                || (newState == CellState.BUILT && grid.isState(
                    gridX,
                    gridY,
                    CellState.BLOCKED))) {
                continue;
            }
            var x = grid.getX(gridX);
            var y = grid.getY(gridY);
            if (ellipse.contains(x + GridCell.RADIUS, y + GridCell.RADIUS)) {
                grid.changeState(gridX, gridY, newState);
            }
        }
    }
}

function Interaction() {

    this.frames = 1;

    this.gridX = grid.getGridX(mouseX);

    this.gridY = grid.getGridY(mouseY);

    this.currentMouseButton = mouseButton;
}

Interaction.prototype.update = function () {
    var newGridX = grid.getGridX(mouseX);
    var newGridY = grid.getGridY(mouseY);

    if (this.currentMouseButton != mouseButton) {
        this.gridX = newGridX;
        this.gridY = newGridY;
        this.frames = 1;
        if (this.currentMouseButton == LEFT) {
            grid.finishBlock();
        }
        this.currentMouseButton = mouseButton;
    } else if (newGridX != this.gridX || newGridY != this.gridY) {
        var frameChange = sqrt(sq(newGridX - this.gridX) + sq(newGridY - this.gridY));
        this.frames -= round(frameChange);

        if (this.frames < 0 && this.currentMouseButton == LEFT) {
            grid.finishBlock();
        }

        if (this.frames <= 0) {
            this.frames = 1;
        }
        this.gridX = newGridX;
        this.gridY = newGridY;
    } else {
        this.frames++;
    }
};

/**
 * Scales vector and overrides coordinates with result.
 *
 * @param s  scale factor
 * @return itself
 */
p5.Vector.prototype.multSelf = function (s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
};

function lazyColor(colorString) {
    if (typeof colorString === "string") {
        return color(colorString);
    }
    return colorString;
}