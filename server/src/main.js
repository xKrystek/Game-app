require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth-route');
const { Server } = require('socket.io');
const http = require('http');
const roomJoin = require('./scripts/rooms.js');
const assignPlayerValuesandEmit = require('./scripts/playerValues.js');
const rematchHandler = require('./scripts/rematchHandler.js');
const healthCheck = require('./controllers/status-check.js');
const scoreHandler = require("./scripts/scoreHandler.js");
const GameCheck = require("./scripts/TTTGameCheck.js");

const app = express();
require('./database/db.js');

app.use(
  cors({
    origin: [`${process.env.HOST_URL}`, 'http://192.168.1.173:5173', 'http://client/5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(cookieParser());

app.use(express.json());
app.use((_, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/api', authRouter);
app.use('/health', healthCheck);

const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: [`${process.env.HOST_URL}`, 'http://192.168.1.173:5173', 'http://client/5173'],
    credentials: true
  }
});

const RoomsIndex = { roomNumber: 0 };

const fullChat = {};

const gameState = {};

const usernamesList = {};

const rematchState = {};

const score = {};

// Connection

const TIC_TAC_TOE = io.of('/tic-tac-toe');

TIC_TAC_TOE.on('connection', (socket) => {
  // join room
  console.log('socket connected');
  const roomToJoin = roomJoin(TIC_TAC_TOE.adapter.rooms, RoomsIndex);

  const socketIdForDisconnect = socket.id;

  socket.join(roomToJoin);

  if (!fullChat[roomToJoin]) fullChat[roomToJoin] = [];

  if (!usernamesList[roomToJoin]) usernamesList[roomToJoin] = [];

  // Console logs
  console.log(TIC_TAC_TOE.adapter.rooms, 'all rooms');
  console.log(TIC_TAC_TOE.adapter.rooms.size, 'amount of rooms');
  console.log(TIC_TAC_TOE.adapter.rooms.get('room1')?.size, 'size of room1');
  console.log(TIC_TAC_TOE.adapter.sids.size, 'Number of sockets');
  console.log(socket.rooms, 'rooms the socket is joined to');

  // Board logic

  assignPlayerValuesandEmit(TIC_TAC_TOE, gameState, roomToJoin, socket);

  socket.on('player-move', (board, playerValues) => {

    const THIS_SOCKET = playerValues.find(p => p[0] === socket.id);
    const OPONENT = playerValues.find(p => p[0] !== socket.id);

    const GAME_CHECK_RESULT = GameCheck(board);

    if(GAME_CHECK_RESULT === "X" || GAME_CHECK_RESULT === "O"){
      const WINNER = THIS_SOCKET[1][0] === GAME_CHECK_RESULT ? THIS_SOCKET[0] : OPONENT[0];
      const LOSER = THIS_SOCKET[1][0] === GAME_CHECK_RESULT ? OPONENT[0] : THIS_SOCKET[0];

      score[roomToJoin][WINNER] = ++score[roomToJoin][WINNER];

      TIC_TAC_TOE.to(WINNER).emit("win", score[roomToJoin]);
      TIC_TAC_TOE.to(LOSER).emit("lose", score[roomToJoin]);
    }


    console.log(score, "score");
    TIC_TAC_TOE.to(roomToJoin).emit('player-move', board);
    TIC_TAC_TOE.to(roomToJoin).emit('playerValues', playerValues);
  });

  // Scoreboard

  rematchHandler(TIC_TAC_TOE, rematchState, roomToJoin, socket);
  scoreHandler(TIC_TAC_TOE, score, roomToJoin);

  socket.on('listOfUsernames', (listOfUsernames) => {
    if (usernamesList[roomToJoin].length < 2) {
      usernamesList[roomToJoin].push(listOfUsernames);
    } else {
      // eslint-disable-next-line array-callback-return, no-useless-return
      usernamesList[roomToJoin].map((x) => {
        if (x[0] === listOfUsernames[0]) return (x[1] = listOfUsernames[1]);
      });
    }
    TIC_TAC_TOE.to(roomToJoin).emit(
      'listOfUsernames',
      usernamesList[roomToJoin]
    );
  });

  socket.on('rematch', (playersRematchDecision) => {
    console.log(rematchState[roomToJoin], 'rematch state log');
    rematchState[roomToJoin].forEach((arr) => {
      if (arr[0] === playersRematchDecision[0]) {
        arr[1] = playersRematchDecision[1];
      }
    });

    TIC_TAC_TOE.to(roomToJoin).emit('rematch', rematchState[roomToJoin]);

    if (
      rematchState[roomToJoin][0][1] === true &&
      rematchState[roomToJoin][1][1] === true
    ) {
      TIC_TAC_TOE.to(roomToJoin).emit('play-again', {
        one: '',
        two: '',
        three: '',
        four: '',
        five: '',
        six: '',
        seven: '',
        eight: '',
        nine: ''
      });

      assignPlayerValuesandEmit(TIC_TAC_TOE, gameState, roomToJoin, socket);
      rematchState[roomToJoin][0][1] = false;
      rematchState[roomToJoin][1][1] = false;
    }
  });

  socket.on('score', (score) => {
    TIC_TAC_TOE.to(roomToJoin).emit('score', score);
  });

  // On received message
  socket.on('send-message', (arrayOfMessages) => {
    fullChat[roomToJoin].push(arrayOfMessages);
    console.log(arrayOfMessages, 'messages');
    console.log(roomToJoin);
    TIC_TAC_TOE.to(roomToJoin).emit('send-message', fullChat[roomToJoin]);
  });

  // Disconnected
  socket.on('disconnect', () => {
    if (!TIC_TAC_TOE.adapter.rooms.get(roomToJoin)) {
      delete fullChat[roomToJoin];
      delete gameState[roomToJoin];
      delete usernamesList[roomToJoin];
      delete rematchState[roomToJoin];
    } else {
      TIC_TAC_TOE.to(roomToJoin).emit(
        'send-message',
        (fullChat[roomToJoin] = [])
      );
      TIC_TAC_TOE.to(roomToJoin).emit(
        'play-again',
        {
          one: '',
          two: '',
          three: '',
          four: '',
          five: '',
          six: '',
          seven: '',
          eight: '',
          nine: ''
        },
        false
      );
      TIC_TAC_TOE.to(roomToJoin).emit('playerDisconnect');

      usernamesList[roomToJoin].forEach((x, i) => {
        x.forEach((y) => {
          if (y === socketIdForDisconnect)
            usernamesList[roomToJoin].splice(i, 1);
        });
      });

      TIC_TAC_TOE.to(roomToJoin).emit(
        'listOfUsernames',
        usernamesList[roomToJoin]
      );
    }
    console.log('disconnected');
    console.log(TIC_TAC_TOE.adapter.rooms, 'all rooms');
    console.log(TIC_TAC_TOE.adapter.rooms.size, 'amount of rooms');
  });
});

const SHIPS = io.of('/ships');

SHIPS.on("connection", (socket) => {

  const roomToJoin = roomJoin(SHIPS.adapter.rooms, RoomsIndex);
  console.log("connected to ships");

  const socketIdForDisconnect = socket.id;

  socket.join(roomToJoin);

  if (!fullChat[roomToJoin]) fullChat[roomToJoin] = [];

  if (!usernamesList[roomToJoin]) usernamesList[roomToJoin] = [];

  // Console logs
  console.log(SHIPS.adapter.rooms, 'all rooms');
  console.log(SHIPS.adapter.rooms.size, 'amount of rooms');
  console.log(SHIPS.adapter.rooms.get('room1')?.size, 'size of room1');
  console.log(SHIPS.adapter.sids.size, 'Number of sockets');
  console.log(socket.rooms, 'rooms the socket is joined to');

  // Scoreboard

  rematchHandler(SHIPS, rematchState, roomToJoin, socket);

  socket.on('listOfUsernames', (listOfUsernames) => {
    if (usernamesList[roomToJoin].length < 2) {
      usernamesList[roomToJoin].push(listOfUsernames);
    } else {
      // eslint-disable-next-line array-callback-return, no-useless-return
      usernamesList[roomToJoin].map((x) => {
        if (x[0] === listOfUsernames[0]) return (x[1] = listOfUsernames[1]);
      });
    }
    SHIPS.to(roomToJoin).emit(
      'listOfUsernames',
      usernamesList[roomToJoin]
    );
  });

  socket.on('rematch', (playersRematchDecision) => {
    console.log(rematchState[roomToJoin], 'rematch state log');
    rematchState[roomToJoin].forEach((arr) => {
      if (arr[0] === playersRematchDecision[0]) {
        arr[1] = playersRematchDecision[1];
      }
    });

    SHIPS.to(roomToJoin).emit('rematch', rematchState[roomToJoin]);

    if (
      rematchState[roomToJoin][0][1] === true &&
      rematchState[roomToJoin][1][1] === true
    ) {
      SHIPS.to(roomToJoin).emit('play-again', {
      });

    }
  });

  socket.on('score', (score) => {
    SHIPS.to(roomToJoin).emit('score', score);
  });

  // On received message
  socket.on('send-message', (arrayOfMessages) => {
    fullChat[roomToJoin].push(arrayOfMessages);
    console.log(arrayOfMessages, 'messages');
    console.log(roomToJoin);
    SHIPS.to(roomToJoin).emit('send-message', fullChat[roomToJoin]);
  });

  socket.on('disconnect', () => {
    if (!SHIPS.adapter.rooms.get(roomToJoin)) {
      delete fullChat[roomToJoin];
      delete gameState[roomToJoin];
      delete usernamesList[roomToJoin];
      delete rematchState[roomToJoin];
    } else {
      SHIPS.to(roomToJoin).emit(
        'send-message',
        (fullChat[roomToJoin] = [])
      );
      SHIPS.to(roomToJoin).emit(
        'play-again',
        {
        },
        false
      );
      SHIPS.to(roomToJoin).emit('playerDisconnect');

      usernamesList[roomToJoin].forEach((x, i) => {
        x.forEach((y) => {
          if (y === socketIdForDisconnect)
            usernamesList[roomToJoin].splice(i, 1);
        });
      });

      SHIPS.to(roomToJoin).emit(
        'listOfUsernames',
        usernamesList[roomToJoin]
      );
    }
    console.log('disconnected');
    console.log(SHIPS.adapter.rooms, 'all rooms');
    console.log(SHIPS.adapter.rooms.size, 'amount of rooms');
  });
})

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
if (require.main === module) {
  httpserver.listen(PORT, () =>
    console.log(`App is listening on PORT ${PORT}`)
  );
}

module.exports = { app, httpserver, io };
