const gridWidth = 20;
const gridHeight = 20;
var grid;
var squareWidth, squareHeight;

function setup() {
    createCanvas(500, 500);

    squareWidth = width / gridWidth;
    squareHeight = height / gridHeight;

    // snake = [{ x: gridWidth / 2, y: gridHeight / 2 }];
    snake = []
    for (let i = 0; i < 10; i++) {
        snake.push({ x: gridWidth / 2, y: gridHeight / 2 });
    }
    snakeDir = { x: 1, y: 0 };

    apples = [];
    generateApple();
    generateApple();
}

var snake;
var snakeDir;
var apples;

function draw() {
    if (frameCount % 10 == 0) {
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
    let newPos = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y }
    if (contains(snake, newPos)) {
        gameOver();
    }
    snake.splice(0, 0, newPos);


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
    if (keyCode == 37 && snakeDir.x == 0) {
        snakeDir = { x: -1, y: 0 };
    } else if (keyCode == 39 && snakeDir.x == 0) {
        snakeDir = { x: 1, y: 0 };
    } else if (keyCode == 38 && snakeDir.y == 0) {
        snakeDir = { x: 0, y: -1 };
    } else if (keyCode == 40 && snakeDir.y == 0) {
        snakeDir = { x: 0, y: 1 };
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