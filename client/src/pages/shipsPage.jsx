import React from 'react';
import Scoreboard from '../scoreboard/scoreboard';
import ShipsBoard from '../ships/shipsBoard';
import Chat from '../chat/chat';
import ShipsContainer from '../ships/shipsContainer';

function ShipsPage() {
  return (
    <>
      <Scoreboard />
      <ShipsBoard />
      <ShipsContainer />
      <Chat />
    </>
  );
}

export default ShipsPage;
