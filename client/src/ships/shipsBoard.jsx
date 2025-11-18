import { useNavigate } from 'react-router-dom';
import wordsList from '../scripts/wordListGenerator.js';
import { callLogoutUser } from '../services/apiCalls.js';
import { useEffect, useRef, useState } from 'react';
import ShipsContainer from './shipsContainer.jsx';

function ShipsBoard() {
  const navigate = useNavigate();

  const handleLogoutUser = () => {
    callLogoutUser().then(() => navigate('/auth'));
  };

  const [BOARD_WIDTH, setBOARD_WIDTH] = useState(0);
  const [BOARD_HEIGHT, setBOARD_HEIGHT] = useState(0);

  const BoardRef = useRef(null);

  useEffect(() => {
    if (BoardRef.current) {
      const { height, width } = BoardRef.current.getBoundingClientRect();
      setBOARD_HEIGHT(height);
      setBOARD_WIDTH(width);
    }
  }, []);

  return (
    <>
      <button
        onClick={handleLogoutUser}
        className="fixed top-0 left-0 2xl:text-5xl xl:text-3xl sm:text-sm text-lg m-2"
      >
        LogOut
      </button>

      <div
        className="ships grid gap-0.5 grid-cols-10 grid-rows-10 xl:h-[65%] lg:h-1/2 h-1/3 aspect-square absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2"
        ref={BoardRef}
      >
        {wordsList.map((value, index) => {
          return (
            <div
              className="w-full aspect-square border border-white"
              data-cell={value}
              key={index}
            ></div>
          );
        })}
      </div>

      <ShipsContainer height={BOARD_HEIGHT} width={BOARD_WIDTH} />
    </>
  );
}

export default ShipsBoard;
