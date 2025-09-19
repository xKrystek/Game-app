import { useContext, useEffect, useRef } from "react";
import { TaskManagerContext } from "../context/taskManager";
import { callLogoutUser } from "../services";
import Chat from "../chat/chat";
import Scoreboard from "../scoreboard/scoreboard";

function Board() {
  const {
    board,
    player,
    win,
    setTie,
    tie,
    displayBtn,
    setDisplayBtn,
    handleBoardOnClick,
    playAgainButton,
    GameCheck,
    setWin,
    yourTurn,
    setYourTurn,
    gameOver,
    setGameOver,
    setUser,
  } = useContext(TaskManagerContext);

  useEffect(() => {
    if (GameCheck(board) === "O" || GameCheck(board) === "X") {
      setGameOver(true);
      setWin(!win);
      setDisplayBtn(true);
    } else if (GameCheck(board) === "tie") {
      setYourTurn(undefined);
      setTie(!tie);
      setDisplayBtn(true);
    }
  }, [board]);

  function displayYourTurn() {
    if (yourTurn === undefined) return "";
    else if (yourTurn === false) return "Opponent's Turn";
    else return `Your turn: ${player}`;
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <Scoreboard />
      <p className="fixed top-[10%] left-[49%] translate-x-[-50%] translate-y-[-50%]">
        {gameOver ? "Game Over" : displayYourTurn()}
      </p>
      <div className="flex justify-center items-center h-1/2 w-1/2">
        <div
          onClick={
            !GameCheck(board) ? (event) => handleBoardOnClick(event) : null
          }
          className="text-8xl text-center grid grid-cols-3 grid-rows-3 2xl:gap-3 gap-1 sm:gap-2 w-4/5 lg:w-3/4 xl:w-3/5 aspect-square self-center relative"
        >
          <button
            onClick={callLogoutUser}
            className="fixed top-0 left-0 text-[2rem] 2xl:text-[1.5vw] xl:text-[2vw] m-2"
          >
            LogOut
          </button>
          <div className="border-solid border-3 border-white place-content-center one">
            {board.one}
          </div>
          <div className="border-solid border-3 border-white place-content-center two">
            {board.two}
          </div>
          <div className="border-solid border-3 border-white place-content-center three">
            {board.three}
          </div>
          <div className="border-solid border-3 border-white place-content-center four">
            {board.four}
          </div>
          <div className="border-solid border-3 border-white place-content-center five">
            {board.five}
          </div>
          <div className="border-solid border-3 border-white place-content-center six">
            {board.six}
          </div>
          <div className="border-solid border-3 border-white place-content-center seven">
            {board.seven}
          </div>
          <div className="border-solid border-3 border-white place-content-center eight">
            {board.eight}
          </div>
          <div className="border-solid border-3 border-white place-content-center nine">
            {board.nine}
          </div>
          {win ? (
            <p className="animation1 text-[2rem] 2xl:text-[1.5vw] xl:text-[2vw] translate-x-1/2 translate-y-1/2 top-[15%] right-[51%] fixed">
              {GameCheck(board) === player ? "You won" : "You lost"}
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
      <Chat />
    </div>
  );
}

export default Board;
