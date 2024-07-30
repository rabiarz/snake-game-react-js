import React, { useRef, useEffect, useState } from "react";


const UNIT_SIZE = 20

class Snake {
  constructor(initialPosition) {
    this.segments = initialPosition;
    this.xVelocity = UNIT_SIZE;
    this.yVelocity = 0;
  }

  move() {
    const head = {
      x: this.segments[0].x + this.xVelocity,
      y: this.segments[0].y + this.yVelocity,
    };
    this.segments.unshift(head);
    return head;
  }

  grow() {
    // Do nothing; the snake grows automatically by not popping the tail
  }

  shrink() {
    this.segments.pop();
  }

  changeDirection(newXVelocity, newYVelocity) {
    if (newXVelocity !== -this.xVelocity || newYVelocity !== -this.yVelocity) {
      this.xVelocity = newXVelocity;
      this.yVelocity = newYVelocity;
    }
  }

  draw(ctx, snakeColor, snakeBorder) {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    this.segments.forEach((sPart) => {
      ctx.fillRect(sPart.x, sPart.y, UNIT_SIZE, UNIT_SIZE);
      ctx.strokeRect(sPart.x, sPart.y, UNIT_SIZE, UNIT_SIZE);
    });
  }
}


class Food {

  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.x = 0;
    this.y = 0;
    this.generatePosition();
  }

  generatePosition() {
    this.x = Math.floor(Math.random() * (this.gameWidth / UNIT_SIZE)) * UNIT_SIZE;
    this.y = Math.floor(Math.random() * (this.gameHeight / UNIT_SIZE)) * UNIT_SIZE;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, UNIT_SIZE, UNIT_SIZE );
  }
}


const Home = () => {
  const gameboardRef = useRef(null);
  const frameDelay = 200; // Delay in milliseconds

  const [ctx, setCtx] = useState(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameWidth, setGameWidth] = useState(0);
  const [gameHeight, setGameHeight] = useState(0);

  const [snake, setSnake] = useState(
    new Snake([
      { x: UNIT_SIZE * 3, y: 0 },
      { x: UNIT_SIZE * 4, y: 0 },
      { x: UNIT_SIZE * 2, y: 0 },
      { x: UNIT_SIZE, y: 0 },
      { x: 0, y: 0 },
    ])
  );

  const [food, setFood] = useState(new Food(gameWidth, gameHeight));


  const boardBackground = "white";
  const snakeColor = "lightgreen";
  const snakeBorder = "black";

  const clearBoard = () => {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  };

  const moveSnake = () => {
    const head = snake.move();

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      food.generatePosition();
      setFood({ ...food });
    } else {
      snake.shrink();
    }

    setSnake({ ...snake });
  };

  const gameLoop = () => {
    if (!running) return;

    clearBoard();
    food.draw(ctx);
    moveSnake();
    snake.draw(ctx, snakeColor, snakeBorder);
    checkGameOver();
    setTimeout(() => {
      requestAnimationFrame(gameLoop);
    }, frameDelay);
  };

  const resetGame = () => {
    setRunning(false);
    setSnake(
      new Snake(UNIT_SIZE, [
        { x: UNIT_SIZE * 3, y: 0 },
        { x: UNIT_SIZE * 4, y: 0 },
        { x: UNIT_SIZE * 2, y: 0 },
        { x: UNIT_SIZE, y: 0 },
        { x: 0, y: 0 },
      ])
    );
    setScore(0);
    food.generatePosition();
    setFood({ ...food });
    setRunning(true);
    requestAnimationFrame(gameLoop);
  };

  const changeSnakeDirection = (event) => {
    const key = event.key;

    switch (key) {
      case "ArrowLeft":
        snake.changeDirection(-UNIT_SIZE, 0);
        break;
      case "ArrowRight":
        snake.changeDirection(UNIT_SIZE, 0);
        break;
      case "ArrowUp":
        snake.changeDirection(0, -UNIT_SIZE);
        break;
      case "ArrowDown":
        snake.changeDirection(0, UNIT_SIZE);
        break;
      default:
        break;
    }
  };

  const checkGameOver = () => {
    // Implement game over logic
  };

  useEffect(() => {
    const canvas = gameboardRef.current;
    const context = canvas.getContext("2d");

    setCtx(context);
    setGameWidth(canvas.width);
    setGameHeight(canvas.height);

    const initialFood = new Food(canvas.width, canvas.height);
    initialFood.generatePosition();
    setFood(initialFood);
    setRunning(true);
    window.addEventListener("keydown", changeSnakeDirection);

    return () => {
      window.removeEventListener("keydown", changeSnakeDirection);
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (running) {
      gameLoop();
    }
  }, [running]); // Run gameLoop whenever running state changes

  return (
    <div className="game-container">
      <canvas
        ref={gameboardRef}
        className="game-board w-96 h-96 border-4"
        width="480"
        height="480"
      ></canvas>
      <div className="score text-8xl">{score}</div>
      <button className="resetBtn w-28 h-14 border-4 border-solid" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
};

export default Home;
