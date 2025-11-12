function rematchHandler (namespace, rematchState, roomToJoin) {
  if (namespace.adapter.rooms.get(roomToJoin).size === 2) {
    rematchState[roomToJoin] = [];

    namespace.adapter.rooms.get(roomToJoin).forEach((sid) => {
      rematchState[roomToJoin].push([sid, false]);
    });

    return rematchState[roomToJoin];
  }
}

module.exports = rematchHandler;
