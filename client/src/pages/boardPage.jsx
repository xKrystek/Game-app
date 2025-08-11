import React from "react";
import Board from "../board/board";
import Chat from "../socket/chat";

function BoardPage() {
  return (
    <>
      <Board />
      <Chat />
    </>
  );
}

export default BoardPage;
