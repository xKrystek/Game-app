function assignPlayerValuesAndEmitShips(
  SHIPS,
  SHIPS_PLACEMENT,
  roomToJoin,
  socket,
  receivedShipsPositions,
  frontend_id
) {
  if (!SHIPS_PLACEMENT[roomToJoin]) SHIPS_PLACEMENT[roomToJoin] = {};

  console.log(frontend_id);

  SHIPS.adapter.rooms.get(roomToJoin).forEach((sid) => {
    console.log("works");
    frontend_id === sid ? SHIPS_PLACEMENT[roomToJoin][sid] = receivedShipsPositions : null;
  });

  console.log(SHIPS_PLACEMENT[roomToJoin]);
  SHIPS.to(roomToJoin).emit("Players_Ships_Placement", SHIPS_PLACEMENT[roomToJoin]);
}

module.exports = assignPlayerValuesAndEmitShips;
