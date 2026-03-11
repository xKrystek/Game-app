function assignPlayerValuesAndEmitTicTacToe(
  TIC_TAC_TOE,
  gameState,
  roomToJoin,
  socket
) {
  if (TIC_TAC_TOE.adapter.rooms.get(roomToJoin).size === 2) {

    const Symbols = ["X", "O"];

    const index = [Math.round(Math.random() * 1)];

    const pickRandomSymbol = Symbols[index];

    Symbols.splice(index, 1);

    TIC_TAC_TOE.adapter.rooms.get(roomToJoin).forEach((sid) => {
      if (socket.id === sid) {
        gameState[roomToJoin] = [
          socket.id,
          [
            pickRandomSymbol,
            // true or false :))) ⬇️
            pickRandomSymbol === "O"
          ]
        ];
      } else {
        //                                        true or false :))) ⬇️
        gameState[roomToJoin] = [sid, [Symbols[0], Symbols[0] === "O"]];
      }
    });
    console.log(gameState[roomToJoin], "plsss");

    TIC_TAC_TOE.to(roomToJoin).emit("playerValues", gameState[roomToJoin]);
  } else if (TIC_TAC_TOE.adapter.rooms.get(roomToJoin).size < 2) {
    TIC_TAC_TOE.to(roomToJoin).emit("playerValues", []);
  }
}

module.exports = assignPlayerValuesAndEmitTicTacToe;
