import { createContext, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { callUserAuthApi } from "../services";
import { io } from "socket.io-client";
import GameCheck from "../board/game-check";

export const TaskManagerContext = createContext(null);

function TaskManagerProvider({ children }) {
  // Board constans
  const [board, setBoard] = useState({
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

  // Form constans
  const formData = useForm({
    defaultValues: {
      name: "",
      label: "",
      placeholder: "",
      componentType: "",
      type: "",
    },
  });

  // Logging and navigation constans
  const [LoggingView, setLoggingView] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Game constans
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

  // Chat constans
  const [disableChat, setDisableChat] = useState(true);

  //Scoreboard constans
  const [yourScore, setYourScore] = useState(0);
  const [oponentScore, setOponentScore] = useState(0);
  const [playersUsernamesList, setPlayersUsernamesList] = useState([]);
  const [displayScoreBoard, setDisplayScoreBoard] = useState(false);
  const [rematch, setRematch] = useState(false);
  const [rematchYou, setRematchYou] = useState(false);
  const [rematchOponent, setRematchOponent] = useState(false);

  // Websocket constans
  const socketRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [socketId, setSocketId] = useState(null);

  function handleBoardOnClick(event) {
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
  }

  function playAgainButton() {
    socketRef.current.emit("play-again");

    setDisplayBtn(false);

    socketRef.current.emit("rematch", [socketId, true]);
  }

  useEffect(() => {
    let secondPlayer;
    playersUsernamesList.forEach((user) =>
      user[1] !== socketId ? (secondPlayer = user[1]) : null
    );

    if (GameCheck(board) && player && GameCheck(board) === player)
      socketRef.current.emit("score", [socketId, yourScore + 1]);
    // need to get the sids from the usernamesList first and then accordingly to who won update it's score
    else if (GameCheck(board) && player && GameCheck(board) !== player)
      socketRef.current.emit("score", [secondPlayer, oponentScore + 1]);
  }, [gameOver]);

  useEffect(() => {
    // Verification User logic
    const verifyCookie = async () => {
      console.log("called");
      const response = await callUserAuthApi();

      console.log(response, "response");

      if (response?.userCredentials) {
        console.log(response.userCredentials, "credentials");
        setUser(response?.userCredentials.username);
        sessionStorage.setItem("username", response?.userCredentials.username);
      }

      return response?.success
        ? navigate(
            location.pathname === "/" || location.pathname === "/auth"
              ? "/games"
              : `${location.pathname}`
          )
        : navigate("/auth");
    };

    if (!sessionStorage.getItem("username")) verifyCookie();
    else setUser(sessionStorage.getItem("username"));

    // Websocket game's logic

    // console.log(location.pathname, "location pathname");

    if (location.pathname === "/tic-tac-toe") {
      // Connect to socket
      socketRef.current = io("http://localhost:5000/tic-tac-toe");

      socketRef.current.on("connect", () => {
        // console.log(socketRef.current.id, "socket id"); // check socket id
        setSocketId(socketRef.current.id);
        // emit usernames with socket id
      });

      socketRef.current.on("listOfUsernames", (usernamesFromBackend) => {
        setPlayersUsernamesList(usernamesFromBackend);
      });

      socketRef.current.on("send-message", (fullchat) => {
        setChat(fullchat);
      });

      // tic-tac-toe websocket logic
      socketRef.current.on("player-move", (board, bool) => {
        setBoard(board);
      });

      socketRef.current.on("playerValues", (playerValues) => {
        setStoredInfo(playerValues);
        // console.log(playerValues, "player Values");
        let temporaryArray = [];
        if (playerValues.length > 0) {
          setDisableChat(false);
          // setDisplayScoreBoard(true);
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
          if (val[0] === socketRef.current.id) {
            setRematchYou(val[1]);
          } else {
            setRematchOponent(val[1]);
          }
        });
      });

      socketRef.current.on("score", (score) => {
        if (score[0] === socketRef.current.id) setYourScore(score[1]);
        else setOponentScore(score[1]);
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

    return () => {
      setBoard({
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
    };
  }, [location.pathname]);

  useEffect(() => {
    if (user && socketId) {
      // console.log(user, "user log");
      // console.log(socketId, "socket id")
      socketRef.current?.emit("listOfUsernames", [user, socketRef.current?.id]);
    }
  }, [user, socketId]);

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
        setOponentScore,
      }}
    >
      {children}
    </TaskManagerContext.Provider>
  );
}

export default TaskManagerProvider;
