import React from 'react';
import Scoreboard from '../scoreboard/scoreboard';
import ShipsBoard from '../ships/shipsBoard';
import Chat from '../chat/chat';

function ShipsPage() {
  return (
    <>
      <Scoreboard />
      <ShipsBoard />
      <Chat />
    </>
  );
}

export default ShipsPage;
