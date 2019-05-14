function showHiddenContent(){
    normalView.style.display = "none";
    hiddenContent.style.display = "block";
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
    hiddenContent.style.display = "none";
    normalView.style.display = "block";
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

CANVAS_BACKGROUND_COLOUR = 'white';
CANVAS_BORDER_COLOUR = 'black';
APPLE_BACKGROUND_COLOUR = 'red';
APPLE_BORDER_COLOUR = 'darkred';
SNAKE_BACKGROUND_COLOUR ='lightgreen';
SNAKE_BORDER_COLOUR = 'darkgreen';

//This returns a 2d drawing context
var context = canvas.getContext("2d");

//These using the variables above to select colors for the canvas
context.fillStyle = CANVAS_BACKGROUND_COLOUR;
context.strokeStyle = CANVAS_BORDER_COLOUR;


//These draws a filled rectangle with a border
context.fillRect(0,0, canvas.width, canvas.height);
context.strokeRect(0,0, canvas.width, canvas.height);

quit = false;
playing = false;
appleX=0;
appleY=0;

score = 0;
highScore = 100;

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

function main() {
    if(isGameOver()){
        restartGame.style.display="inline";
        if(score>highScore){
            highScore = score;
            document.getElementById("highScore").innerHTML = highScore;
        }
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
    }, 100)
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
    head = {x: snake[0].x +dx, y: snake[0].y + dy};
    snake.unshift(head);

    if(head.x == appleX && head.y == appleY){
        generateApple();
        score += 10;
        if(score>=highScore){
            document.getElementById("highScore").innerHTML = score;
            CANVAS_BACKGROUND_COLOUR = getRandomColor();
            CANVAS_BORDER_COLOUR = getRandomColor();
            APPLE_BACKGROUND_COLOUR = getRandomColor();
            APPLE_BORDER_COLOUR = getRandomColor();
            SNAKE_BACKGROUND_COLOUR = getRandomColor();
            SNAKE_BORDER_COLOUR = getRandomColor();

        }
        document.getElementById("score").innerHTML = score;
        snake.push({x: 130-score, y: 150})
    }
    snake.pop();
}

function isGameOver() {
    for (i = 4; i < snake.length; i++) {
         gameOver = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (gameOver) return true;
    }
     hitLeftWall = snake[0].x < 0;
     hitRightWall = snake[0].x > canvas.width - 10;
     hitToptWall = snake[0].y < 0;
     hitBottomWall = snake[0].y > canvas.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function clear(){
    context.fillStyle = CANVAS_BACKGROUND_COLOUR;
    context.strokeStyle = CANVAS_BORDER_COLOUR;
    context.fillRect(0,0, canvas.width, canvas.height);
    context.strokeRect(0,0, canvas.width, canvas.height);
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
    appleX = random(0, canvas.width-10);
    appleY = random(0, canvas.height-10);

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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}