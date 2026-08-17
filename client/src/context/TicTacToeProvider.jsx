/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { io } from "socket.io-client";
import { TicTacToeContext } from "./TicTacToeContext";
import { AuthContext } from "./AuthContext";

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname; // 'localhost' or '192.168.1.173'
    return `http://${host}:5000`;
  }
  // fallback
  return "http://localhost:5000";
};

const BACKEND_URL = getBackendUrl();

function TicTacToeProvider({ children }) {
  // -----------------------------
  // 🟢 BOARD STATE
  // -----------------------------
  const [board, setBoard] = useState({
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

  // -----------------------------
  // 🟣 AUTH & NAVIGATION STATE
  // -----------------------------
  const [LoggingView, setLoggingView] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // -----------------------------
  // 🔵 GAME STATE
  // -----------------------------
  const [player, setPlayer] = useState(false);
  const [yourTurn, setYourTurn] = useState(undefined);
  const [win, setWin] = useState(false);
  const [tie, setTie] = useState(false);
  const [displayBtn, setDisplayBtn] = useState(false);
  const [storedInfo, setStoredInfo] = useState(null);
  const [storedCurrentSidsIndex, setStoredCurrentSidsIndex] = useState(null);
  const [storedOtherSidsIndex, setStoredOtherSidsIndex] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // -----------------------------
  // 🟠 CHAT STATE
  // -----------------------------
  const [disableChat, setDisableChat] = useState(true);
  const [chat, setChat] = useState([]);

  // -----------------------------
  // 🟡 SCOREBOARD STATE
  // -----------------------------
  const [yourScore, setYourScore] = useState(0);
  const [oponentScore, setOponentScore] = useState(0);
  const [playersUsernamesList, setPlayersUsernamesList] = useState([]);
  const [displayScoreBoard, setDisplayScoreBoard] = useState(false);
  const [rematch, setRematch] = useState(false);
  const [rematchYou, setRematchYou] = useState(false);
  const [rematchOponent, setRematchOponent] = useState(false);
  const [gameCheck, setGameCheck] = useState(null);

  // -----------------------------
  // 🔴 SOCKET STATE
  // -----------------------------
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);

  // -----------------------------
  // ⚙️ HANDLERS
  // -----------------------------
  const handleBoardOnClick = useCallback(
    (event) => {
      const cellDiv = event.target.closest("[data-cell]");
      if (!cellDiv) return;

      const cell = cellDiv.dataset.cell;
      if (!yourTurn || board[cell]) return;

      const updatedBoard = { ...board, [cell]: player };

      storedInfo[storedCurrentSidsIndex][1][1] =
        !storedInfo[storedCurrentSidsIndex][1][1];
      storedInfo[storedOtherSidsIndex][1][1] =
        !storedInfo[storedOtherSidsIndex][1][1];

      socketRef.current.emit("player-move", updatedBoard, storedInfo);
    },
    [
      board,
      yourTurn,
      player,
      storedInfo,
      storedCurrentSidsIndex,
      storedOtherSidsIndex
    ]
  );

  const playAgainButton = useCallback(() => {
    socketRef.current.emit("play-again");
    setDisplayBtn(false);
    socketRef.current.emit("rematch", [socketId, true]);
  }, [socketId]);

  // -----------------------------
  // 🧠 MAIN EFFECT — AUTH + SOCKET SETUP
  // -----------------------------
  useEffect(() => {
    // 🎮 SOCKET SETUP — only on game route
    if (location.pathname === "/tic-tac-toe") {
      socketRef.current = io(`${BACKEND_URL}/tic-tac-toe`);

      // --- CONNECT EVENT ---
      socketRef.current.on("connect", () => {
        setSocketId(socketRef.current.id);
      });

      // --- LISTENERS ---
      socketRef.current.on("listOfUsernames", (usernamesFromBackend) => {
        setPlayersUsernamesList(usernamesFromBackend);
      });

      socketRef.current.on("send-message", (fullchat) => {
        setChat(fullchat);
      });

      socketRef.current.on("player-move", (board) => {
        setBoard(board);
      });

      socketRef.current.on("playerValues", (playerValues) => {
        setStoredInfo(playerValues);

        let temporaryArray = [];
        if (playerValues.length > 0) {
          setDisableChat(false);
          playerValues.forEach((sid) => {
            if (sid[0] === socketRef.current.id) setPlayer(sid[1][0]);
            temporaryArray.push(sid[0]);
          });

          let indexOfCurrentId = temporaryArray.findIndex(
            (x) => x === socketRef.current.id
          );
          setStoredCurrentSidsIndex(indexOfCurrentId);

          let otherIndex = temporaryArray.findIndex(
            (x) => x !== socketRef.current.id
          );

          if (otherIndex !== -1) {
            setStoredOtherSidsIndex(otherIndex);
            setYourTurn(playerValues[indexOfCurrentId][1][1]);
          }
        }
      });

      socketRef.current.on("play-again", (board) => {
        setBoard(board);
        setWin(false);
        setTie(false);
        setGameOver(false);
      });

      socketRef.current.on("rematch", (playersRematchDecisions) => {
        playersRematchDecisions.forEach((val) => {
          if (val[0] === socketRef.current.id) setRematchYou(val[1]);
          else setRematchOponent(val[1]);
        });
      });

      socketRef.current.on("score", (score) => {
        for (const key in score) {
          if (key === socketRef.current?.id) setYourScore(score[key]);
        }
      });

      socketRef.current.on("game_result", (gameCheck) => {
        setGameCheck(gameCheck);
      })

      socketRef.current.on("lose", (score) => {
        for (const key in score) {
          if (key !== socketRef.current?.id) setOponentScore(score[key]);
        }
      });

      socketRef.current.on("playerDisconnect", () => {
        setYourTurn(undefined);
        setDisableChat(false);
        setRematch(false);
        setRematchOponent(false);
        setRematchYou(false);
        setDisplayScoreBoard(false);
        setYourScore(0);
        setOponentScore(0);
        setDisplayBtn(false);
        setGameOver(false);
      });
    }

    // 🧹 CLEANUP
    return () => {
      if (location.pathname === "/tic-tac-toe") {
        setBoard({
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
        setYourTurn(undefined);
        setDisableChat(false);
        setRematch(false);
        setRematchOponent(false);
        setRematchYou(false);
        setDisplayScoreBoard(false);
        setYourScore(0);
        setOponentScore(0);
        setDisplayBtn(false);
        setGameOver(false);

        socketRef.current?.disconnect();
        socketRef.current = null;
      }
    };
  }, [location.pathname]);

  // -----------------------------
  // 🧾 EMIT USERNAME WHEN READY
  // -----------------------------
  useEffect(() => {
    if (user && socketId) {
      socketRef.current?.emit("listOfUsernames", [user, socketRef.current?.id]);
    }
  }, [user, socketId]);

  // -----------------------------
  // 🧩 CONTEXT PROVIDER
  // -----------------------------
  return (
    <TicTacToeContext.Provider
      value={{
        board,
        setBoard,
        player,
        user,
        loading,
        setLoading,
        LoggingView,
        setLoggingView,
        location,
        socketRef,
        chat,
        setChat,
        playAgainButton,
        handleBoardOnClick,
        win,
        setWin,
        tie,
        setTie,
        displayBtn,
        setDisplayBtn,
        yourTurn,
        setYourTurn,
        gameOver,
        setGameOver,
        disableChat,
        rematch,
        setRematch,
        playersUsernamesList,
        displayScoreBoard,
        setDisplayScoreBoard,
        rematchYou,
        rematchOponent,
        setRematchOponent,
        setRematchYou,
        yourScore,
        setYourScore,
        oponentScore,
        setOponentScore,
        gameCheck
      }}
    >
      {children}
    </TicTacToeContext.Provider>
  );
}

export default TicTacToeProvider;
