
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

// Audio analysis variables
var songDuration = 0
var audioLevels = []
var isAnalyzing = false
var currentSecond = 0
var barWidth = 0


function preload() {
    song = loadSound('assets/zf.mp3', () => {
        console.log('Song loaded successfully');
        songDuration = song.duration();
        console.log('Song duration:', songDuration, 'seconds');
        // Initialize array to store audio levels for each second
        audioLevels = new Array(Math.ceil(songDuration)).fill(0);
        barWidth = width / audioLevels.length;
    });
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

    // Calculate bar width based on song duration
    if (songDuration > 0) {
        barWidth = width / Math.ceil(songDuration);
    }

    bar = new Bar(settings);
}
let moovesum = 0
function draw() {
    background(20);
    translate(width / 2, height / 2)

    // Analyze current audio
    fft.analyze();
    var spectrum = fft.getEnergy("bass");
    var moove = spectrum > 200 ? 2 : 0
    moovesum += moove;
    if (moovesum > 400) {
        bar.movingBarSplitterTopBottom(7, moove);
    } else if (moovesum > 800) {
        moovesum = 0; // Reset after a certain threshold

    } else {
        bar.movingBarLeftRight(true, moove);
    }
    //console.log('Moovesum:', moovesum);


    //bar.movingBarLeftRight(true, moove);

    // If song is playing, collect audio level data
    if (song.isPlaying()) {
        collectAudioLevels();
    }

    // Draw the audio level bars
    drawAudioLevelBars();
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
    } else {
        song.play();
    }
}

function collectAudioLevels() {
    if (songDuration > 0) {
        // Get current time in the song
        let currentTime = song.currentTime() * 10.0;
        //console.log('Current time:', currentTime, 'seconds');
        let secondIndex = Math.floor(currentTime);

        // Get overall energy level
        let energy = fft.getEnergy(20, 20000); // Full frequency range

        // Store the maximum energy for this second (to capture peaks)
        if (secondIndex < audioLevels.length) {
            audioLevels[secondIndex] = Math.max(audioLevels[secondIndex], energy);
        }
    }
}

function drawAudioLevelBars() {
    if (audioLevels.length === 0) return;

    push();
    // Reset translation to draw from bottom of screen
    translate(-width / 2, height / 2);

    // Draw bars for each second
    for (let i = 0; i < audioLevels.length; i++) {
        let level = audioLevels[i];
        let barHeight = map(level, 0, 255, 0, height * 0.8); // Scale to 80% of screen height

        // Color based on intensity
        let hue = map(level, 0, 255, 240, 0); // Blue to red
        colorMode(HSB);
        fill(hue, 255, 255, 150); // Semi-transparent
        noStroke();

        // Draw bar from bottom up
        rect(i * barWidth / 10, -barHeight, barWidth / 10 - 1, barHeight);
    }

    // Draw current playback position
    if (song.isPlaying()) {
        let currentTime = song.currentTime();
        let currentX = (currentTime / songDuration) * width;

        stroke(255, 255, 255);
        strokeWeight(2);
        line(currentX, -height, currentX, 0);
    }

    colorMode(RGB);
    pop();
}
