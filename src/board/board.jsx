import { useContext, useState } from "react";
import { TaskManagerContext } from "../context";
import GameCheck from "../game";

function Board() {
  const { board, setBoard, player, setPlayer } = useContext(TaskManagerContext);

  const [win, setWin] = useState(false);
  const [tie, setTie] = useState(false);

  function handleOnClick(event) {
    const cell = event.target.classList[4];
    if (board[cell]) return; // prevent overriding a filled cell

    const mark = player ? "O" : "X";
    const updatedBoard = { ...board, [cell]: mark };

    setBoard(updatedBoard); // triggers re-render with new state

    if (!GameCheck(updatedBoard)) {
      setPlayer(!player);
    } else if (GameCheck(updatedBoard) === "win") {
      setWin(!win);
    } else {
      setTie(!tie);
    }
  }

  return (
    <div
      onClick={!GameCheck(board) ? (event) => handleOnClick(event) : null}
      className="text-9xl text-center grid grid-cols-3 grid-rows-3 gap-3 w-[calc(100dvw/2)] h-[calc(100dvh/2)] relative"
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
        <p className="text-4xl mt-10 absolute translate-x-1/2 translate-y-1/2 top-[100%] right-1/2">
          Player {player ? "O" : "X"} won!
        </p>
      ) : null}
      {tie ? (
        <p className="text-4xl mt-10 absolute translate-x-1/2 translate-y-1/2 top-[100%] right-1/2">
          TIE !!
        </p>
      ) : null}
    </div>
  );
}

export default Board;
