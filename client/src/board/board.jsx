/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { TaskManagerContext } from '../context/taskManagerContext';
import { callLogoutUser } from '../services/apiCalls';
import { useNavigate } from 'react-router-dom';
import numberWords from '../scripts/wordListGenerator';

function Board() {
  const {
    board,
    player,
    setTie,
    tie,
    displayBtn,
    setDisplayBtn,
    handleBoardOnClick,
    playAgainButton,
    GameCheck,
    yourTurn,
    setYourTurn,
    gameOver,
    setGameOver,
    setRematch
  } = useContext(TaskManagerContext);

  const navigate = useNavigate();

  const handleLogoutUser = () => {
    callLogoutUser().then(() => navigate('/auth'));
  };

  useEffect(() => {
    if (GameCheck(board) === 'O' || GameCheck(board) === 'X') {
      setGameOver(true);
      setDisplayBtn(true);
      setRematch(true);
    } else if (GameCheck(board) === 'tie') {
      setYourTurn(undefined);
      setTie(!tie);
      setDisplayBtn(true);
      setRematch(true);
    }
  }, [board]);

  function displayYourTurn() {
    if (yourTurn === undefined) return '';
    else if (yourTurn === false) return "Opponent's Turn";
    else return `Your turn: ${player}`;
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <p className="fixed lg:top-[10%] top-[10%] left-[49%] translate-x-[-50%] translate-y-[-50%]">
        {gameOver ? 'Game Over' : displayYourTurn()}
      </p>
      <div className="flex justify-center items-center h-1/2 w-1/2">
        <div
          onClick={
            !GameCheck(board) ? (event) => handleBoardOnClick(event) : null
          }
          className="lg:text-8xl md:text-6xl sm:text-4xl text-2xl text-center grid grid-cols-3 grid-rows-3 2xl:gap-3 gap-1 sm:gap-2 w-4/5 lg:w-3/4 xl:w-3/5 aspect-square self-center relative"
        >
          <button
            onClick={handleLogoutUser}
            className="fixed top-0 left-0 2xl:text-5xl xl:text-3xl sm:text-sm text-lg m-2"
          >
            LogOut
          </button>
          {numberWords(9).map((value, index) => {
            return <div className='border border-white place-content-center' key={index} data-cell={`${value}`}>{board[value]}</div>
          })}
          {gameOver ? (
            <p className="animation1 text-[2rem] 2xl:text-[1.5vw] xl:text-[2vw] translate-x-1/2 translate-y-1/2 top-[15%] right-[51%] fixed">
              {GameCheck(board) === player ? 'You won' : 'You lost'}
            </p>
          ) : null}
          {tie ? (
            <p className="animation1 text-[2rem] 2xl:text-[1.5vw] xl:text-[2vw] translate-x-1/2 translate-y-1/2 top-[15%] right-[51%] fixed">
              TIE !!
            </p>
          ) : null}
        </div>
      </div>
      {displayBtn ? (
        <>
          <button
            onClick={playAgainButton}
            className="animation2 text-[2rem] 2xl:text-[1.5vw] xl:text-[2vw] cursor-pointer text-nowrap left-[49%] translate-x-[-50%] fixed bottom-1/12"
          >
            Play Again
          </button>
        </>
      ) : null}
    </div>
  );
}

export default Board;
