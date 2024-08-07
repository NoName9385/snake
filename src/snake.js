// This would be stored in the 'src' folder of the GitHub repository
// snake.js

window.initGame = (React, assetsUrl) => {
  const { useState, useEffect } = React;

  const SnakeGame = () => {
    const [snake, setSnake] = useState([[0, 0]]);
    const [direction, setDirection] = useState('RIGHT');
    const [food, setFood] = useState(generateRandomFood());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const boardSize = 20; // Define the board size (20x20 grid)

    function generateRandomFood() {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      return [x, y];
    }

    useEffect(() => {
      const handleKeyPress = (e) => {
        switch (e.key) {
          case 'w':
            if (direction !== 'DOWN') setDirection('UP');
            break;
          case 's':
            if (direction !== 'UP') setDirection('DOWN');
            break;
          case 'a':
            if (direction !== 'RIGHT') setDirection('LEFT');
            break;
          case 'd':
            if (direction !== 'LEFT') setDirection('RIGHT');
            break;
          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [direction]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (!gameOver) {
          moveSnake();
        }
      }, 200);
      return () => clearInterval(interval);
    }, [snake, direction, gameOver]);

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
    };

    const resetGame = () => {
      setSnake([[0, 0]]);
      setDirection('RIGHT');
      setFood(generateRandomFood());
      setGameOver(false);
      setScore(0);
    };

    return React.createElement(
      'div',
      { className: "snake-game" },
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
      gameOver && React.createElement('p', null, "Game Over! Your score: " + score),
      React.createElement('button', { onClick: resetGame }, "Reset")
    );
  };

  return () => React.createElement(SnakeGame, { assetsUrl: assetsUrl });
};
