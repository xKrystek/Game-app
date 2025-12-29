/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TicTacToeContext } from '../context/TicTacToeContext';

function Chat() {
  const { socketRef, chat, setChat, user, disableChat } =
    useContext(TicTacToeContext);
  const [inputDisplay, setInputDisplay] = useState('');
  const [message, setMessage] = useState({ sender: null, message: null });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const specialKey = useRef(0);
  const secondSpecialKey = useRef(1000);
  const [displayChat, setDisplayChat] = useState('translate-y-full');
  const [unreadMessagesNumber, setUnreadMessagesNumber] = useState(0);
  const [numberOfSeenMessages, setNumberOfSeenMessages] = useState(0);

  function toggleDisplayChat() {
    displayChat === 'translate-y-0'
      ? setDisplayChat('translate-y-full')
      : setDisplayChat('translate-y-0');
  }

  useEffect(() => {
    return () => {
      setChat([]);
      setUnreadMessagesNumber(0);
    };
  }, []);

  // Emit new message
  useEffect(() => {
    if (message.sender !== null) {
      socketRef.current?.emit('send-message', message);
    }
  }, [message]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    if (displayChat === 'translate-y-0') {
      setNumberOfSeenMessages(chat.length); // reset last seen
      setUnreadMessagesNumber(0);
    } else {
      setUnreadMessagesNumber(chat.length - numberOfSeenMessages);
    }
  }, [chat, displayChat]);

  function sendMessage() {
    if (inputDisplay.trim() === '') return;
    setMessage({
      sender: socketRef.current?.id,
      message: inputDisplay,
      user: user
    });
    setInputDisplay('');
  }

  return (
    <>
      <div
        id="messages-icon-container"
        onClick={toggleDisplayChat}
        className={displayChat === 'translate-y-full' ? 'fade' : 'invisible'}
        data-testid="messages-icon-container"
      >
        {unreadMessagesNumber === 0 ? null : (
          <div id="chat-notification">{unreadMessagesNumber}</div>
        )}
        <svg
          width="160"
          height="129"
          viewBox="0 0 460 429"
          fill="none"
          id="messages-icon"
        >
          <path
            d="M375 429C366.878 429 359.294 424.941 354.789 418.184L346.005 405.007C337.771 392.655 308.591 386.25 295.241 379.758C268.152 366.584 234 332 234 332H80C35.8172 332 1.06317e-06 296.183 0 252V80C3.7372e-06 35.8172 35.8172 8.05333e-07 80 0H380C424.183 4.50986e-06 460 35.8172 460 80V252C460 296.183 424.183 332 380 332H375V429Z"
            fill="#406BDA"
          />
        </svg>
      </div>
      <div
        className={`h-[40%] lg:aspect-[13/10] aspect-1/1 border border-blue-300 flex-col fixed right-0 bottom-0 flex ${displayChat} transition-transform delay-0 duration-1000 ease-in-out bg-black`}
        id="chat"
        data-testid="chat"
      >
        <div className="bg-[#201f1f] w-full h-10 flex justify-end items-center">
          <button
            onClick={toggleDisplayChat}
            className="text-1xl text-red-500 w-5 h-8 flex items-center text-center justify-center mr-1"
          >
            -
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-y-auto p-2 space-y-2">
          {chat.map((msg, index) => (
            <div
              key={++secondSpecialKey.current}
              className="w-full flex flex-col"
            >
              <span
                key={++specialKey.current}
                className={`${
                  msg.sender === socketRef.current?.id
                    ? 'self-end text-shadow-white text-[10px]'
                    : 'self-start text-white text-[10px]'
                }`}
              >
                {msg.user === user ? user : msg.user}
              </span>
              <div
                key={index}
                className={`${
                  msg.sender === socketRef.current?.id
                    ? 'self-end bg-blue-500 text-white'
                    : 'self-start bg-gray-200 text-black'
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
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Enter the message"
            className="border-2 p-1 flex-1 rounded text-[2vw] xl:text-[1.5vw]"
            ref={inputRef}
            disabled={disableChat}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-2 rounded "
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
