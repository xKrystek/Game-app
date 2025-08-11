import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { TaskManagerContext } from "../context";

function Chat() {
  const [inputDisplay, setInputDisplay] = useState("");
  const [message, setMessage] = useState({
    sender: null,
    message: null,
  });
  const [chat, setChat] = useState([]);
  const { location } = useContext(TaskManagerContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/tic-tac-toe") {
      socketRef.current = io("http://localhost:5000");

      socketRef.current.on("connect", () => {
        console.log(socketRef.current);
        console.log(socketRef.current.id);
      });

      socketRef.current.on("user-joined", () => {
        console.log("hello");
      });

      socketRef.current.on("send-message", (fullchat) => {
        setChat(fullchat);
        console.log(fullchat);
        console.log("fullchat", chat);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current = null;
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    socketRef.current?.emit("send-message", message);
  }, [message]);

  function sendMessage() {
    setMessage({ sender: socketRef.current?.id, message: inputDisplay });
    console.log(socketRef.current);
    setInputDisplay("");
  }

  function Disconnect() {
    console.log("disconnected");
    console.log(socketRef.current);
    socketRef.current?.disconnect();
  }

  return (
    <>
      <div>
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender == socketRef.current?.id ? "text-left" : "text-right"
            } max-w-[300px]`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputDisplay}
        onChange={(e) => setInputDisplay(e.target.value)}
        placeholder="Enter the message"
        className="border-2 p-0.5"
      />
      <button onClick={sendMessage}>Send Message</button>
      <button onClick={Disconnect}>Disconnect</button>
    </>
  );
}

export default Chat;
