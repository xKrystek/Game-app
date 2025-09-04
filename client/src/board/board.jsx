import { useContext, useEffect, useState } from "react";
import { TaskManagerContext } from "../context/taskManager";
import { callLogoutUser } from "../services";
import Chat from "../socket/chat";

function Board() {

  const [gameOver, setGameOver] = useState(false);

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
  } = useContext(TaskManagerContext);

  console.log(player, "player");
  console.log(yourTurn, "yourturn");

  useEffect(() => {

    if (GameCheck(board) === "O" || GameCheck(board) === "X") {
      setGameOver(true);
      setWin(!win);
      setDisplayBtn(true);
    } else if (GameCheck(board) === "tie") {
      setTie(!tie);
      setDisplayBtn(true);
    }
  }, [board]);

  function displayYourTurn(){
    if (yourTurn === undefined) return ""
    else if (yourTurn === false) return "Opponent's Turn"
    else return `Your turn: ${player}`;
  }

  return (
    <>
      <button onClick={callLogoutUser} className="absolute top-5">
        LogOut
      </button>
      <p className="absolute top-19 left-[46%]">{gameOver ? "Game Over" : displayYourTurn()}</p>
      <div
        onClick={
          !GameCheck(board) ? (event) => handleBoardOnClick(event) : null
        }
        className="text-8xl text-center grid grid-cols-3 grid-rows-3 gap-3 w-[611px] h-[611px] relative bottom-12"
      >
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
          <p className="animation1 text-4xl mt-10 absolute translate-x-1/2 translate-y-1/2 top-[100%] right-1/2">
            Player {GameCheck(board) === "O" ? "O" : GameCheck(board) === "X" ? "X" : null} won!
          </p>
        ) : null}
        {tie ? (
          <p className="animation1 text-4xl mt-10 absolute translate-x-1/2 translate-y-1/2 top-[100%] right-1/2">
            TIE !!
          </p>
        ) : null}
      </div>
      {displayBtn ? (
        <button
          onClick={playAgainButton}
          className="animation2 text-4xl mt-25 cursor-pointer text-nowrap absolute left-1/2 translate-x-[-50%] "
        >
          Play Again
        </button>
      ) : null}
      <Chat />
    </>
  );
}

export default Board;
