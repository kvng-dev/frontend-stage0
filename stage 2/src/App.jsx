import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#F0FF33",
  "#FF8333",
];

function App() {
  const [targetColor, setTargetColor] = useState("");
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [hearts, setHearts] = useState(3);

  const [gameStarted, setGameStarted] = useState(false);

  const [width, setWidth] = useState(window.innerWidth); // Get window width
  const [height, setHeight] = useState(window.innerHeight);

  const resetGame = () => {
    setScore(0);
    setHearts(3);
    setGameStatus("");
    setGameStarted(true);
    generateNewGame();
  };

  // Function to generate a new random game
  const generateNewGame = () => {
    const randomTargetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(randomTargetColor);

    let shuffledOptions = [...colors];
    shuffledOptions = shuffledOptions.sort(() => Math.random() - 0.5);
    shuffledOptions = shuffledOptions.slice(0, 6);

    if (!shuffledOptions.includes(randomTargetColor)) {
      shuffledOptions[Math.floor(Math.random() * 6)] = randomTargetColor;
    }

    setColorOptions(shuffledOptions);
  };

  const handleGuess = (color) => {
    if (hearts <= 0) return;

    if (color === targetColor) {
      setScore(score + 1);
      setGameStatus("Correct! 🎉");
    } else {
      setHearts(hearts - 1);
      setGameStatus("Wrong color! ❌");
    }

    if (hearts <= 0) {
      setGameStatus("Game Over! You lost all your hearts.");
    } else {
      setTimeout(() => {
        generateNewGame();
        setGameStatus("");
      }, 1000);
    }
  };

  const showHearts = () => {
    return Array.from({ length: hearts }, (_, index) => (
      <span className="heart" key={index} role="img" aria-label="heart">
        ❤️
      </span>
    ));
  };

  const handleGameEnd = () => {
    if (hearts <= 0) {
      // Trigger confetti when game ends
      return <Confetti width={width} height={height} />;
    }
  };

  // Initialize the game when the component mounts
  useEffect(() => {}, [gameStarted]);

  useEffect(() => {
    // Update width and height when window is resized
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <nav>
        <h1>Color Heroes 💥</h1>

        {/* Display hearts */}
        <div>{hearts > 0 ? showHearts() : handleGameEnd()}</div>
      </nav>

      {/* Only show Start New Game button if the game hasn't started */}
      {!gameStarted ? (
        <div className="intro">
          <button
            className="new-game-button"
            onClick={() => {
              setGameStarted(true);
              generateNewGame();
            }}
            data-testid="newGameButton"
          >
            ⚡Start New Game⚡
          </button>
          <div className="game-instructions" data-testid="gameInstructions">
            😍 Click on the color box to earn points.
            <br />
            Keep trying until you lose all your hearts!🎮
          </div>
        </div>
      ) : (
        <div className="game-container">
          <div
            className={`game-status ${
              gameStatus === "Correct! 🎉"
                ? "celebrate"
                : gameStatus === "Wrong color! ❌"
                ? "fade-out"
                : ""
            }`}
            data-testid="gameStatus"
          >
            {gameStatus}
          </div>
          {/* Display target color box */}
          <div
            className="color-box"
            style={{ backgroundColor: targetColor }}
            data-testid="colorBox"
          ></div>
          <div className="color-options">
            {/* Display 6 color option buttons */}
            {colorOptions.map((color, index) => (
              <button
                key={index}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleGuess(color)}
                data-testid="colorOption"
                disabled={hearts <= 0} // Disable buttons after losing all hearts
              ></button>
            ))}
          </div>
          {/* Game Status */}

          {/* Score Counter */}
          <div className="score" data-testid="score">
            Score: {score}pts
          </div>

          {/* Reset Game Button */}
          {!hearts && (
            <button
              className="reset-game-button"
              onClick={resetGame}
              data-testid="newGameButton"
            >
              Play again? 💫
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
