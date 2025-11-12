function scoreHandler (namespace, score, roomToJoin) {
  if (namespace.adapter.rooms.get(roomToJoin).size === 2) {
    score[roomToJoin] = {};

    namespace.adapter.rooms.get(roomToJoin).forEach((sid) => {
      score[roomToJoin][sid] = 0;
    });

    return score[roomToJoin];
  }
}

module.exports = scoreHandler;
