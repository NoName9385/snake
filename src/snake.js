// This would be stored in the 'src' folder of the GitHub repository
// snake.js

window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const SnakeGame = () => {
    const boardSize = 20; // Define the board size (20x20 grid)
    const [snake, setSnake] = useState([[0, 0]]);
    const [direction, setDirection] = useState('RIGHT');
    const [food, setFood] = useState(generateRandomFood());
    const [foodImage, setFoodImage] = useState(selectRandomFoodImage()); // New state for food image
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [canTurn, setCanTurn] = useState(true);
    const [speed, setSpeed] = useState(500);
    const [startTime, setStartTime] = useState(null);

    // Array of food images
    const foodImages = [
      `apple.png`, // Replace with actual image paths
      `banana.png`,
      `strawberry.png`
    ];

    function generateRandomFood() {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      return [x, y];
    }

    // Move this function below the foodImages declaration
    function selectRandomFoodImage() {
      const randomIndex = Math.floor(Math.random() * foodImages.length);
      return foodImages[randomIndex];
    }

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (!canTurn) return;

        switch (e.key) {
          case 'w':
            if (direction !== 'DOWN') {
              setDirection('UP');
              setCanTurn(false);
            }
            break;
          case 's':
            if (direction !== 'UP') {
              setDirection('DOWN');
              setCanTurn(false);
            }
            break;
          case 'a':
            if (direction !== 'RIGHT') {
              setDirection('LEFT');
              setCanTurn(false);
            }
            break;
          case 'd':
            if (direction !== 'LEFT') {
              setDirection('RIGHT');
              setCanTurn(false);
            }
            break;
          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [direction, canTurn]);

    useEffect(() => {
      if (gameOver) return;

      const interval = setInterval(() => {
        moveSnake();
      }, speed);

      return () => clearInterval(interval);
    }, [snake, direction, gameOver, speed]);

    useEffect(() => {
      if (!startTime) setStartTime(Date.now());

      const increaseSpeed = () => {
        if (!gameOver) {
          const elapsedTime = Date.now() - startTime;
          const newSpeed = Math.max(100, 500 - Math.floor(elapsedTime / 10000) * 50);
          setSpeed(newSpeed);
        }
      };

      const speedInterval = setInterval(increaseSpeed, 1000);

      return () => clearInterval(speedInterval);
    }, [startTime, gameOver]);

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = newSnake[0];
      let newHead;

      switch (direction) {
        case 'UP':
          newHead = [head[0] - 1, head[1]];
          break;
        case 'DOWN':
          newHead = [head[0] + 1, head[1]];
          break;
        case 'LEFT':
          newHead = [head[0], head[1] - 1];
          break;
        case 'RIGHT':
          newHead = [head[0], head[1] + 1];
          break;
        default:
          return;
      }

      // Check for collisions with the wall or itself
      if (
        newHead[0] < 0 ||
        newHead[0] >= boardSize ||
        newHead[1] < 0 ||
        newHead[1] >= boardSize ||
        newSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(newHead); // Add new head to the snake

      // Check if the snake has eaten the food
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore(score + 10);
        setFood(generateRandomFood());
        setFoodImage(selectRandomFoodImage()); // Select a new random food image
      } else {
        newSnake.pop(); // Remove the tail segment if no food eaten
      }

      setSnake(newSnake);
      setCanTurn(true);
    };

    const resetGame = () => {
      setSnake([[0, 0]]);
      setDirection('RIGHT');
      setFood(generateRandomFood());
      setFoodImage(selectRandomFoodImage()); // Reset food image
      setGameOver(false);
      setScore(0);
      setCanTurn(true);
      setSpeed(500);
      setStartTime(null);
    };

    return React.createElement(
      'div',
      { className: "game-container" },
      React.createElement('h2', null, "Snake Game"),
      React.createElement('div', { className: 'board' }, 
        Array.from({ length: boardSize }).map((_, row) =>
          React.createElement('div', { key: row, className: 'row' },
            Array.from({ length: boardSize }).map((_, col) => {
              const isSnake = snake.some(segment => segment[0] === row && segment[1] === col);
              const isFood = food[0] === row && food[1] === col;
              return React.createElement('div', {
                key: col,
                className: `cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`
              }, isFood && React.createElement('img', {
                src: foodImage,
                alt: 'Food',
                style: { width: '100%', height: '100%' }
              }));
            })
          )
        )
      ),
      React.createElement('div', { className: 'score', style: { marginTop: '10px', fontSize: '16px', color: 'black' } }, "Score: " + score),
      gameOver && React.createElement('p', null, "Game Over! Your score: " + score),
      React.createElement('button', { onClick: resetGame }, "Reset")
    );
  };

  return () => React.createElement(SnakeGame, { assetsUrl: assetsUrl });
};
