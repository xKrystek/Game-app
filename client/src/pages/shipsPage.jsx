import React from "react";
import Scoreboard from "../scoreboard/scoreboard";
import Canvas from "../ships/Canvas";
import Chat from "../chat/chat";

function ShipsPage() {
  window.addEventListener("mousedown", (e) => e.preventDefault());
  return (
    <>
      <Scoreboard />
      <Canvas />
      <Chat />
    </>
  );
}

export default ShipsPage;
