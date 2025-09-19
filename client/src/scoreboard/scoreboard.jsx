import { useContext } from "react";
import { TaskManagerContext } from "../context/taskManager";

function Scoreboard() {

    const {usersList, socketRef} = useContext(TaskManagerContext);

  return (
    <div id="scoreboard" className="fixed left-0 top-1/2 -translate-y-1/2 w-[10%] h-1/2">
      <div id="usernames-wrapper">
        <div id="user1">{usersList?.map(x => x[1] === socketRef.current.id ? x[0] : null)}</div>
        <p>vs</p>
        <div id="user2">{usersList?.map(x => x[1] !== socketRef.current.id ? x[0] : null)}</div>
      </div>
      <div id="score">0:0</div>
      <div id="rematch-wrapper">
        <div id="rematch-player1"></div>
        <p>rematch</p>
        <div id="rematch-player2"></div>
      </div>
    </div>
  );
}

export default Scoreboard;
