import React, { useContext, useEffect, useRef, useState } from "react";
import { TaskManagerContext } from "../context/taskManager";

function Chat() {
  const { socketRef, chat, setChat, user } = useContext(TaskManagerContext);
  const [inputDisplay, setInputDisplay] = useState("");
  const [message, setMessage] = useState({ sender: null, message: null });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const specialKey = useRef(0);
  const secondSpecialKey = useRef(1000);

  useEffect(() => {
    return () => setChat([]);
  }, []);

  // Emit new message
  useEffect(() => {
    if (message.sender !== null) {
      socketRef.current?.emit("send-message", message);
    }
  }, [message]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  function sendMessage() {
    if (inputDisplay.trim() === "") return;
    setMessage({ sender: socketRef.current?.id, message: inputDisplay });
    setInputDisplay("");
  }

  return (
    <div className="absolute top-[30%] left-[70%] h-[400px] w-[500px] border border-blue-300 flex flex-col">
      {/* Messages */}
      <div className="flex-1 flex flex-col overflow-y-auto p-2 space-y-2">
        {chat.map((msg, index) => (
          <div key={++secondSpecialKey.current} className="w-full flex flex-col">
            <span
              key={++specialKey.current}
              className={`${
                msg.sender === socketRef.current?.id ? "self-end mt-5 text-shadow-white text-[10px]" : "self-start text-white text-[10px]"
              }`}
            >
              {user.username}
            </span>
            <div
              key={index}
              className={`${
                msg.sender === socketRef.current?.id
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-gray-200 text-black"
              } w-fit max-w-[75%] break-words whitespace-pre-line p-2 rounded-2xl`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-2 border-t border-gray-300">
        <input
          type="text"
          value={inputDisplay}
          onChange={(e) => setInputDisplay(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Enter the message"
          className="border-2 p-1 flex-1 rounded"
          ref={inputRef}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
