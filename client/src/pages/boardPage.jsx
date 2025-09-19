import React from "react";
import Board from "../board/board";
import Chat from "../chat/chat";
import Scoreboard from "../scoreboard/scoreboard";

function BoardPage() {
  return (
    <>
      <Scoreboard/>
      <Board />
      <Chat />
    </>
  );
}

export default BoardPage;
