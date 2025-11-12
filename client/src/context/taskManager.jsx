/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { callUserAuthApi } from '../services/apiCalls';
import { io } from 'socket.io-client';
import GameCheck from '../board/game-check/TTTGameCheck';
import { TaskManagerContext } from './taskManagerContext';

const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname; // 'localhost' or '192.168.1.173'
    return `http://${host}:5000`;
  }
  // fallback
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

function TaskManagerProvider({ children }) {
  // -----------------------------
  // 🟢 BOARD STATE
  // -----------------------------
  const [board, setBoard] = useState({
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

  // -----------------------------
  // 🟣 AUTH & NAVIGATION STATE
  // -----------------------------
  const [LoggingView, setLoggingView] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // -----------------------------
  // 🔵 GAME STATE
  // -----------------------------
  const [player, setPlayer] = useState(false);
  const [yourTurn, setYourTurn] = useState(undefined);
  const [user, setUser] = useState(null);
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

  // -----------------------------
  // 🔴 SOCKET STATE
  // -----------------------------
  const socketRef = useRef(null);
  const [socketId, setSocketId] = useState(null);

  // -----------------------------
  // ⚙️ HANDLERS
  // -----------------------------
  function handleBoardOnClick(event) {
    const cellDiv = event.target.closest('[data-cell]');
    if (!cellDiv) return;

    console.log('triggered');
    const cell = cellDiv.dataset.cell;
    if (!yourTurn || board[cell]) return;

    const updatedBoard = { ...board, [cell]: player };

    storedInfo[storedCurrentSidsIndex][1][1] =
      !storedInfo[storedCurrentSidsIndex][1][1];
    storedInfo[storedOtherSidsIndex][1][1] =
      !storedInfo[storedOtherSidsIndex][1][1];

    socketRef.current.emit('player-move', updatedBoard, storedInfo);
  }

  function playAgainButton() {
    socketRef.current.emit('play-again');
    setDisplayBtn(false);
    socketRef.current.emit('rematch', [socketId, true]);
  }

  // -----------------------------
  // 🧠 MAIN EFFECT — AUTH + SOCKET SETUP
  // -----------------------------
  useEffect(() => {
    // 🪪 Verify User
    const verifyCookie = async () => {
      console.log('called');
      const response = await callUserAuthApi();
      console.log(response, 'response');

      if (response?.userCredentials) {
        console.log(response.userCredentials, 'credentials');
        setUser(response?.userCredentials.username);
        sessionStorage.setItem('username', response?.userCredentials.username);
      }

      return response?.success
        ? navigate(
            location.pathname === '/' || location.pathname === '/auth'
              ? '/games'
              : `${location.pathname}`,
            { replace: false }
          )
        : navigate('/auth');
    };

    if (!sessionStorage.getItem('username')) verifyCookie();
    else {
      setUser(sessionStorage.getItem('username'));
      navigate(
        location.pathname === '/' || location.pathname === '/auth'
          ? '/games'
          : `${location.pathname}`
      );
    }

    // 🎮 SOCKET SETUP — only on game route
    if (location.pathname === '/tic-tac-toe') {
      socketRef.current = io(`${BACKEND_URL}/tic-tac-toe`);

      // --- CONNECT EVENT ---
      socketRef.current.on('connect', () => {
        setSocketId(socketRef.current.id);
      });

      // --- LISTENERS ---
      socketRef.current.on('listOfUsernames', (usernamesFromBackend) => {
        setPlayersUsernamesList(usernamesFromBackend);
      });

      socketRef.current.on('send-message', (fullchat) => {
        setChat(fullchat);
      });

      socketRef.current.on('player-move', (board) => {
        setBoard(board);
      });

      socketRef.current.on('playerValues', (playerValues) => {
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

      socketRef.current.on('play-again', (board) => {
        setBoard(board);
        setWin(false);
        setTie(false);
        setGameOver(false);
      });

      socketRef.current.on('rematch', (playersRematchDecisions) => {
        playersRematchDecisions.forEach((val) => {
          if (val[0] === socketRef.current.id) setRematchYou(val[1]);
          else setRematchOponent(val[1]);
        });
      });

      socketRef.current.on("win", (score) => {
        for(const key in score){
          if(key === socketRef.current?.id) setYourScore(score[key]);
        }
      })

      socketRef.current.on("lose", (score) => {
        for(const key in score){
          if(key !== socketRef.current?.id) setOponentScore(score[key]);
        }
      })

      socketRef.current.on('playerDisconnect', () => {
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

    if (location.pathname === '/ships') {
      socketRef.current = io(`${BACKEND_URL}/ships`);

      setDisableChat(false);

      // --- CONNECT EVENT ---
      socketRef.current.on('connect', () => {
        setSocketId(socketRef.current.id);
      });

      // --- LISTENERS ---
      socketRef.current.on('listOfUsernames', (usernamesFromBackend) => {
        setPlayersUsernamesList(usernamesFromBackend);
      });

      socketRef.current.on('send-message', (fullchat) => {
        setChat(fullchat);
      });
    }

    // 🧹 CLEANUP
    return () => {
      if (location.pathname === '/tic-tac-toe') {
        setBoard({
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

        socketRef.current.off("score");
        socketRef.current.off("play-again");
        socketRef.current.off("send-message");
        socketRef.current.off("rematch");
        socketRef.current.off("playerValues");
        socketRef.current.off("playerDisconnect");
        socketRef.current.off("listOfUsernames");
        socketRef.current.off("connect");
        socketRef.current.off("player-move");


        socketRef.current?.disconnect();
        socketRef.current = null;
      }
      if (location.pathname === '/ships') {
        // setYourTurn(undefined);
        // setDisableChat(false);
        // setRematch(false);
        // setRematchOponent(false);
        // setRematchYou(false);
        // setDisplayScoreBoard(false);
        // setYourScore(0);
        // setOponentScore(0);
        // setDisplayBtn(false);
      }
    };
  }, [location.pathname]);

  // -----------------------------
  // 🧾 EMIT USERNAME WHEN READY
  // -----------------------------
  useEffect(() => {
    if (user && socketId) {
      socketRef.current?.emit('listOfUsernames', [user, socketRef.current?.id]);
    }
  }, [user, socketId]);

  // -----------------------------
  // 🧩 CONTEXT PROVIDER
  // -----------------------------
  return (
    <TaskManagerContext.Provider
      value={{
        board,
        setBoard,
        player,
        user,
        setUser,
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
        GameCheck,
        yourTurn,
        setYourTurn,
        gameOver,
        setGameOver,
        disableChat,
        navigate,
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
        setOponentScore
      }}
    >
      {children}
    </TaskManagerContext.Provider>
  );
}

export default TaskManagerProvider;
