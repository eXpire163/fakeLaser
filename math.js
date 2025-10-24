// ===== GAME STATE =====
let gameState = 'waiting'; // 'waiting', 'playing', 'gameOver'
let score = 0;
let lives = 5;
let currentEquation = {};
let userInput = '';
let timeLimit = 5;
let timeRemaining = 5;
let lastFrameTime = 0;

// ===== SETUP =====
function setup() {
    createCanvas(1200, 700);
    textAlign(CENTER, CENTER);
    lastFrameTime = millis();
}

// ===== MAIN DRAW LOOP =====
function draw() {
    background(20, 20, 40);

    if (gameState === 'waiting') {
        drawWaitingScreen();
    } else if (gameState === 'playing') {
        updateTimer();
        drawGame();
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
    text('Use number keys (0-9) to type your answer', width / 2, height / 2 + 170);
    text('Press ENTER to submit', width / 2, height / 2 + 200);
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
        loseLife();
    }
}

// ===== GAME LOGIC =====
function startGame() {
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
        timeLimit = 5;
    } else if (score < 40) {
        timeLimit = 4;
    } else {
        timeLimit = 3;
    }

    timeRemaining = timeLimit;
    lastFrameTime = millis();
}

function checkAnswer() {
    let answer = parseInt(userInput);

    if (answer === currentEquation.answer) {
        score++;
        generateNewEquation();
    } else {
        loseLife();
    }
}

function loseLife() {
    lives--;

    if (lives <= 0) {
        gameState = 'gameOver';
    } else {
        generateNewEquation();
    }
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
            }
        }

        // Backspace
        if (keyCode === BACKSPACE) {
            userInput = userInput.slice(0, -1);
        }

        // Enter to submit
        if (keyCode === ENTER && userInput.length > 0) {
            checkAnswer();
        }
    }
}

// ==========================================
// TODO: FUTURE ENHANCEMENTS
// ==========================================
// - [ ] Add highscore tracking system (local storage)
// - [ ] Add sound effects (correct answer, wrong answer, lose life)
// - [ ] Add background music
// - [ ] Add animations (score pop-up, shake on wrong answer)
// - [ ] Add particle effects for correct answers
// - [ ] Add difficulty levels (easy: 1-5, medium: 1-10, hard: 1-15)
// - [ ] Add different operation modes (addition, subtraction, division)
// - [ ] Add combo multiplier for consecutive correct answers
// - [ ] Add visual feedback (color flash on correct/incorrect)
// - [ ] Add statistics (accuracy percentage, average time per answer)
// - [ ] Add achievement system
// - [ ] Add practice mode (no lives, no timer)
// ==========================================
