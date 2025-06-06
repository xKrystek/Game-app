function Board() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-3 w-[calc(100dvw/2)] h-[calc(100dvh/2)]">
      <div className="border-solid border-3 border-white w-full"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
      <div className="border-solid border-3 border-white"></div>
    </div>
  );
}

export default Board;
