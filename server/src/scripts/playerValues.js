function assignPlayerValuesandEmit(TIC_TAC_TOE, gameState, roomToJoin, socket) {
  if (TIC_TAC_TOE.adapter.rooms.get(roomToJoin).size === 2) {
    gameState[roomToJoin] = new Map();

    const Symbols = ["X", "O"];

    const index = [Math.round(Math.random() * 1)];

    const [pickRandomSymbol] = Symbols[index];

    Symbols.splice(index, 1);

    TIC_TAC_TOE.adapter.rooms.get(roomToJoin).forEach((sid) => {
      if (socket.id === sid)
        gameState[roomToJoin].set(socket.id, [
          pickRandomSymbol,
          pickRandomSymbol === "O" ? true : false,
        ]);
      else
        gameState[roomToJoin].set(sid, [
          Symbols[0],
          Symbols[0] === "O" ? true : false,
        ]);
    });
    console.log(gameState[roomToJoin], "plsss");

    TIC_TAC_TOE.to(roomToJoin).emit(
      "playerValues",
      Array.from(gameState[roomToJoin].entries())
    );
  }
  else if (TIC_TAC_TOE.adapter.rooms.get(roomToJoin).size < 2){
    TIC_TAC_TOE.to(roomToJoin).emit("playerValues", []);
  }
}

module.exports = assignPlayerValuesandEmit;
