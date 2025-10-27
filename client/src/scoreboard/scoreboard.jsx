/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { TaskManagerContext } from '../context/taskManagerContext';

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
    oponentScore
  } = useContext(TaskManagerContext);

  useEffect(() => {
    if (rematchYou && rematchOponent) {
      console.log('triggered');
      setRematch(false);
      setRematchOponent(false);
      setRematchYou(false);
    }
  }, [rematchYou, rematchOponent]);

  return (
    <div
      id="scoreboard"
      className="fixed left-[5%] top-1/2 -translate-y-1/2 flex flex-col items-center
               h-1/3 sm:h-2/5 md:h-1/2
               text-[10px] sm:text-xs md:text-base lg:text-3xl xl:text-4xl"
    >
      <div
        id="usernames-wrapper"
        className="grow flex items-center justify-center
                 text-sm sm:text-base md:text-lg lg:text-2xl"
      >
        <div id="user1">
          {playersUsernamesList?.map((x) =>
            x[1] === socketRef.current?.id ? x[0] : null
          )}
        </div>
        <p className="mx-2 sm:mx-3">vs</p>
        <div id="user2">
          {playersUsernamesList?.map((x) =>
            x[1] !== socketRef.current?.id ? x[0] : null
          )}
        </div>
      </div>

      <div
        id="score"
        className="grow flex items-center justify-center tracking-[0.5rem]
                 text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
      >
        {yourScore}:{oponentScore}
      </div>

      <div
        id="rematch-wrapper"
        className={`grow flex flex-col items-center justify-center relative
                 ${rematch ? 'visible' : 'invisible'}`}
      >
        <div
          className={`${
            rematchYou ? 'rematch-player1' : 'rematch-player2'
          } absolute rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bottom-[-40%] right-15`}
        ></div>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-2">
          rematch
        </p>
        <div
          className={`${
            rematchOponent ? 'rematch-player1' : 'rematch-player2'
          } absolute rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bottom-[-40%] left-15`}
        ></div>
      </div>
    </div>
  );
}

export default Scoreboard;
