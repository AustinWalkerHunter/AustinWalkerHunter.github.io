function showHiddenContent(){
    document.getElementById('gameOverlay').classList.add('active');
    document.body.classList.add('no-scroll');
    quit = false;
    playing = false;
}

function hideHiddenContent(){
    if(playing){
        quit = true;
    }
    score = 0;
    document.getElementById("score").innerHTML = score;
    CANVAS_BACKGROUND_COLOUR = 'white';
    CANVAS_BORDER_COLOUR = 'black';
    APPLE_BACKGROUND_COLOUR = 'red';
    APPLE_BORDER_COLOUR = 'darkred';
    SNAKE_BACKGROUND_COLOUR ='lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    document.getElementById('gameOverlay').classList.remove('active');
    document.body.classList.remove('no-scroll');
    restartGame.style.display = "none";
    playGame.style.display = "inline";
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150}
    ];
    dx = 10;
    dy = 0;
    clear();
    drawSnake();
}

var canvas = document.getElementById("canvas");
var CANVAS_SIZE = 300;
var dpr = window.devicePixelRatio || 1;
canvas.width = CANVAS_SIZE * dpr;
canvas.height = CANVAS_SIZE * dpr;
canvas.style.width = CANVAS_SIZE + 'px';
canvas.style.height = CANVAS_SIZE + 'px';

CANVAS_BACKGROUND_COLOUR = 'white';
CANVAS_BORDER_COLOUR = 'black';
APPLE_BACKGROUND_COLOUR = 'red';
APPLE_BORDER_COLOUR = 'darkred';
SNAKE_BACKGROUND_COLOUR ='lightgreen';
SNAKE_BORDER_COLOUR = 'darkgreen';

var context = canvas.getContext("2d");
context.scale(dpr, dpr);

context.fillStyle = CANVAS_BACKGROUND_COLOUR;
context.strokeStyle = CANVAS_BORDER_COLOUR;
context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
context.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

quit = false;
playing = false;
appleX=0;
appleY=0;

score = 0;
highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
document.getElementById("highScore").innerHTML = highScore;

//The snake starts at 30 pixels long
snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150}
];
// Horizontal velocity
dx = 10;
// Vertical velocity
dy = 0;

drawSnake();

function restart(){
    score = 0;
    document.getElementById("score").innerHTML = score;
    CANVAS_BACKGROUND_COLOUR = 'white';
    CANVAS_BORDER_COLOUR = 'black';
    APPLE_BACKGROUND_COLOUR = 'red';
    APPLE_BORDER_COLOUR = 'darkred';
    SNAKE_BACKGROUND_COLOUR ='lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150}
    ];
    dx = 10;
    dy = 0;
    play();
}


function play(){
    playing = true;
    playGame.style.display ="none";
    generateApple();
    main();
}

function getSpeed() {
    return Math.max(60, 120 - Math.floor(score / 20) * 8);
}

function main() {
    if(isGameOver()){
        restartGame.style.display="inline";
        return;
    }
    if(quit && playing){
        quit = false;
        playing = false;
        return;
    }
    setTimeout(function onTick() {
        changingDirection = false;
        clear();
        drawApple();
        moveSnake();
        drawSnake();
        main();
    }, getSpeed())
}


function drawSnakePart(snakePart){
    context.fillStyle = SNAKE_BACKGROUND_COLOUR;
    context.strokeStyle = SNAKE_BORDER_COLOUR;

    context.fillRect(snakePart.x, snakePart.y, 10, 10);
    context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake(){
    snake.forEach(drawSnakePart);
}

function moveSnake(){
    head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if(head.x == appleX && head.y == appleY){
        generateApple();
        score += 10;
        document.getElementById("score").innerHTML = score;

        if(score > highScore){
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.getElementById("highScore").innerHTML = highScore;
        }

        if(score >= 50){
            CANVAS_BACKGROUND_COLOUR = getRandomColor();
            CANVAS_BORDER_COLOUR = getRandomColor();
            APPLE_BACKGROUND_COLOUR = getRandomColor();
            APPLE_BORDER_COLOUR = getRandomColor();
            SNAKE_BACKGROUND_COLOUR = getRandomColor();
            SNAKE_BORDER_COLOUR = getRandomColor();
        }
    } else {
        snake.pop();
    }
}

function isGameOver() {
    for (i = 4; i < snake.length; i++) {
         gameOver = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (gameOver) return true;
    }
     hitLeftWall = snake[0].x < 0;
     hitRightWall = snake[0].x > CANVAS_SIZE - 10;
     hitToptWall = snake[0].y < 0;
     hitBottomWall = snake[0].y > CANVAS_SIZE - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function clear(){
    context.fillStyle = CANVAS_BACKGROUND_COLOUR;
    context.strokeStyle = CANVAS_BORDER_COLOUR;
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    left = 37;
    right = 39;
    up = 38;
    down = 40;

    goingUp = dy === -10;
    goingDown = dy === 10;
    goingRight = dx === 10;
    goingLeft = dx === -10;

    if (changingDirection) return;
    changingDirection = true;

    if (e.keyCode == up || e.keyCode == down || e.keyCode == right || e.keyCode == left) {
        e.preventDefault();
    }
    if (e.keyCode == up && !goingDown) {
        dx = 0;
        dy = -10;
    }
    else if (e.keyCode == down && !goingUp) {
        dx = 0;
        dy = 10;
    }
    else if (e.keyCode == left && !goingRight) {
        dx = -10;
        dy = 0;
    }
    else if (e.keyCode == right && !goingLeft) {
        dx = 10;
        dy = 0;
    }
}

function random(min, max){
    return Math.round((Math.random() * (max-min) + min)/10)*10;
}

function generateApple(){
    appleX = random(0, CANVAS_SIZE - 10);
    appleY = random(0, CANVAS_SIZE - 10);

    snake.forEach(function isAppleOnSnake(part) {
        appleOnSnake = part.x == appleX && part.y == appleY;
        if(appleOnSnake)
            generateApple();
    });
}

function drawApple(){
    context.fillStyle = APPLE_BACKGROUND_COLOUR;
    context.strokestyle = APPLE_BORDER_COLOUR;
    context.fillRect(appleX, appleY, 10, 10);
    context.strokeRect(appleX, appleY, 10, 10);
}

var touchStartX = 0;
var touchStartY = 0;

canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
    if (!playing) return;

    var swipeX = e.changedTouches[0].clientX - touchStartX;
    var swipeY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(swipeX) < 10 && Math.abs(swipeY) < 10) return;

    if (changingDirection) return;
    changingDirection = true;

    var goingUp = dy === -10;
    var goingDown = dy === 10;
    var goingRight = dx === 10;
    var goingLeft = dx === -10;

    if (Math.abs(swipeX) > Math.abs(swipeY)) {
        if (swipeX > 0 && !goingLeft)  { dx = 10;  dy = 0; }
        else if (swipeX < 0 && !goingRight) { dx = -10; dy = 0; }
    } else {
        if (swipeY > 0 && !goingUp)   { dx = 0; dy = 10;  }
        else if (swipeY < 0 && !goingDown) { dx = 0; dy = -10; }
    }
}, { passive: false });

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}