import React from 'react';
import Board from '../board/TicTacToeBoard';
import Chat from '../chat/chat';
import Scoreboard from '../scoreboard/scoreboard';

function TicTacToePage() {
  return (
    <>
      <Scoreboard />
      <Board />
      <Chat />
    </>
  );
}

export default TicTacToePage;
