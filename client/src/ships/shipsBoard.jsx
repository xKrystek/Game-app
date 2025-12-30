import { useNavigate } from 'react-router-dom';
import { callLogoutUser } from '../services/apiCalls.js';
import { useContext, useLayoutEffect, useRef, useState, useCallback } from 'react';
import ShipsContainer from './ShipsContainer.jsx';
import { ShipsContext } from '../context/ShipsContext.jsx';

function ShipsBoard() {
  const navigate = useNavigate();
  const { highlighted, setHighlighted } = useContext(ShipsContext);

  const boardRef = useRef(null);
  const [boardRect, setBoardRect] = useState(null);

  useLayoutEffect(() => {
    if (boardRef.current) {
      setBoardRect(boardRef.current.getBoundingClientRect());
    }
  }, []);

const onDropShip = useCallback(
  (ship) => {
    if (!boardRect) return null;
    const cellSize = boardRect.height / 10;
    const len = ship.length;

    // Determine orientation
    const angle = ship.rotation % 360;
    const isHorizontal = angle === 90 || angle === 270;

    // Compute the index of the first cell (top-left)
    let centerCol = (ship.center.x - boardRect.left) / cellSize;
    let centerRow = (ship.center.y - boardRect.top) / cellSize;

    let col, row;

    if (isHorizontal) {
      col = Math.floor(centerCol - (len - 1) / 2);
      row = Math.floor(centerRow);
      if(col < -1 || col > 11) return null;
      if(row < -1 || row > 11) return null;
      col = Math.max(0, Math.min(10 - len, col));
      row = Math.max(0, Math.min(9, row));
    } else {
      col = Math.floor(centerCol);
      row = Math.floor(centerRow - (len - 1) / 2);
      if(col < -1 || col > 11) return null;
      if(row < -1 || row > 11) return null;
      col = Math.max(0, Math.min(9, col));
      row = Math.max(0, Math.min(10 - len, row));
    }

    // Occupied cells
    const cells = [];
    for (let i = 0; i < len; i++) {
      if (isHorizontal) {
        cells.push(row * 10 + (col + i));
      } else {
        cells.push((row + i) * 10 + col);
      }
    }

    // Compute exact visual center for CSS
    // Center of first cell + (len/2) * cellSize
    let centerX = boardRect.left + (col + (isHorizontal ? (len / 2) : 0.5)) * cellSize;
    let centerY = boardRect.top + (row + (isHorizontal ? 0.5 : (len / 2))) * cellSize;

    return { cells, center: { x: centerX, y: centerY } };
  },
  [boardRect]
);


  function handleHighlight(shipId, cells) {
    setHighlighted(prev => ({
      ...prev,
      [shipId]: cells
    }));
  }

  return (
    <>
      <button
        onClick={() => callLogoutUser().then(() => navigate('/auth'))}
        className="fixed top-0 left-0 m-2"
      >
        LogOut
      </button>

      <div
        ref={boardRef}
        className="ships grid grid-cols-10 grid-rows-10 gap-0.5 aspect-square h-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {Array.from({ length: 100 }).map((_, index) => {
          const isHighlighted = Object.values(highlighted).some(arr =>
            arr.includes(index)
          );

          return (
            <div
              key={index}
              className="border border-white"
              style={{ background: isHighlighted ? 'lightsalmon' : undefined }}
            />
          );
        })}
      </div>

      {boardRect && (
        <ShipsContainer
          onDropShip={onDropShip}
          onHighlight={handleHighlight}
          WIDTH={boardRect.width}
          HEIGHT={boardRect.height}
        />
      )}
    </>
  );
}

export default ShipsBoard;

