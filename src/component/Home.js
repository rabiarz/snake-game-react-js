import React, { useRef, useEffect, useState } from "react";

const Home = () => {
  const gameboardRef = useRef(null);
  const unitSize = 20;

  const [ctx, setCtx] = useState(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [xVelocity, setXVelocity] = useState(unitSize);
  const [yVelocity, setYVelocity] = useState(0);
  const [gameWidth, setGameWidth] = useState(0)
  const [gameHeight, setGameHeight] = useState(0)
  const [foodX, setFoodX] = useState(0)
  const [foodY, setFoodY] = useState(0)
  const boardBackground = "white";
  const snakeColor = "lightgreen";
  const snakeBorder = "black";
  // const foodColor = "red";
  const [snake, setSnake] = useState([
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ]);

  const clearBoard = () => {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight)
  }

  const getRandomNum = (min, max) => {
    const randomNum = Math.random()
    const roundNum = Math.round((randomNum * (max - min) + min) / unitSize)
    return roundNum * unitSize
  }

  const drawFood = (context) => {
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, unitSize, unitSize / 2);
  }

  const createFood = () => {
    const fX = getRandomNum(0, gameboardRef.current.width - unitSize)
    const fY = getRandomNum(0, gameboardRef.current.height - unitSize)
    setFoodX(fX);
    setFoodY(fY);
  }

  const drawSnake = () => {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    // ctx.fillRect(10, 15, 30, 50);
    snake.forEach(sPart => {
      ctx.fillRect(sPart.x, sPart.y, unitSize, unitSize / 2)
      ctx.strokeRect(sPart.x, sPart.y, unitSize, unitSize / 2)
    })

  }

  const moveSnake = () => {
    const head = {
      x: snake[0].x + xVelocity,
      y: snake[0].y + yVelocity
    }
    

    const snk = snake
    console.log("move ", xVelocity, yVelocity)
    snk.unshift(head)
    setSnake(snk)
    // console.log("move ", snk)

    if (snake[0].x == foodX && snake[0].y == foodY) {
      score++
      createFood()
    } else {
      snk.pop();
      setSnake(snk)
    }

    // console.log("move ", snake)
  }

  

  const nextTick = () => {
    if (running) {
      setTimeout(() => {
        clearBoard()
        drawFood(ctx)
        moveSnake()
        drawSnake()
        checkGameOver()
        nextTick()
      }, 1000)
    }
  }

  useEffect(() => {
    if (!gameboardRef.current) return
    const width = gameboardRef.current.width
    const height = gameboardRef.current.height
    const context = gameboardRef.current.getContext("2d");
    
    setCtx(context);
    // setRunning(true)
    context.beginPath()
    context.clearRect(0, 0, width, height);

    setGameHeight(height)
    setGameWidth(width)

    startGame(context)


    window.addEventListener('keydown', changeSnakeDirection)

    return () => {
      window.removeEventListener("keydown", changeSnakeDirection);
    }

    // nextTick();
  }, [running])


  const resetGame = () => {
    // setRunning(false);
    setXVelocity(unitSize)
    setYVelocity(0)
  };

  const changeSnakeDirection = (event) => {
    // console.log(event)
    const keydown = event.key;

    const goingUp = (yVelocity === -unitSize)
    const goingDown = (yVelocity === unitSize)
    const goingRight = (xVelocity === unitSize)
    const goingLeft = (xVelocity === -unitSize)

    switch (true) {
      case (keydown == "a" && !goingRight):
        console.log(keydown === "a" && !goingRight)
        setXVelocity(-unitSize)
        setYVelocity(0)
        break;
      case (keydown === "w" && !goingDown):
        setXVelocity(0)
        setYVelocity(-unitSize)
        break
      case (keydown === "d" && !goingLeft):
        setXVelocity(unitSize)
        setYVelocity(0)
        break;
      
      case (keydown === "s" && !goingUp):
        console.log("Is a pressed", snake)
        setXVelocity(0)
        setYVelocity(unitSize)
        break;

    }
  }

  const startGame = (context) => { 
    setRunning(true)
    createFood()
    drawFood(context)
    nextTick()
  }

  const checkGameOver = () => {

  }

  return (
    <div className="game-container" >
      <canvas ref={gameboardRef} className="game-board w-96 h-96 border-4 "></canvas>
      <div className="score text-8xl">0</div>
      <button
        className="resetBtn w-28 h-14 border-4 border-solid"
        onClick={resetGame}
      >Reset</button>
    </div>
  )
}

export default Home;  