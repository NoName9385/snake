// This would be stored in the 'src' folder of the GitHub repository
// snake.js

window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const SnakeGame = () => {
    const boardSize = 20; // Define the board size (20x20 grid)
    const [snake, setSnake] = useState([[0, 0]]);
    const [direction, setDirection] = useState('RIGHT');
    const [food, setFood] = useState(generateRandomFood());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [canTurn, setCanTurn] = useState(true); // Control turning
    const [speed, setSpeed] = useState(500); // Start speed (milliseconds)
    const [startTime, setStartTime] = useState(null); // Track game start time

    function generateRandomFood() {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      return [x, y];
    }

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (!canTurn) return; // Prevent turning if the snake has just moved

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
      if (gameOver) return; // Don't run if game is over

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
          const newSpeed = Math.max(100, 500 - Math.floor(elapsedTime / 10000) * 50); // Speed increases every 10 seconds, min speed 100ms
          setSpeed(newSpeed);
        }
      };

      const speedInterval = setInterval(increaseSpeed, 1000); // Check every second

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
      } else {
        newSnake.pop(); // Remove the tail segment if no food eaten
      }

      setSnake(newSnake);
      setCanTurn(true); // Allow turning again after the snake has moved
    };

    const resetGame = () => {
      setSnake([[0, 0]]);
      setDirection('RIGHT');
      setFood(generateRandomFood());
      setGameOver(false);
      setScore(0);
      setCanTurn(true);
      setSpeed(500); // Reset speed
      setStartTime(null); // Reset start time
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
              });
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

