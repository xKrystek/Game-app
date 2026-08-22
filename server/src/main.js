require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-route");
const { Server } = require("socket.io");
const http = require("http");
const roomJoin = require("./scripts/rooms.js");
const assignPlayerValuesAndEmitTicTacToe = require("./scripts/TTTplayerValues.js");
const rematchHandler = require("./scripts/rematchHandler.js");
const healthCheck = require("./controllers/status-check.js");
const scoreHandler = require("./scripts/scoreHandler.js");
const GameCheck = require("./scripts/TTTGameCheck.js");
const assignPlayerValuesAndEmitShips = require("./scripts/ShipsPlayerValues.js");
// const uuid = require("uuid");

const app = express();
require("./database/db.js");

app.use(
  cors({
    origin: [
      `${process.env.HOST_URL}`,
      "http://192.168.1.173:5173",
      "http://client/5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(cookieParser());

app.use(express.json());
app.use((_, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use("/api", authRouter);
app.use("/health", healthCheck);

const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: [
      `${process.env.HOST_URL}`,
      "http://192.168.1.173:5173",
      "http://client/5173"
    ],
    credentials: true
  }
});

const RoomsIndex = { roomNumber: 0 };

const fullChat = {};

const gameState = {};

const usernamesList = {};

const rematchState = {};

const score = {};

const SHIPS_PLACEMENT = {};

// Connection

const TIC_TAC_TOE = io.of("/tic-tac-toe");

TIC_TAC_TOE.on("connection", (socket) => {
  // join room
  console.log("socket connected");
  const roomToJoin = roomJoin(TIC_TAC_TOE.adapter.rooms, RoomsIndex);

  const socketIdForDisconnect = socket.id;

  socket.join(roomToJoin);

  if (!fullChat[roomToJoin]) fullChat[roomToJoin] = [];

  if (!usernamesList[roomToJoin]) usernamesList[roomToJoin] = [];

  // Console logs
  console.log(TIC_TAC_TOE.adapter.rooms, "all rooms");
  console.log(TIC_TAC_TOE.adapter.rooms.size, "amount of rooms");
  console.log(TIC_TAC_TOE.adapter.rooms.get("room1")?.size, "size of room1");
  console.log(TIC_TAC_TOE.adapter.sids.size, "Number of sockets");
  console.log(socket.rooms, "rooms the socket is joined to");

  // Board logic

  assignPlayerValuesAndEmitTicTacToe(
    TIC_TAC_TOE,
    gameState,
    roomToJoin,
    socket
  );

  socket.on("player-move", (board, playerValues) => {
    const THIS_SOCKET = playerValues.find((p) => p[0] === socket.id);
    const OPONENT = playerValues.find((p) => p[0] !== socket.id);

    const GAME_CHECK_RESULT = GameCheck(board);

    if (GAME_CHECK_RESULT === "X" || GAME_CHECK_RESULT === "O") {
      const WINNER =
        THIS_SOCKET[1][0] === GAME_CHECK_RESULT ? THIS_SOCKET[0] : OPONENT[0];
      const LOSER =
        THIS_SOCKET[1][0] === GAME_CHECK_RESULT ? OPONENT[0] : THIS_SOCKET[0];

      ++score[roomToJoin][WINNER];

      TIC_TAC_TOE.to(roomToJoin).emit("game_results", GAME_CHECK_RESULT);
      TIC_TAC_TOE.to(roomToJoin).emit("score", score[roomToJoin]);
    }

    console.log(score, "score");
    TIC_TAC_TOE.to(roomToJoin).emit("player-move", board);
    TIC_TAC_TOE.to(roomToJoin).emit("playerValues", playerValues);
  });

  // Scoreboard

  rematchHandler(TIC_TAC_TOE, rematchState, roomToJoin, socket);
  scoreHandler(TIC_TAC_TOE, score, roomToJoin);

  socket.on("listOfUsernames", (listOfUsernames) => {
    usernamesList[roomToJoin].push(listOfUsernames);
    TIC_TAC_TOE.to(roomToJoin).emit(
      "listOfUsernames",
      usernamesList[roomToJoin]
    );
  });

  socket.on("rematch", (playersRematchDecision) => {
    console.log(rematchState[roomToJoin], "rematch state log");
    rematchState[roomToJoin].forEach((arr) => {
      if (arr[0] === playersRematchDecision[0]) {
        arr[1] = playersRematchDecision[1];
      }
    });

    TIC_TAC_TOE.to(roomToJoin).emit("rematch", rematchState[roomToJoin]);

    if (
      rematchState[roomToJoin][0][1] === true &&
      rematchState[roomToJoin][1][1] === true
    ) {
      TIC_TAC_TOE.to(roomToJoin).emit("play-again", {
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
        six: "",
        seven: "",
        eight: "",
        nine: ""
      });

      assignPlayerValuesAndEmitTicTacToe(
        TIC_TAC_TOE,
        gameState,
        roomToJoin,
        socket
      );
      rematchState[roomToJoin][0][1] = false;
      rematchState[roomToJoin][1][1] = false;
    }
  });
  
  // On received message
  socket.on("send-message", (arrayOfMessages) => {
    fullChat[roomToJoin].push(arrayOfMessages);
    console.log(arrayOfMessages, "messages");
    console.log(roomToJoin);
    TIC_TAC_TOE.to(roomToJoin).emit("send-message", fullChat[roomToJoin]);
  });

  // Disconnected
  socket.on("disconnect", () => {
    if (!TIC_TAC_TOE.adapter.rooms.get(roomToJoin)) {
      delete fullChat[roomToJoin];
      delete gameState[roomToJoin];
      delete usernamesList[roomToJoin];
      delete rematchState[roomToJoin];
    } else {
      TIC_TAC_TOE.to(roomToJoin).emit(
        "send-message",
        (fullChat[roomToJoin] = [])
      );
      TIC_TAC_TOE.to(roomToJoin).emit(
        "play-again",
        {
          one: "",
          two: "",
          three: "",
          four: "",
          five: "",
          six: "",
          seven: "",
          eight: "",
          nine: ""
        },
        false
      );
      TIC_TAC_TOE.to(roomToJoin).emit("playerDisconnect");

      usernamesList[roomToJoin].forEach((x, i) => {
        x.forEach((y) => {
          if (y === socketIdForDisconnect)
            usernamesList[roomToJoin].splice(i, 1);
        });
      });

      TIC_TAC_TOE.to(roomToJoin).emit(
        "listOfUsernames",
        usernamesList[roomToJoin]
      );
    }
    console.log("disconnected");
    console.log(TIC_TAC_TOE.adapter.rooms, "all rooms");
    console.log(TIC_TAC_TOE.adapter.rooms.size, "amount of rooms");
  });


  });


const SHIPS = io.of("/ships");

SHIPS.on("connection", (socket) => {
  const roomToJoin = roomJoin(SHIPS.adapter.rooms, RoomsIndex);
  console.log("connected to ships");

  const socketIdForDisconnect = socket.id;

  socket.join(roomToJoin);

  if (!fullChat[roomToJoin]) fullChat[roomToJoin] = [];

  if (!usernamesList[roomToJoin]) usernamesList[roomToJoin] = [];

  // Console logs for viewing proper connection
  console.log(SHIPS.adapter.rooms, "all rooms");
  console.log(SHIPS.adapter.rooms.size, "amount of rooms");
  console.log(SHIPS.adapter.sids.size, "Number of sockets");
  console.log(socket.rooms, "rooms the socket is joined to");

  // Scoreboard

  rematchHandler(SHIPS, rematchState, roomToJoin, socket);

  socket.on("shipsPlaced", (receivedShipsPositions, frontend_id) => {
    assignPlayerValuesAndEmitShips(SHIPS, SHIPS_PLACEMENT, roomToJoin, socket, receivedShipsPositions, frontend_id);
  })

  socket.on("listOfUsernames", (listOfUsernames) => {
    if (usernamesList[roomToJoin].length < 2) {
      usernamesList[roomToJoin].push(listOfUsernames);
    } else {
      // updates socket id :)))
      usernamesList[roomToJoin].forEach((x) => {
        if (x[0] === listOfUsernames[0]) x[1] = listOfUsernames[1];
      });
    }
    SHIPS.to(roomToJoin).emit("listOfUsernames", usernamesList[roomToJoin]);
  });

  socket.on("rematch", (playersRematchDecision) => {
    console.log(rematchState[roomToJoin], "rematch state log");
    rematchState[roomToJoin].forEach((arr) => {
      if (arr[0] === playersRematchDecision[0]) {
        arr[1] = playersRematchDecision[1];
      }
    });

    SHIPS.to(roomToJoin).emit("rematch", rematchState[roomToJoin]);

    if (
      rematchState[roomToJoin][0][1] === true &&
      rematchState[roomToJoin][1][1] === true
    ) {
      SHIPS.to(roomToJoin).emit("play-again", {});
    }
  });

  // On received message
  socket.on("send-message", (arrayOfMessages) => {
    fullChat[roomToJoin].push(arrayOfMessages);
    console.log(arrayOfMessages, "messages");
    console.log(roomToJoin);
    SHIPS.to(roomToJoin).emit("send-message", fullChat[roomToJoin]);
  });

  socket.on("disconnect", () => {
    if (!SHIPS.adapter.rooms.get(roomToJoin)) {
      delete fullChat[roomToJoin];
      delete gameState[roomToJoin];
      delete usernamesList[roomToJoin];
      delete rematchState[roomToJoin];
      delete SHIPS_PLACEMENT[roomToJoin];
    } else {
      SHIPS.to(roomToJoin).emit("send-message", (fullChat[roomToJoin] = []));
      SHIPS.to(roomToJoin).emit("play-again", {}, false);
      SHIPS.to(roomToJoin).emit("playerDisconnect");

      usernamesList[roomToJoin].forEach((x, i) => {
        x.forEach((y) => {
          if (y === socketIdForDisconnect)
            usernamesList[roomToJoin].splice(i, 1);
        });
      });

      SHIPS.to(roomToJoin).emit("listOfUsernames", usernamesList[roomToJoin]);
    }
    console.log("disconnected");
    console.log(SHIPS.adapter.rooms, "all rooms");
    console.log(SHIPS.adapter.rooms.size, "amount of rooms");
  });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
// require.main is for used here for preventing it from running when imported to jest tests
if (require.main === module) {
  httpserver.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
    //Sqlite Db open status check
    // console.log(database.isOpen ? "Sqlite database is working" : "Sqlite database is not working");
  });
}

module.exports = { app, httpserver, io };
