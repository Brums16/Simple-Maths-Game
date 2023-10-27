import "./Style.css";
import React, { useState, useRef, useEffect } from "react";
import heart from "./gameheart.png";

const Main = () => {
  const [operation, setOperation] = useState("");
  const [integer1, setInteger1] = useState("");
  const [integer2, setInteger2] = useState("");
  const [answer, setAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [time, setTime] = useState(60);
  const intervalRef = useRef(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [correctInput, setCorrectInput] = useState(false);
  const [incorrectInput, setIncorrectInput] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [equals, setEquals] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  function randint() {
    return Math.floor(Math.random() * 10);
  }

  function randinteger1() {
    let randinteger1 = randint();
    setInteger1(randinteger1);
    return randinteger1;
  }

  function randinteger2() {
    let randinteger2 = randint();
    setInteger2(randinteger2);
    return randinteger2;
  }

  const handleChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const newGame = () => {
    setGameStarted(true);
    setTime(60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setLives(3);
    setAnswer(null);
    setUserAnswer("");
    setCorrectInput(false);
    setIncorrectInput(false);
    setScore(0);
    setIsGameOver(false);
    randomQuestion();
    const userInputElement = document.getElementById("userAnswer");
    userInputElement.focus();
    intervalRef.current = setInterval(reduceTime, 1000);
  };

  function randomQuestion() {
    let operationChance = Math.floor(Math.random() * 4);

    if (operationChance === 0) {
      setOperation(" + ");
      setAnswer(randinteger1() + randinteger2());
      setEquals(" = ");
    }
    if (operationChance === 1) {
      setOperation(" - ");
      setAnswer(randinteger1() - randinteger2());
      setEquals(" = ");
    }
    if (operationChance === 2) {
      setOperation(" x ");
      setAnswer(randinteger1() * randinteger2());
      setEquals(" = ");
    }
    if (operationChance === 3) {
      let dividend, divisor;
      do {
        dividend = randinteger1();
        divisor = randinteger2();
      } while (dividend % divisor !== 0);
      setOperation(" ÷ ");
      setAnswer(dividend / divisor);
      setEquals(" = ");
    }
    console.log(answer);
    return;
  }

  function checkAnswer(userAnswer, answer) {
    if (userAnswer == "") {
      return;
    }
    if (userAnswer == answer) {
      setScore(score + 1);
      setUserAnswer("");
      randomQuestion();
      setCorrectInput(true);
      setTimeout(() => {
        setCorrectInput(false);
      }, 500);
    } else {
      setLives(lives - 1);
      setUserAnswer("");
      randomQuestion();
      setIncorrectInput(true);
      setTimeout(() => {
        setIncorrectInput(false);
      }, 500);
    }
  }

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score]);
  /*this next part is listening to see if lives or time falls to 0 */

  useEffect(() => {
    if (lives === 0 || time === 0) {
      setIsGameOver(true);
      clearInterval(intervalRef.current);
    }
  }, [lives, time]);

  const gameOver = () => {
    return (
      <div className="gameOver">
        <h2
          style={{
            color: "red",
          }}
        >
          GAME OVER
        </h2>
        <h2 className="scoreMessage">Score: {score}</h2>

        <h2>High Score: {highScore}</h2>

        <button onClick={newGame} id="playAgain">
          Play again
        </button>
      </div>
    );
  };

  const newGameButton = () => {
    return (
      <div>
        <button onClick={newGame} id="newgame">
          New Game
        </button>
      </div>
    );
  };

  const livesDisplay = () => {
    const heartIcons = Array.from({ length: lives }, (_, index) => (
      <img src={heart} key={index} alt="heart icon" className="heartIcon" />
    ));
    return heartIcons;
  };

  const timerBar = () => {
    const timerBarWidth = (time / 60) * 100 + "%";
    return (
      <div className="outerbox">
        <div
          className="innerbox"
          style={{
            width: timerBarWidth,
            backgroundColor:
              time > 30 ? "green" : time > 10 ? "#DAA520" : "red",
          }}
        ></div>
      </div>
    );
  };

  const reduceTime = () => {
    setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
  };

  document.onkeydown = (event) => {
    if (gameStarted) {
      if (event.key === "Enter") {
        checkAnswer(userAnswer, answer);
        if (isGameOver) {
          newGame();
        }
      }
    }
  };

  return (
    <div className="main">
      {isGameOver && gameOver()}
      {gameStarted === false && newGameButton()}
      <div class="answer-div">
        <h2 className="question">
          {integer1}
          {operation}
          {integer2}
          {equals}
        </h2>
        <input
          type="text"
          id="userAnswer"
          name="userAnswer"
          onChange={handleChange}
          value={userAnswer}
          style={{
            border: gameStarted ? "2px solid black" : "none",
            borderRadius: "2px",
          }}
          className={
            correctInput
              ? "correct-input"
              : incorrectInput
              ? "incorrect-input"
              : ""
          }
        />
      </div>
      <h3 className="score">Score: {score}</h3>
      <h3
        style={{
          color: time <= 5 ? "red" : "",
        }}
      >
        Time remaining: {time}
      </h3>
      <div className="timerContainer">{timerBar()}</div>
      <div className="livesContainer">{livesDisplay()}</div>
    </div>
  );
};

export default Main;
