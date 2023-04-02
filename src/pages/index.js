import React, { useEffect, useState } from 'react';

// Square component with image
const Square = ({ onClick, value }) => {
  let src;
  switch (value) {
    case 'X':
      src = '/x.png';
      break;
    case 'O':
      src = '/o.png';
      break;
    default:
      break;
  }

  return (
    <button className="square" onClick={onClick}>
      {value !== null ? <img src={src} width="100%" height="100%" /> : value}
    </button>
  );
}

const Board = () => {
  const [squares, setSquares] = useState([
    null, null, null,
    null, null, null,
    null, null, null
  ]);
  const [isX, setIsX] = useState(true);
  const [status, setStatus] = useState('');
  const [score_X, setScore_X] = useState(0);
  const [score_O, setScore_O] = useState(0);
  const [scoreTie, setScoreTie] = useState(0);

  // Set values from localStorage (if any)
  useEffect(() => {
    const localScoreX = localStorage.getItem('score_X') || 0;
    const localScoreO = localStorage.getItem('score_O') || 0;
    const localScoreTie = localStorage.getItem('scoreTie') || 0;

    setScore_X(localScoreX);
    setScore_O(localScoreO);
    setScoreTie(localScoreTie);
  }, []);

  // Set winner (if any) on change of squares value
  useEffect(() => {
    const winner = findWinner(squares);

    if (winner) {
      setStatus(`Winner: ${winner}! Restarting game...`);

      switch (winner) {
        case 'X':
          setScore_X(Number(score_X) + 1);
          localStorage.setItem('score_X', Number(score_X) + 1)
          break;
        case 'O':
          setScore_O(score_O + 1);
          localStorage.setItem('score_O', Number(score_O) + 1)
          break;
        default:
          break;
      }

      // Restart game
      setTimeout(() => {
        handleRestart();
      }, 2000);
    } else {
      setStatus('Next player: ' + (isX ? 'X' : 'O'));

      // Logic if game is tied
      const allBoxesFilled = !squares.filter(item => item === null).length;
      if (allBoxesFilled) {
        setStatus('Tie! Restarting game...');
        setScoreTie(Number(scoreTie) + 1);
        localStorage.setItem('scoreTie', Number(scoreTie) + 1)

        // Restart game
        setTimeout(() => {
          handleRestart();
        }, 2000);
      }
    }
  }, [squares, isX]);


  // Logic when click square
  const handleClick = (i) => {
    if (findWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = isX ? 'X' : 'O';
    setSquares(squares);
    setIsX(!isX);
  }

  const findWinner = (squares) => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningPatterns.length; i++) {
      const [a, b, c] = winningPatterns[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const handleRestart = () => {
    setIsX(true);
    setSquares([
      null, null, null,
      null, null, null,
      null, null, null
    ]);
  }

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  }

  return (
    <>
      {/* Board */}
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
        <div className="status">{status}</div>
      </div>

      {/* Scores */}
      <div className="scores">
        <div className="playerScore">
          <div>Player 1 (X)</div>
          <div>{score_X}</div>
        </div>
        <div className="playerScore">
          <div>Tie</div>
          <div>{scoreTie}</div>
        </div>
        <div className="playerScore">
          <div>Player 2 (O)</div>
          <div>{score_O}</div>
        </div>
      </div>
    </>
  );
}

export default Board;
