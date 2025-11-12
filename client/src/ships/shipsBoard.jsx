import { useNavigate } from 'react-router-dom';
import wordsList from '../scripts/wordListGenerator.js';
import { callLogoutUser } from '../services/apiCalls.js';

function ShipsBoard() {
  const navigate = useNavigate();

  const handleLogoutUser = () => {
    callLogoutUser().then(() => navigate('/auth'));
  };

  return (
    <>
      <button
        onClick={handleLogoutUser}
        className="fixed top-0 left-0 2xl:text-5xl xl:text-3xl sm:text-sm text-lg m-2"
      >
        LogOut
      </button>
      <div className="ships grid gap-0.5 grid-cols-10 grid-rows-10 xl:h-[65%] lg:h-1/2 h-1/3 aspect-square absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2">
        {wordsList.map((value, index) => (
          <div
            data-cell={`${value}`}
            className={`border-2 border-white w-full h-full ${value}`}
            key={index}
          ></div>
        ))}
      </div>
    </>
  );
}

export default ShipsBoard;
