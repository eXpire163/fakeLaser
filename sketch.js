
let width
let height
let rotation
let flash
let ratio

let leftEdge
let rightEdge
let bottomPos
let topPos
let halfHeight
let thirdHeight
let quaterHeight
let urlNumber = -1

let settings
let beam


//capturing

let captureTime = 50;
let canvas;

// var capturer = new CCapture({
//     framerate: 60,
//     verbose: true,
//     format: "gif",
//     workersPath: "./js/"
// });

function presetup() {


    //width = window.innerWidth - 5;
    //height = window.innerHeight - 5;

    width = 1280
    height = 720

    rotation = 0;
    flash = true;
    ratio = width / height

    leftEdge = -(width / 2) + 20
    rightEdge = (width / 2) - 20
    bottomPos = -height / 2
    topPos = height / 2
    halfHeight = height / 2 - 20
    thirdHeight = height / 3 - 20
    quaterHeight = height / 4 - 20

    settings = {
        width: 1280,
        height: 720,
        rotation: 0,
        flash: true,
        ratio: width / height,
        leftEdge: -(width / 2) + 20,
        rightEdge: (width / 2) - 20,
        bottomPos: -height / 2,
        topPos: height / 2,
        halfHeight: height / 2 - 20,
        thirdHeight: height / 3 - 20,
        quaterHeight: height / 4 - 20
    }

    beam = new Beam(settings);
    bar = new Bar(settings);

}

function setup() {
    presetup()

    p5canvas = createCanvas(width, height);
    canvas = p5canvas.canvas;
    //capturer.start();
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam !== null) {
        urlNumber = parseInt(modeParam);
    }
    else {
        console.log("no mode param found, ?mode=x where x is number 0-" + totalModes);
    }
    console.log("setup done");

    setInterval(cicleModes, 5000);
}

function mouseClicked() {
    // try{
    // let fs = fullscreen();
    // fullscreen(!fs);
    // }catch{console.error("fullscreen does not work here");}

    // presetup()
    //createCanvas(width, height);
}


function draw() {
    //console.log("draw");
    translate(width / 2, height / 2)
    background(5);
    // get url parameter mode
    if (urlNumber >= 0) {
        runMode(urlNumber)
    }
    else {
        runMode(currentMode) // nothing for cicle modes, number for specific, 99 for all
    }
}



currentMode = 0
totalModes = 6
function cicleModes() {

    currentMode = (currentMode + 1) % (totalModes + 1)
    console.log("Cicle mode to: " + currentMode)

}

beamRotation0 = 0
beamRotation1 = 0
beamRotation2 = 0
function runMode(selectedMode) {

    // console.log("selectedMode: " + selectedMode)

    switch (selectedMode) {
        case 0:
            bar.movingBarLeftRight(true)
            break;
        case 1:
            beam.modeFadingCircle();
            break;
        case 2:
            beamRotation0 = beam.modeBeams(3, color(255, 255, 255), beamRotation0, false)
            break;
        case 3:
            beamRotation0 = beam.modeBeams(14, color(0, 255, 255), beamRotation0, true, halfHeight, true)
            break;
        case 4:
            beamRotation0 = beam.modeBeams(9, color(255, 0, 0), beamRotation0, true, halfHeight)
            beamRotation1 = beam.modeBeams(7, color(0, 255, 0), beamRotation1, false, thirdHeight)
            break;
        case 5:
            bar.movingBarSplitterTopBottom(7)
            break;
        case 6:
            beam.flash3Beams()
            break;
        case 99:
            bar.movingBarLeftRight(true)
            beam.modeFadingCircle();

            beamRotation0 = beam.modeBeams(14, color(255, 0, 0), beamRotation0, true, 120, true)
            beamRotation1 = beam.modeBeams(9, color(0, 0, 255), beamRotation1, true, 120)
            beamRotation2 = beam.modeBeams(7, color(0, 255, 0), beamRotation2, false, 80)
            bar.movingBarSplitterTopBottom(7)
            beam.flash3Beams()
            // testPingPont()
            break;

        default:

            break;
    }
}




tpp = 0.0
function testPingPont() {
    tpp += 0.4
    left = createVector(-width / 2 + 10, 50)
    right = createVector(width / 2 - 10, -50)
    v = Helper.pingPong(left, right, 50, tpp)
    drawDot(v.x, v.y, color(255, 0, 255))
    tpp = tpp % 50
}
