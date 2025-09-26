function rematchHandler(TIC_TAC_TOE, rematchState, roomToJoin, socket) {
  if (TIC_TAC_TOE.adapter.rooms.get(roomToJoin).size === 2) {
    rematchState[roomToJoin] = [];

    TIC_TAC_TOE.adapter.rooms.get(roomToJoin).forEach((sid) => {
     rematchState[roomToJoin].push([sid, false]);
    });
  
    return rematchState[roomToJoin];
  }
}

module.exports = rematchHandler;