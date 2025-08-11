import React from "react";
import { useNavigate } from "react-router-dom";

function Games() {

    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center"> 
      <button className="w-90 text-2xl" onClick={() => navigate("/tic-tac-toe")}>Tic-tac-toe</button>
      <button className="w-90 mt-5 text-2xl " onClick={() => navigate("/ships")}>Ships</button>
    </div>
  );
}

export default Games;
