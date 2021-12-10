const gridWidth = 20;
const gridHeight = 20;
var grid;
var squareWidth, squareHeight;
var snake;
var snakeDir;
var apples;
var hasTurned;
var nextMove;

function setup() {
    createCanvas(500, 500);

    squareWidth = width / gridWidth;
    squareHeight = height / gridHeight;

    snake = [{ x: gridWidth / 2, y: gridHeight / 2 }];
    snakeDir = { x: 1, y: 0 };
    apples = [];

    hasTurned = false;
    nextMove = null;

    generateApple();
    generateApple();
}


function draw() {
    let advance = frameCount % (10 - Math.floor(snake.length * 1 / 10)) == 0;
    if (advance) {
        render();
        tick();
    }
}

function generateApple() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (contains([...apples, ...snake], pos));

    apples.push(pos);
}

function tick() {
    if (snake.length > 1) {
        snake.pop();
    }
    if (!hasTurned && nextMove) {
        makeMove(nextMove);
        nextMove = null;
    }
    let newPos = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y }
    if (newPos.x < 0 || newPos.x > gridWidth || newPos.y < 0 || newPos.y > gridHeight || contains(snake, newPos)) {
        gameOver();
    }
    snake.splice(0, 0, newPos);
    hasTurned = false;


    let toRemove = [];
    if (contains(apples, snake[0])) {
        snake.push(Object.assign({}, snake[snake.length - 1]))
        toRemove.push(snake[0]);
        generateApple();
    }

    apples = apples.filter(a => !contains(toRemove, a));
}

function render() {
    clear();
    for (let i = 0; i < snake.length; i++) {
        let sect = snake[i];
        if (i == 0) {
            fill("red");
        } else {
            fill("green")
        }
        rect(sect.x * squareWidth, sect.y * squareHeight, squareWidth, squareHeight);
    }

    for (let a of apples) {
        fill("orange");
        rect(a.x * squareWidth, a.y * squareHeight, squareWidth, squareHeight);
    }

    drawScore();
}

function keyPressed() {
    if (keyCode == 37) {
        makeMove("L");
    } else if (keyCode == 39) {
        makeMove("R");
    } else if (keyCode == 38) {
        makeMove("U");
    } else if (keyCode == 40) {
        makeMove("D");
    }
}

function gameOver() {
    textAlign(CENTER);
    textSize(60);
    fill("red")
    text("Game Over!", width / 2, height / 2);
    noLoop();
}

function drawScore() {
    textAlign(LEFT, TOP);
    textSize(20);
    fill("black")
    text(`Score: ${snake.length}`, 10, 10);
}

function contains(list, pos) {
    for (let i of list) {
        if (pos.x == i.x && pos.y == i.y) {
            return true
        }
    }
    return false;
}


function makeMove(dir) {
    if (!hasTurned) {
        if (dir == "R" && snakeDir.x == 0) {
            hasTurned = true;
            snakeDir = { x: 1, y: 0 };
        } else if (dir == "L" && snakeDir.x == 0) {
            hasTurned = true;
            snakeDir = { x: -1, y: 0 };
        } else if (dir == "U" && snakeDir.y == 0) {
            hasTurned = true;
            snakeDir = { x: 0, y: -1 };
        } else if (dir == "D" && snakeDir.y == 0) {
            hasTurned = true;
            snakeDir = { x: 0, y: 1 };
        }
    } else {
        nextMove = dir;
    }
}

function getInputs() {
    return {
        appleX: apples[0].x - snake[0].x,
        appleY: apples[0].y - snake[0].y,
        dirX: snakeDir.x,
        dirY: snakeDir.y,
        collideU: contains(snake, { x: snake[0].x, y: snake[0].y - 1 }),
        collideD: contains(snake, { x: snake[0].x, y: snake[0].y + 1 }),
        collideL: contains(snake, { x: snake[0].x - 1, y: snake[0].y }),
        collideR: contains(snake, { x: snake[0].x + 1, y: snake[0].y }),
    }
}