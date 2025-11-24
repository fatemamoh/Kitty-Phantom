/*-------------------------------- Constants --------------------------------*/
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gravity = 0.5;
const jumping = -8;
let pipes = [];
const backgroundImg = new Image();
backgroundImg.src = '/kitty-phantom-project/assets/background.gif';
/*-------------------------------- Variables --------------------------------*/
let cat = {
    x: 60,
    y: 190,
    width: 30,
    height: 30,
    dy: 0
};


let running = false;
let gameOver = false;
let score = 0;
/*------------------------ Cached Element References ------------------------*/
const homeScreen = document.querySelector('#homeScreen');
const gameScreen = document.querySelector('#gameScreen');
const startBtnEl = document.querySelector('#start');
const gameOverBox = document.querySelector('#gameOverBox');
const gameOverMessageEl = document.querySelector('#gameOverMessage');
const playAgainBtnEl = document.querySelector('#playAgain');
const clickMessageEl = document.querySelector('#clickMessage');
const playerName = document.querySelector('#name');
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
    const width = 50;
    const minGap = 140;
    const maxGap = 180;
    const gapHeight = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

    const minY = 50;
    const maxY = canvas.height - gapHeight - 50;
    const gapY = Math.floor(Math.random() * (maxY - minY + 1) + minY);

    const pipe = {
        x: canvas.width,
        width: width,
        gapY: gapY,
        gapHeight: gapHeight,
        speed: 3
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

    });
}

function drawPipes() {
    ctx.fillStyle = 'rgb(39, 4, 41)';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapY);
        ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, canvas.height - (pipe.gapY + pipe.gapHeight));
    });
}


function drawCat() {
    ctx.fillStyle = 'purple';
    ctx.fillRect(cat.x, cat.y, cat.width, cat.height);
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
    ctx.fillStyle = '#92169b'
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function collisionDetection() {
    pipes.forEach(pipe => {
        const hitX = cat.x + cat.width > pipe.x && cat.x < pipe.x + pipe.width;
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

    
    if (running) {
        drawCat();
        updateCat();
        drawPipes();
        updatePipes();
        collisionDetection();
        drawScore();
        requestAnimationFrame(gameLoop);
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
            createPipe();
            score++;

        }

        else {
            drawCat();
            drawScore();
            drawScoreEnd();
        }
    }
};

/*----------------------------- Event Listeners -----------------------------*/

startBtnEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtnEl.style.display = 'none';
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    clickMessageEl.style.display = 'block';
    drawCat();
    drawPipes();
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
    console.log('salman ' + running)
    gameLoop();

});

homeBtnEl.addEventListener('click', () => {
    hideGameOver();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameScreen.style.display = "none";
    homeScreen.style.display = "flex";
    startBtnEl.style.display = 'block';
    clickMessageEl.style.display = 'block';
    gameOver = false;
    running = false;
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

backgroundImg.onload = function drawBackground() {
    ctx.drawImage(backgroundImg,canvas.height, canvas.width);
}