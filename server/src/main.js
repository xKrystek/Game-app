require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-route");
const { Server } = require("socket.io");
const http = require("http");
const room_join = require("./scripts/rooms.js");
const assignPlayerValuesandEmit = require("./scripts/playerValues.js");
const rematchHandler = require("./scripts/rematchHandler.js");

const app = express();
require("./database");
const user = require("./models/User.js");

// user.find({username: "kupa"}).then(x => console.log(x));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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

const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const RoomsIndex = { roomNumber: 0 };

let fullChat = {};

let gameState = {};

let usernamesList = {};

let rematchState = {};

// Connection

const TIC_TAC_TOE = io.of("/tic-tac-toe");

TIC_TAC_TOE.on("connection", (socket) => {
  // join room
  const roomToJoin = room_join(TIC_TAC_TOE.adapter.rooms, RoomsIndex);

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

  assignPlayerValuesandEmit(TIC_TAC_TOE, gameState, roomToJoin, socket);

  socket.on("player-move", (board, bool) => {
    TIC_TAC_TOE.to(roomToJoin).emit("player-move", board);
    TIC_TAC_TOE.to(roomToJoin).emit("playerValues", bool);
  });

  // Scoreboard

  rematchHandler(TIC_TAC_TOE, rematchState, roomToJoin, socket);

  socket.on("listOfUsernames", (listOfUsernames) => {
    if (usernamesList[roomToJoin].length < 2)
      usernamesList[roomToJoin].push(listOfUsernames);
    else
      usernamesList[roomToJoin].map((x) => {
        if (x[0] === listOfUsernames[0]) return (x[1] = listOfUsernames[1]);
      });
    TIC_TAC_TOE.to(roomToJoin).emit(
      "listOfUsernames",
      usernamesList[roomToJoin]
    );
  });

  socket.on("rematch", (playersRematchDecision) => {
    console.log(rematchState[roomToJoin], "rematch state log");
    rematchState[roomToJoin].forEach((arr) => {
      if (arr[0] === playersRematchDecision[0])
        arr[1] = playersRematchDecision[1];
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
        nine: "",
      });

      assignPlayerValuesandEmit(TIC_TAC_TOE, gameState, roomToJoin, socket);
      rematchState[roomToJoin][0][1] = false;
      rematchState[roomToJoin][1][1] = false;
    }
  });

  socket.on("score", (score) => {
    TIC_TAC_TOE.to(roomToJoin).emit("score", score);
  })

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
    } else
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
        nine: "",
      },
      false
    );
    TIC_TAC_TOE.to(roomToJoin).emit("playerDisconnect");
    console.log("disconnected");
    console.log(TIC_TAC_TOE.adapter.rooms, "all rooms");
    console.log(TIC_TAC_TOE.adapter.rooms.size, "amount of rooms");
  });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
httpserver.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
