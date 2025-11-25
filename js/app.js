/*-------------------------------- Constants --------------------------------*/
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gravity = 0.5;
const jumping = -8;
// images upload:
const backgroundImg = new Image();
backgroundImg.src = '/kitty-phantom-project/assets/sunflower.jpg';

const catImg = new Image();
catImg.src = '/kitty-phantom-project/assets/orange.png'

const pipeImg = new Image();
pipeImg.src = '/kitty-phantom-project/assets/pipes.purple.png'

/*-------------------------------- Variables --------------------------------*/
let cat = {
    x: 60,
    y: 190,
    width: 60,
    height: 60,
    dy: 0
};

let running = false;
let gameOver = false;
let score = 0;
let backGWidth = 0;
let scrollSpeed = 1.5;
let pipes = [];

/*------------------------ Cached Element References ------------------------*/
const homeScreen = document.querySelector('#homeScreen');
const gameScreen = document.querySelector('#gameScreen');
const startBtnEl = document.querySelector('#start');
const gameOverBox = document.querySelector('#gameOverBox');
const gameOverMessageEl = document.querySelector('#gameOverMessage');
const playAgainBtnEl = document.querySelector('#playAgain');
const clickMessageEl = document.querySelector('#clickMessage');
const homeBtnEl = document.querySelector('#home')
const scoreEnd = document.querySelector('#score');
/*-------------------------------- Functions --------------------------------*/
function showGameOver() {
    gameOverBox.style.display = 'block';
}

function hideGameOver() {
    gameOverBox.style.display = 'none';
}
function showClickMessage() {
    clickMessageEl.style.display = 'block';
}

function hideClickMessage() {
    clickMessageEl.style.display = 'none';
}

function createPipe() {
    const width = 60;
    const minGap = 160;
    const maxGap = 220;
    const gapHeight = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

    const minY = 50;
    const maxY = canvas.height - gapHeight - 50;
    const gapY = Math.floor(Math.random() * (maxY - minY + 1) + minY);

    const pipe = {
        x: canvas.width,
        width: width,
        gapY: gapY,
        gapHeight: gapHeight,
        speed: 3,
        passed: false
    };
    pipes.push(pipe);

    if (score >= 7) {
        pipe.speed = 4
    }

    if (score >= 14) {
        pipe.speed = 5
    }
}

function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= pipe.speed;

        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
        if (!pipe.passed && pipe.x + pipe.width < cat.x) {
            pipe.passed = true;
            score++;
        }
    });
}

function drawPipes() {
    ctx.fillStyle = 'rgb(39, 4, 41)';
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.gapY);
        ctx.drawImage(pipeImg, pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, canvas.height - (pipe.gapY + pipe.gapHeight));
    });
}


function drawCat() {
    ctx.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);

}


function jump() {
    if (running) cat.dy = jumping;
}

function updateCat() {
    cat.dy += gravity;
    cat.y += cat.dy;

    if (cat.y <= 0) {
        cat.y = 0;
        cat.dy = 0;
        gameOver = true;
        running = false;
        showGameOver();
    }

    if (cat.y + cat.height > canvas.height) {
        cat.y = canvas.height - cat.height;
        cat.dy = 0;
        gameOver = true;
        running = false;
        showGameOver();

    }

}

function drawScore() {
    ctx.font = '12px "Press Start 2P" '
    ctx.fillStyle = '#f4e5cfff'
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function collisionDetection() {
    pipes.forEach(pipe => {
        const hitX = cat.x + cat.width > pipe.x && cat.x < pipe.x +     pipe.width;
        const hitTop = cat.y < pipe.gapY;
        const hitBottom = cat.y + cat.height > pipe.gapY + pipe.gapHeight;
        if (hitX && (hitTop || hitBottom)) {
            gameOver = true;
            running = false;
            showGameOver();
        }
    });
}

function drawScoreEnd() {
    scoreEnd.innerText = (`score: ${score}`);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImg, backGWidth, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backGWidth + canvas.width, 0, canvas.width, canvas.height);
    backGWidth -= scrollSpeed;
    scrollSpeed = 1.5 + score * 0.05;

    if (backGWidth <= -canvas.width) {
        backGWidth = 0;
    }

    if (running) {
        updateCat();
        updatePipes();
        collisionDetection();
        drawPipes();
        drawCat();
        drawScore();

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
            createPipe();
        }
        requestAnimationFrame(gameLoop);


    }
};

/*----------------------------- Event Listeners -----------------------------*/

startBtnEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backGWidth, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backGWidth + canvas.width, 0, canvas.width, canvas.height);
    startBtnEl.style.display = 'none';
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    showClickMessage();
    drawCat();
});

clickMessageEl.addEventListener('click', () => {
    hideClickMessage();
    cat.y = 190;
    cat.dy = 0;
    pipes.length = 0;
    createPipe();
    gameOver = false;
    running = true;
    gameLoop();
});

playAgainBtnEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cat.y = 190;
    cat.dy = 0;
    score = 0;
    pipes = [];
    hideGameOver();
    gameScreen.style.display = "flex";
    homeScreen.style.display = "none";
    startBtnEl.style.display = 'none';
    gameOver = false;
    running = true;
    gameLoop();

});

homeBtnEl.addEventListener('click', () => {
    hideGameOver();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameScreen.style.display = "none";
    homeScreen.style.display = "flex";
    startBtnEl.style.display = 'block';
    gameOver = false;
    running = false;
    score = 0;
    cat.y = 190;
    cat.dy = 0;

});


document.addEventListener('keydown', (e) => {
    if (e.code === "Space" && clickMessageEl.style.display === 'block') {
        clickMessageEl.click();
    } else if (running) {
        jump();
    }
});


document.addEventListener('mousedown', () => {
    if (running) jump();
});


