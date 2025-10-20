import React, { useContext } from "react";
import { TaskManagerContext } from "../context/taskManagerContext";

function Games() {

    const {navigate} = useContext(TaskManagerContext);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full"> 
      <button className="w-90 text-2xl" onClick={() => navigate("/tic-tac-toe")}>Tic-tac-toe</button>
      <button className="w-90 mt-5 text-2xl " onClick={() => navigate("/ships")}>Ships</button>
    </div>
  );
}

export default Games;
