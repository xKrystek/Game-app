function assignPlayerValuesAndEmitShips(SHIPS, SHIPS_PLACEMENT, roomToJoin, socket) {
  if (SHIPS.adapter.rooms.get(roomToJoin).size === 2) {

    SHIPS.adapter.rooms.get(roomToJoin).forEach((sid) => {
      if (socket.id === sid) {
        SHIPS_PLACEMENT[roomToJoin] = [
          socket.id,
          [
            pickRandomSymbol,
            // true or false :))) ⬇️
            pickRandomSymbol === "O"
          ]
        ];
      } else {
        //                                        true or false :))) ⬇️
        SHIPS_PLACEMENT[roomToJoin] = [sid, [Symbols[0], Symbols[0] === "O"]];
      }
    });
  }
}

module.exports = assignPlayerValuesAndEmitShips;
