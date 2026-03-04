import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ShipsContext } from './ShipsContext';
import { io } from 'socket.io-client';
import GameCheck from '../board/game-check/TTTGameCheck';
import { AuthContext } from './AuthContext';

const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname; // 'localhost' or '192.168.1.173'
    return `http://${host}:5000`;
  }
  // fallback
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

function ShipsProvider({ children }) {
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
  const [startPlacing, setStartPlacing] = useState(false);
  const [shipsPlaced, setShipsPlaced] = useState(false);
  const [highlighted, setHighlighted] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  });
  const [board, setBoard] = useState(() =>
    Array.from({ length: 100 }).reduce((acc, curr, index) => {
      acc[index] = '';
      return acc;
    }, {})
  );

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
  const playAgainButton = useCallback(() => {
    socketRef.current.emit('play-again');
    setDisplayBtn(false);
    socketRef.current.emit('rematch', [socketId, true]);
  }, [socketId]);

  useEffect(() => {
    // 🎮 SOCKET SETUP — only on game route
    if (location.pathname === '/ships') {
      socketRef.current = io(`${BACKEND_URL}/ships`);

      // --- CONNECT EVENT ---
      socketRef.current.on('connect', () => {
        setSocketId(socketRef.current.id);
      });

      // --- LISTENERS ---
      socketRef.current.on('listOfUsernames', (usernamesFromBackend) => {
        setPlayersUsernamesList(usernamesFromBackend);
        if (usernamesFromBackend.length > 1) {
          setDisableChat(false);
          setStartPlacing(true);
        }
      });

      socketRef.current.on('send-message', (fullchat) => {
        setChat(fullchat);
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

      socketRef.current.on('win', (score) => {
        for (const key in score) {
          if (key === socketRef.current?.id) setYourScore(score[key]);
        }
      });

      socketRef.current.on('lose', (score) => {
        for (const key in score) {
          if (key !== socketRef.current?.id) setOponentScore(score[key]);
        }
      });

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

      return () => {
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

        socketRef.current.off('score');
        socketRef.current.off('play-again');
        socketRef.current.off('send-message');
        socketRef.current.off('rematch');
        socketRef.current.off('playerValues');
        socketRef.current.off('playerDisconnect');
        socketRef.current.off('listOfUsernames');
        socketRef.current.off('connect');
        socketRef.current.off('player-move');

        socketRef.current?.disconnect();
        socketRef.current = null;
      };
    }

    return () => {};
  }, [location.pathname]);

  useEffect(() => {
    if (user && socketId) {
      socketRef.current?.emit('listOfUsernames', [user, socketRef.current?.id]);
    }
  }, [user, socketId]);

  useEffect(() => {
    setStartPlacing(false);
  }, [shipsPlaced]);

  return (
    <ShipsContext.Provider
      value={{
        highlighted,
        setHighlighted,
        board,
        setBoard,
        player,
        loading,
        setLoading,
        LoggingView,
        setLoggingView,
        location,
        socketRef,
        chat,
        setChat,
        playAgainButton,
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
        startPlacing,
        setShipsPlaced
      }}
    >
      {children}
    </ShipsContext.Provider>
  );
}

export default ShipsProvider;
