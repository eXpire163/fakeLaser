// ===== GAME STATE =====
let gameState = 'waiting'; // 'waiting', 'playing', 'gameOver', 'feedback'
let score = 0;
let lives = 5;
let currentEquation = {};
let userInput = '';
let timeLimit = 5;
let timeRemaining = 5;
let lastFrameTime = 0;
let feedbackState = null; // 'correct' or 'incorrect'
let feedbackTimer = 0;
let feedbackDuration = 0.7; // seconds

// ===== SOUND =====
let successOsc, failOsc;
let envelope;
let audioReady = false;

// ===== SETUP =====
function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    lastFrameTime = millis();

    // Initialize sound synthesizers for retro NES-style sounds
    setupSounds();
}

// ===== SOUND SETUP =====
function setupSounds() {
    // Create oscillators (sound generators)
    successOsc = new p5.Oscillator('square');
    failOsc = new p5.Oscillator('square');

    // Create envelope for controlling sound duration
    envelope = new p5.Envelope();
    envelope.setADSR(0.01, 0.1, 0.3, 0.2);
    envelope.setRange(0.3, 0);

    successOsc.amp(0);
    failOsc.amp(0);
    successOsc.start();
    failOsc.start();
}

// ===== ENABLE AUDIO =====
function enableAudio() {
    if (!audioReady && getAudioContext().state !== 'running') {
        userStartAudio().then(() => {
            audioReady = true;
            console.log('Audio enabled!');
        });
    }
}

// ===== SOUND EFFECTS =====
function playSuccessSound() {
    // Pick a random success melody (9 variations)
    let melody = floor(random(9));

    switch (melody) {
        case 0: // Classic ascending
            playNotes(successOsc, [523.25, 659.25, 783.99], [80, 80]);
            break;
        case 1: // Power-up
            playNotes(successOsc, [392.00, 523.25, 659.25, 783.99], [60, 60, 80]);
            break;
        case 2: // Victory fanfare
            playNotes(successOsc, [659.25, 783.99, 1046.50], [70, 70]);
            break;
        case 3: // Happy bounce
            playNotes(successOsc, [523.25, 783.99, 659.25, 880.00], [60, 50, 70]);
            break;
        case 4: // Coin collect
            playNotes(successOsc, [987.77, 1318.51], [50]);
            break;
        case 5: // Level up
            playNotes(successOsc, [523.25, 587.33, 659.25, 783.99, 880.00], [50, 50, 50, 80]);
            break;
        case 6: // Quick win
            playNotes(successOsc, [659.25, 880.00, 1046.50, 1318.51], [40, 40, 60]);
            break;
        case 7: // Arpeggio up
            playNotes(successOsc, [523.25, 659.25, 783.99, 1046.50, 1318.51], [40, 40, 40, 60]);
            break;
        case 8: // Cheerful
            playNotes(successOsc, [659.25, 523.25, 783.99, 659.25], [50, 50, 70]);
            break;
    }
}

// Helper function to play a sequence of notes
function playNotes(osc, frequencies, delays) {
    envelope.setADSR(0.01, 0.05, 0.1, 0.1);
    envelope.setRange(0.2, 0);

    osc.freq(frequencies[0]);
    envelope.play(osc);

    let totalDelay = 0;
    for (let i = 1; i < frequencies.length; i++) {
        totalDelay += delays[i - 1];
        setTimeout(() => {
            osc.freq(frequencies[i]);
            envelope.play(osc);
        }, totalDelay);
    }
}

function playFailSound() {
    // Classic NES fail sound: descending notes with harsh tone
    failOsc.freq(392.00); // G4
    envelope.setADSR(0.01, 0.1, 0.2, 0.15);
    envelope.setRange(0.25, 0);
    envelope.play(failOsc);

    setTimeout(() => {
        failOsc.freq(293.66); // D4
        envelope.play(failOsc);
    }, 100);

    setTimeout(() => {
        failOsc.freq(196.00); // G3
        envelope.play(failOsc);
    }, 200);
}

// ===== RESPONSIVE CANVAS =====
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ===== MAIN DRAW LOOP =====
function draw() {
    background(20, 20, 40);

    if (gameState === 'waiting') {
        drawWaitingScreen();
    } else if (gameState === 'playing') {
        updateTimer();
        drawGame();
    } else if (gameState === 'feedback') {
        updateFeedback();
        drawFeedback();
    } else if (gameState === 'gameOver') {
        drawGameOverScreen();
    }
}

// ===== WAITING SCREEN =====
function drawWaitingScreen() {
    fill(255);
    textSize(64);
    text('Math Training', width / 2, height / 2 - 100);

    textSize(32);
    text('Practice your multiplication tables!', width / 2, height / 2 - 20);

    textSize(24);
    fill(100, 255, 100);
    text('Press SPACE to start', width / 2, height / 2 + 80);

    textSize(18);
    fill(200);
    text('Answer equations before time runs out!', width / 2, height / 2 + 140);
    text('Just type your answer - it auto-submits!', width / 2, height / 2 + 170);
    text('Use BACKSPACE to correct mistakes', width / 2, height / 2 + 200);
}

// ===== GAME OVER SCREEN =====
function drawGameOverScreen() {
    fill(255, 100, 100);
    textSize(72);
    text('GAME OVER', width / 2, height / 2 - 100);

    fill(255);
    textSize(48);
    text(`Final Score: ${score}`, width / 2, height / 2);

    textSize(24);
    fill(100, 255, 100);
    text('Press SPACE to play again', width / 2, height / 2 + 100);
}

// ===== MAIN GAME DRAWING =====
function drawGame() {
    // Draw HUD
    drawHUD();

    // Draw equation
    drawEquation();

    // Draw timer bar
    drawTimerBar();
}

// ===== HUD (SCORE & LIVES) =====
function drawHUD() {
    // Score
    fill(255);
    textSize(32);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 40, 40);

    // Lives (hearts)
    textAlign(LEFT, TOP);
    let heartX = width - 250;
    let heartY = 40;
    textSize(36);
    for (let i = 0; i < lives; i++) {
        fill(255, 50, 50);
        text('❤', heartX + i * 45, heartY);
    }

    // Empty hearts for lost lives
    for (let i = lives; i < 5; i++) {
        fill(80, 80, 80);
        text('❤', heartX + i * 45, heartY);
    }
}

// ===== EQUATION DISPLAY =====
function drawEquation() {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(64);

    let equation = `${currentEquation.num1} × ${currentEquation.num2} =`;
    text(equation, width / 2, height / 2 - 80);

    // User input
    fill(100, 200, 255);
    textSize(72);
    let displayInput = userInput || '_';
    text(displayInput, width / 2, height / 2 + 20);
}

// ===== FEEDBACK DISPLAY =====
function drawFeedback() {
    // Draw HUD (still visible during feedback)
    drawHUD();

    textAlign(CENTER, CENTER);

    // Color based on correct/incorrect
    if (feedbackState === 'correct') {
        fill(50, 255, 50); // Bright green
    } else {
        fill(255, 50, 50); // Bright red
    }

    textSize(64);
    let equation = `${currentEquation.num1} × ${currentEquation.num2} =`;
    text(equation, width / 2, height / 2 - 80);

    // Show the answer
    textSize(72);
    text(currentEquation.answer, width / 2, height / 2 + 20);
}

function updateFeedback() {
    let currentTime = millis();
    let deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    feedbackTimer -= deltaTime;

    if (feedbackTimer <= 0) {
        // Check if game is over after feedback
        if (lives <= 0) {
            gameState = 'gameOver';
        } else {
            generateNewEquation();
            gameState = 'playing';
        }
    }
}

// ===== TIMER BAR =====
function drawTimerBar() {
    let barWidth = 400;
    let barHeight = 20;
    let barX = width / 2 - barWidth / 2;
    let barY = height / 2 + 120;

    // Background
    fill(60);
    noStroke();
    rect(barX, barY, barWidth, barHeight, 10);

    // Timer fill
    let fillAmount = (timeRemaining / timeLimit) * barWidth;
    if (timeRemaining / timeLimit > 0.5) {
        fill(100, 255, 100);
    } else if (timeRemaining / timeLimit > 0.25) {
        fill(255, 200, 50);
    } else {
        fill(255, 100, 100);
    }
    rect(barX, barY, fillAmount, barHeight, 10);
}

// ===== TIMER UPDATE =====
function updateTimer() {
    let currentTime = millis();
    let deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
    lastFrameTime = currentTime;

    timeRemaining -= deltaTime;

    if (timeRemaining <= 0) {
        // Timeout - treat as incorrect answer
        userInput = ''; // Clear any partial input
        loseLife();
        showFeedback('incorrect');
    }
}

// ===== GAME LOGIC =====
function startGame() {
    // Enable audio on first user interaction
    enableAudio();

    gameState = 'playing';
    score = 0;
    lives = 5;
    generateNewEquation();
}

function generateNewEquation() {
    currentEquation = {
        num1: floor(random(1, 11)),
        num2: floor(random(1, 11)),
    };
    currentEquation.answer = currentEquation.num1 * currentEquation.num2;

    userInput = '';

    // Calculate time limit based on score
    if (score < 20) {
        timeLimit = 7;
    } else if (score < 40) {
        timeLimit = 5;
    } else {
        timeLimit = 4;
    }

    timeRemaining = timeLimit;
    lastFrameTime = millis();
}

function checkAnswer() {
    let answer = parseInt(userInput);

    if (answer === currentEquation.answer) {
        score++;
        showFeedback('correct');
    } else {
        loseLife();
        showFeedback('incorrect');
    }
}

function showFeedback(type) {
    feedbackState = type;
    feedbackTimer = feedbackDuration;
    gameState = 'feedback';
    lastFrameTime = millis();

    // Play sound effect
    if (type === 'correct') {
        playSuccessSound();
    } else {
        playFailSound();
    }
}

function autoCheckAnswer() {
    // Auto-submit when input length matches answer length
    let answerLength = currentEquation.answer.toString().length;
    if (userInput.length === answerLength) {
        checkAnswer();
    }
}

function loseLife() {
    lives--;

    if (lives <= 0) {
        // Don't set game over immediately if we're showing feedback
        // The feedback timer will handle transitioning to game over
        if (gameState !== 'feedback') {
            gameState = 'gameOver';
        }
    }
    // Note: generateNewEquation() is called after feedback timer
}

// ===== KEYBOARD INPUT =====
function keyPressed() {
    if (key === ' ') {
        if (gameState === 'waiting' || gameState === 'gameOver') {
            startGame();
        }
        return;
    }

    if (gameState === 'playing') {
        // Number input
        if (key >= '0' && key <= '9') {
            if (userInput.length < 4) { // Limit input length
                userInput += key;
                autoCheckAnswer(); // Auto-submit when length matches
            }
        }

        // Backspace
        if (keyCode === BACKSPACE) {
            userInput = userInput.slice(0, -1);
        }

        // Enter to submit (still works as manual override)
        if (keyCode === ENTER && userInput.length > 0) {
            checkAnswer();
        }
    }

    // Skip feedback early with SPACE (optional feature)
    if (gameState === 'feedback' && key === ' ') {
        feedbackTimer = 0; // Skip to next question immediately
    }
}

// ==========================================
// TODO: FUTURE ENHANCEMENTS
// ==========================================
// - [ ] Add highscore tracking system (local storage)
// - [x] Add sound effects (correct answer, wrong answer, lose life) ✓
// - [ ] Add background music
// - [ ] Add animations (score pop-up, shake on wrong answer)
// - [ ] Add particle effects for correct answers
// - [ ] Add difficulty levels (easy: 1-5, medium: 1-10, hard: 1-15)
// - [ ] Add different operation modes (addition, subtraction, division)
// - [ ] Add combo multiplier for consecutive correct answers
// - [x] Add visual feedback (color flash on correct/incorrect) ✓
// - [ ] Add statistics (accuracy percentage, average time per answer)
// - [ ] Add achievement system
// - [ ] Add practice mode (no lives, no timer)
// - [ ] Add game over sound
// - [ ] Add start game sound
// - [ ] Add time running out warning sound
// ==========================================
