let timer = 60;
let score = 0;
let hitrn = 0;
let timerInterval;
let highScore = localStorage.getItem("highScore") || 0;

// Sound Effects
const startMusic = new Audio("assets/startMusic.mp3");
const hitSound = new Audio("assets/hit.mp3");
// const wrongSound = new Audio("wrong.mp3");
const gameOverSound = new Audio("assets/gameOver.mp3");

// Difficulty settings
const difficultySettings = {
    easy: { bubbleCount: 152, tickSpeed: 1000 },
    medium: { bubbleCount: 208, tickSpeed: 1000 },
    hard: { bubbleCount: 250, tickSpeed: 800 },
};

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    document.querySelector("#highscoreval").textContent = highScore;
}

function increaseScore() {
    score += 10;
    document.querySelector("#scoreval").textContent = score;
    updateHighScore();
    hitSound.play();
}

function getNewHit() {
    hitrn = Math.floor(Math.random() * 10);
    document.querySelector("#hitval").textContent = hitrn;
}

function makeBubble(count) {
    let clutter = "";
    for (let i = 1; i <= count; i++) {
        let rn = Math.floor(Math.random() * 10);
        clutter += `<div class="bubble">${rn}</div>`;
    }
    document.querySelector("#pbtm").innerHTML = clutter;
}

function runTimer(speed) {
    clearInterval(timerInterval); // Clear existing timer if any
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.querySelector("#timerval").textContent = timer;
        } else {
            clearInterval(timerInterval);
            gameOver();
        }
    }, speed);
}

function gameOver() {
    gameOverSound.play();
    clearInterval(timerInterval);
    document.querySelector("#pbtm").innerHTML = `
        <h1>Game Over</h1>
        <button id="restartBtn">Restart</button>
    `;
    document.querySelector("#restartBtn").addEventListener("click", () => {
        document.querySelector("#panel").style.display = "block";
        startGame();
    });
}

function startGame() {
    // Reset values
    timer = 60;
    score = 0;
    document.querySelector("#scoreval").textContent = score;
    document.querySelector("#timerval").textContent = timer;
    document.querySelector("#hitval").textContent = "-";

    // Show panel and hide start button
    document.querySelector("#panel").style.display = "block";
    document.querySelector("#startBtn").style.display = "none";

    // Get difficulty
    const difficulty = document.querySelector("#difficulty").value;
    const { bubbleCount, tickSpeed } = difficultySettings[difficulty];

    makeBubble(bubbleCount);
    getNewHit();
    updateHighScore();
    runTimer(tickSpeed);

     //  Play start music
    startMusic.currentTime = 0;
    startMusic.play();
}

// Bubble click event
document.querySelector("#pbtm").addEventListener("click", function (e) {
    if (e.target.classList.contains("bubble")) {
        let clicked = Number(e.target.textContent);
        if (clicked === hitrn) {
            // Burst the bubble
            e.target.classList.add("burst");
            increaseScore();

            // Remake bubbles and new target
            const difficulty = document.querySelector("#difficulty").value;
            setTimeout(() => {
                makeBubble(difficultySettings[difficulty].bubbleCount);
                getNewHit();
            }, 150); // Short delay for burst effect
        } else {
            wrongSound.play();
            gameOver();
        }
    }
});

// Start button click
document.querySelector("#startBtn").addEventListener("click", function () {
    document.querySelector("#startBtn").style.display = "none";
    document.querySelector("#panel").style.display = "block";
    startGame();
});
