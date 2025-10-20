
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


var song
var fft

var bar


function preload() {
    song = loadSound('assets/zf.mp3');
}

function setup() {

    fft = new p5.FFT();
    fft.analyze(song);

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
    createCanvas(width, height);

    bar = new Bar(settings);
}

function draw() {
    background(20);
    translate(width / 2, height / 2)
    //var spectrum = fft.waveform();
    fft.analyze();
    var spectrum = fft.getEnergy("bass");
    var moove = spectrum > 200 ? 2 : 0
    bar.movingBarLeftRight(true, moove);
    //console.log(spectrum);



    //fill(spectrum, 255, 255);
    // rect(width / 2 - spectrum, height / 2 - spectrum, spectrum * 2, spectrum * 2);
    // for (var i = 0; i < spectrum.length; i++) {

    //     var x = i * 40;
    //     var rHeight = map(spectrum[i], 0, 1, 0, height);
    //     fill(x % 254, 255, 255); // spectrum is purple
    //     rect(x, height / 2, 10, rHeight);
    // }
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}
