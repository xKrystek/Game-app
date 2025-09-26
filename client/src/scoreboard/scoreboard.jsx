import { useContext, useEffect} from "react";
import { TaskManagerContext } from "../context/taskManager";

function Scoreboard() {
  const {
    playersUsernamesList,
    socketRef,
    rematch,
    setRematch,
    rematchYou,
    rematchOponent,
    setRematchYou,
    setRematchOponent,
    yourScore,
    setYourScore,
    oponentScore,
    setOponentScore,
  } = useContext(TaskManagerContext);

  useEffect(() => {
    if (rematchYou && rematchOponent) {
        console.log("triggered");
        setRematch(false);
        setRematchOponent(false);
        setRematchYou(false);
    }
  }, [rematchYou, rematchOponent]);

  return (
    <div
      id="scoreboard"
      className="fixed left-5 top-1/2 -translate-y-1/2 w-[20%] h-1/2 flex flex-col text-5xl items-center"
    >
      <div
        id="usernames-wrapper"
        className="grow flex items-center justify-center text-3xl"
      >
        <div id="user1">
          {playersUsernamesList?.map((x) =>
            x[1] === socketRef.current.id ? x[0] : null
          )}
        </div>
        <p className="mx-3">vs</p>
        <div id="user2">
          {playersUsernamesList?.map((x) =>
            x[1] !== socketRef.current.id ? x[0] : null
          )}
        </div>
      </div>
      <div
        id="score"
        className="grow place-content-center tracking-[1rem] text-8xl"
      >
        {yourScore}:{oponentScore}
      </div>
      <div
        id="rematch-wrapper"
        className={`grow place-content-center relative ${
          rematch ? "block" : "invisible"
        }`}
      >
        <div
          className={`${
            rematchYou ? "rematch-player1" : "rematch-player2"
          } absolute rounded-full w-12 h-12 bottom-[-50%]`}
        ></div>
        <p>rematch</p>
        <div
          className={`${
            rematchOponent ? `rematch-player1` : `rematch-player2`
          } absolute rounded-full w-12 h-12 bottom-[-50%] right-0`}
        ></div>
      </div>
    </div>
  );
}

export default Scoreboard;
