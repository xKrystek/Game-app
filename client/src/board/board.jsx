import { useContext, useState } from "react";
import { TaskManagerContext } from "../context";
import GameCheck from "./game-check";

function Board() {
  const { board, setBoard, player, setPlayer } = useContext(TaskManagerContext);

  const [win, setWin] = useState(false);
  const [tie, setTie] = useState(false);
  const [displayBtn, setDisplayBtn] = useState(false);

  function handleBoardOnClick(event) {
    const cell = event.target.classList[4];
    if (board[cell]) return; // prevent overriding a filled cell

    const mark = player ? "O" : "X";
    const updatedBoard = { ...board, [cell]: mark };

    setBoard(updatedBoard); // triggers re-render with new state

    if (!GameCheck(updatedBoard)) {
      setPlayer(!player);
    } else if (GameCheck(updatedBoard) === "win") {
      setWin(!win);
      setDisplayBtn(true);
    } else {
      setTie(!tie);
      setDisplayBtn(true);
    }
  }

  function handleButtonClick() {
    setBoard({
      one: "",
      two: "",
      three: "",
      four: "",
      five: "",
      six: "",
      seven: "",
      eight: "",
      nine: "",
    });

    setDisplayBtn(false);
    setWin(false);
    setTie(false);
  }

  return (
    <>
      <div
        onClick={
          !GameCheck(board) ? (event) => handleBoardOnClick(event) : null
        }
        className="text-9xl text-center grid grid-cols-3 grid-rows-3 gap-3 w-[811px] h-[811px] relative bottom-12"
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
        {/* {
        [one,two,three,four,five,six,seven,eight,nine].map((element, index) => (
          <div
            className={`border-solid border-3 border-white place-content-center ${element}`}
            key={index}
          >
          </div>
        ))
      } */}
        {win ? (
          <p className="animation1 text-4xl mt-10 absolute translate-x-1/2 translate-y-1/2 top-[100%] right-1/2">
            Player {player ? "O" : "X"} won!
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
          onClick={handleButtonClick}
          className="animation2 text-4xl mt-25 cursor-pointer text-nowrap absolute left-1/2 translate-x-[-50%] "
        >
          Play Again
        </button>
      ) : (
        <button
          onClick={handleButtonClick}
          className="hidden text-4xl mt-30 cursor-pointer text-nowrap absolute left-1/2 translate-x-[-50%] "
        >
          Play Again
        </button>
      )}
    </>
  );
}

export default Board;
