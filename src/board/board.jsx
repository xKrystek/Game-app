import { useContext } from "react";
import { TaskManagerContext } from "../context";

function Board() {
  const { board, setBoard, player, setPlayer } = useContext(TaskManagerContext);

  function handleOnCLick(event) {
    console.log(event);
    console.log(event.target);
    console.log(event.target.classList[4]);

    if(player){
      setBoard({ ...board, [event.target.classList[4]]: "X" });
      setPlayer(!player);
    } else {
      setBoard({ ...board, [event.target.classList[4]]: "O" });
      setPlayer(!player);
    }
  }

  return (
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
  );
}

export default Board;
