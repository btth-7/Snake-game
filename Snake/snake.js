const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20; // size of one square
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [
  { x: 8 * box, y: 10 * box }
];
let direction = 'RIGHT';
let food = randomFood();
let score = 0;
let gameOver = false;

document.addEventListener('keydown', changeDirection);

function randomFood() {
  let foodX = Math.floor(Math.random() * cols) * box;
  let foodY = Math.floor(Math.random() * rows) * box;
  // Don't spawn food on the snake
  while (snake.some(segment => segment.x === foodX && segment.y === foodY)) {
    foodX = Math.floor(Math.random() * cols) * box;
    foodY = Math.floor(Math.random() * rows) * box;
  }
  return { x: foodX, y: foodY };
}

function changeDirection(event) {
  if (gameOver) return;
  if (event.key === "ArrowLeft" && direction !== 'RIGHT') direction = 'LEFT';
  else if (event.key === "ArrowUp" && direction !== 'DOWN') direction = 'UP';
  else if (event.key === "ArrowRight" && direction !== 'LEFT') direction = 'RIGHT';
  else if (event.key === "ArrowDown" && direction !== 'UP') direction = 'DOWN';
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#6ab04c" : "#badc58";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#222";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#eb4d4b";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw score
  document.getElementById('score').textContent = 'Score: ' + score;
}

function update() {
  if (gameOver) return;

  // Get current head
  let head = { ...snake[0] };

  // Move head
  if (direction === 'LEFT') head.x -= box;
  else if (direction === 'RIGHT') head.x += box;
  else if (direction === 'UP') head.y -= box;
  else if (direction === 'DOWN') head.y += box;

  // Collision with wall
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame();
    return;
  }

  // Collision with self
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    snake.unshift(head);
    food = randomFood();
  } else {
    snake.unshift(head);
    snake.pop();
  }
}

function endGame() {
  gameOver = true;
  document.getElementById('score').textContent += " — Game Over! Press F5 to restart.";
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) setTimeout(gameLoop, 100);
}

gameLoop();