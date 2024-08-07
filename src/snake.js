// This would be stored in the 'src' folder of the GitHub repository
// snake.js

// 建立新的 canvas 元素並添加到 DOM
const gameCanvas = document.createElement("canvas");
gameCanvas.id = "gameCanvas";
gameCanvas.width = 400;
gameCanvas.height = 400;
document.body.appendChild(gameCanvas);

// 獲取 2D 渲染上下文
const ctx = gameCanvas.getContext("2d");

const box = 20; // 每個方塊的大小
let snake = [{ x: 9 * box, y: 9 * box }]; // 蛇的初始位置
let direction = "RIGHT"; // 蛇的初始方向
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // 食物的初始位置

document.addEventListener("keydown", directionControl);

function directionControl(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= gameCanvas.width || snakeY < 0 || snakeY >= gameCanvas.height || collision(newHead, snake)) {
        clearInterval(game);
        console.error("Game Over!");
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);
