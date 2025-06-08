import { Fragment, useContext } from "react";
import { TaskManagerContext } from "../context";
import GameCheck from "../game";

function Board() {
  const { board, setBoard, player, setPlayer } = useContext(TaskManagerContext);

  function handleOnCLick(event) {
    if (player) {
      setBoard({ ...board, [event.target.classList[4]]: "O" });
      if (!GameCheck(board)) setPlayer(!player);
    } else {
      setBoard({ ...board, [event.target.classList[4]]: "X" });
      if (!GameCheck(board)) setPlayer(!player);
    }
  }

  return (
    <Fragment>
      <div
        onClick={(event) => handleOnCLick(event)}
        className="text-9xl text-center grid grid-cols-3 grid-rows-3 gap-3 w-[calc(100dvw/2)] h-[calc(100dvh/2)]"
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
      </div>
      {GameCheck(board) ? (
        <p className="text-4xl mt-10">Player {player ? "X" : "O"} won!</p>
      ) : null}
    </Fragment>
  );
}

export default Board;
