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

function presetup(){


    width = window.innerWidth - 5;
    height = window.innerHeight - 5;
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

}

function setup() {
    presetup()

    createCanvas(width, height);

    setInterval(cicleModes, 5000);
}

function mouseClicked() {
    try{
    let fs = fullscreen();
    fullscreen(!fs);
    }catch{console.error("fullscreen does not work here");}

    presetup()
    createCanvas(width, height);
}


function draw() {
    translate(width / 2, height / 2)
    background(00);

    runMode() // nothing for cicle modes, number for specific, 99 for all
}


currentMode = 0
totalModes = 4
function cicleModes() {
    currentMode = (currentMode + 1) % (totalModes + 1)

}

beamRotation = 0
beamRotation1 = 0
beamRotation2 = 0
function runMode(manualModeSelect = -1) {

    selectedMode = (manualModeSelect>=0) ? manualModeSelect : currentMode

    switch (selectedMode) {
        case 0:
            modeScannerHorizontal()
            break;
        case 1:
            modeFadingCircle();
            break;
        case 2:
            flashBeamRotation = modeBeams(3, color(255, 255, 255), flashBeamRotation, false)
            break;
        case 3:
            beamRotation = modeBeams(14, color(0, 255, 255), beamRotation, true, halfHeight, true)
            break;
        case 4:
            beamRotation1 = modeBeams(9, color(255, 0, 0), beamRotation1, true, halfHeight)
            beamRotation2 = modeBeams(7, color(0, 255, 0), beamRotation2, false, thirdHeight)
            break;
        case 5:
            testPingPont()
            break;
        case 99:
            modeScannerHorizontal()
            modeFadingCircle();
            flash3Beams()
            beamRotation = modeBeams(14, color(255, 0, 0), beamRotation, true, 120, true)
            beamRotation1 = modeBeams(9, color(0, 0, 255), beamRotation1, true, 120)
            beamRotation2 = modeBeams(7, color(0, 255, 0), beamRotation2, false, 80)
            testPingPont()
            break;

        default:

            break;
    }
}


// ############  Fading Circle #########
rotationCounter = 0
rotationSpeed = 0.02
hueC = 0
function modeFadingCircle() {

    hueC++
    if (hueC > 255) {
        hueC = 0
    }
    v = polarToCartesian(height / 3, rotationCounter)

    noFill()
    colorMode(HSB);
    stroke(hueC, 255, 255)
    strokeWeight(10)
    ellipse(v.x * ratio, v.y, 140, 110);
    ellipse(-v.x * ratio, -v.y, 140, 110);
    colorMode(RGB)
    rotationCounter += rotationSpeed

}



// ############  Flashing Beams #########
flashBeamRotation = 0
function flash3Beams() {
    if (flash) {
      flashBeamRotation = modeBeams(3, color(255, 255, 255), flashBeamRotation, false)
    }
    flash = !flash
}


function modeBeams(number, c, currentRotation, direction = false, diameter = halfHeight, changeHight) {

    currentRotation = direction ? currentRotation + 0.05 : currentRotation - 0.05
    pos = polarToCartesian(diameter, currentRotation)

    for (i = 0; i < number; i++) {
        pos = polarToCartesian(diameter, currentRotation + (i / number * 2 * Math.PI))
        if(changeHight){

            drawDot(pos.x*ratio, pos.y * sin(currentRotation), c)
        }
        else{
            drawDot(pos.x*ratio, pos.y, c)
        }
    }
    return currentRotation

}


function polarToCartesian(r, theta) {

    // Convert polar to cartesian
    let x = r * cos(theta);
    let y = r * sin(theta);
    return createVector(x, y)
}



function drawDot(x, y, c) {
    strokeWeight(20);
    stroke(c)
    point(x, y);
}


// ############  Scanner #########
function modeScannerHorizontal() {
    movingBarLeftRight(true)
}


scannerCounter = 0
scannerSpeed = 1
scannerSteps = 200
scannerWidth = 15


function movingBarLeftRight(singleDouble) {


    vStart = createVector(leftEdge, bottomPos)
    vEnd = createVector(rightEdge, bottomPos)

    scannerCounter += scannerSpeed
    scannerCounter = scannerCounter % scannerSteps

    barPos = pingPong(vStart, vEnd, scannerSteps, scannerCounter)
    drawBarGreen(barPos.x, barPos.y, scannerWidth, height)
    if (singleDouble) {
        drawBarGreen(-barPos.x, barPos.y, scannerWidth, height)
    }
}

function drawBarGreen(x, y, w, h) {
    drawBar(x, y, w, h, 0, 255, 0)
}

function drawBar(x, y, w, h, r, g, b) {
    fill(r, g, b);
    noStroke();
    rect(x, y, w, h);
}

//lerp including reverse
function pingPong(vStart, vEnd, steps, currrentStep) {

    if (currrentStep < steps / 2) {
        delta = float(currrentStep) / (steps / 2)
        return p5.Vector.lerp(vStart, vEnd, delta)
    }
    delta = float(currrentStep - (steps / 2)) / (steps / 2)
    return p5.Vector.lerp(vEnd, vStart, delta)


}
tpp = 0.0
function testPingPont() {
    tpp += 0.1
    left = createVector(-width / 2 + 10, 0)
    right = createVector(width / 2 - 10, 0)
    v = pingPong(left, right, 50, tpp)
    drawDot(v.x, v.y, color(255,0,255))
    tpp = tpp % 50
}
