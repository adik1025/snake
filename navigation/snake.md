---
layout: base
title: Snake
permalink: /snake/
---
<style>
    body {
        margin: 0;
        font-family: "Roboto", Arial, sans-serif;
        background-color: #111;
        color: white;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }


    .menu-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }


    button {
        font-size: 28px;
        padding: 20px 40px;
        background-color: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        text-transform: uppercase;
        box-shadow: 0 5px 20px rgba(76, 175, 80, 0.5);
        transition: all 0.3s ease-in-out;
    }


    button:hover {
        background-color: #45a049;
        transform: scale(1.1);
        box-shadow: 0 10px 40px rgba(76, 175, 80, 0.8);
    }


    canvas {
        display: none;
        border: 10px solid #4caf50;
        margin: 0 auto;
        box-shadow: 0 0 20px #4caf50, 0 0 50px #4caf50;
        background-color: #222;
        transition: background-color 0.5s ease-in-out;
    }


    #score-container {
        position: absolute;
        top: 20px;
        width: 100%;
        text-align: center;
        font-size: 28px;
        color: #4caf50;
        display: none;
    }


    #game-over-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        z-index: 10;
    }


    #game-over-overlay h1 {
        font-size: 48px;
        margin-bottom: 20px;
    }


    #game-over-overlay p {
        font-size: 24px;
        margin-bottom: 30px;
    }


    #game-over-overlay button {
        font-size: 20px;
        padding: 15px 30px;
    }
</style>


<div class="menu-container">
    <button id="start-button">Start Game</button>
</div>


<div id="game-over-overlay">
    <h1>Game Over</h1>
    <p>Your Score: <span id="final-score">0</span></p>
    <button id="restart-button">Restart Game</button>
</div>


<div id="score-container">
    Score: <span id="score_value">0</span>
</div>


<canvas id="snake" width="320" height="320"></canvas>


<script>
    (function () {
        const canvas = document.getElementById("snake");
        const ctx = canvas.getContext("2d");
        const startButton = document.getElementById("start-button");
        const restartButton = document.getElementById("restart-button");
        const gameOverOverlay = document.getElementById("game-over-overlay");
        const finalScore = document.getElementById("final-score");
        const scoreContainer = document.getElementById("score-container");
        const scoreElement = document.getElementById("score_value");


        let snake = [];
        let food = { x: 0, y: 0 };
        let direction = 1;
        let nextDirection = 1;
        let blockSize = 10;
        let score = 0;
        let speed = 150;
        let gameLoop;
        const foodSound = new Audio('/mnt/data/eating_an-apple-slowly-slowly-sfx-253209.mp3');


        const startGame = () => {
            score = 0;
            speed = 150;
            direction = 1;
            nextDirection = 1;
            snake = [{ x: 0, y: 15 }];
            spawnFood();
            updateScore(score);
            canvas.style.display = "block";
            scoreContainer.style.display = "block";
            gameOverOverlay.style.display = "none";
            gameLoop = setInterval(mainLoop, speed);
        };


        const endGame = () => {
            clearInterval(gameLoop);
            finalScore.innerText = score;
            gameOverOverlay.style.display = "flex";
            canvas.style.display = "none";
            scoreContainer.style.display = "none";
        };


        const mainLoop = () => {
            const head = { ...snake[0] };
            direction = nextDirection;


            switch (direction) {
                case 0: head.y--; break;
                case 1: head.x++; break;
                case 2: head.y++; break;
                case 3: head.x--; break;
            }


            if (checkCollision(head)) {
                endGame();
                return;
            }


            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                playFoodSound();
                updateScore(++score);
                adjustSpeed();
                spawnFood();
            } else {
                snake.pop();
            }


            renderGame();
        };


        const renderGame = () => {
            ctx.fillStyle = score > 10 ? "#333" : "#222"; // Slightly dynamic background color
            ctx.fillRect(0, 0, canvas.width, canvas.height);


            ctx.fillStyle = "#4caf50";
            for (const segment of snake) {
                ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
            }


            ctx.fillStyle = "#ff4500";
            ctx.shadowColor = "#ff4500";
            ctx.shadowBlur = 15;
            ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
            ctx.shadowBlur = 0;
        };


        const checkCollision = (head) => {
            if (head.x < 0 || head.y < 0 || head.x >= canvas.width / blockSize || head.y >= canvas.height / blockSize) return true;
            return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        };


        const spawnFood = () => {
            food.x = Math.floor(Math.random() * (canvas.width / blockSize));
            food.y = Math.floor(Math.random() * (canvas.height / blockSize));
        };


        const updateScore = (newScore) => {
            scoreElement.innerText = newScore;
        };


        const adjustSpeed = () => {
            clearInterval(gameLoop);
            speed = Math.max(50, speed - 10);
            gameLoop = setInterval(mainLoop, speed);
        };


        const playFoodSound = () => {
            foodSound.currentTime = 0;
            foodSound.play();
        };


        const changeDirection = (e) => {
            switch (e.key) {
                case "ArrowUp": if (direction !== 2) nextDirection = 0; break;
                case "ArrowRight": if (direction !== 3) nextDirection = 1; break;
                case "ArrowDown": if (direction !== 0) nextDirection = 2; break;
                case "ArrowLeft": if (direction !== 1) nextDirection = 3; break;
            }
        };


        startButton.addEventListener("click", startGame);
        restartButton.addEventListener("click", startGame);
        document.addEventListener("keydown", changeDirection);
    })();
</script>


