import { useNavigate } from 'react-router-dom';
import { callLogoutUser } from '../services/apiCalls.js';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
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

  function onDropShip(ship, shipId) {
    if (!boardRect) return null;

    const cellSize = boardRect.height / 10;
    const len = ship.length;

    /* ---------- center → anchor ---------- */
    let anchor;
    if (ship.orientation === 'vertical') {
      anchor = {
        x: ship.center.x,
        y: ship.center.y - (len * cellSize) / 2 + cellSize / 2
      };
    } else {
      anchor = {
        x: ship.center.x - (len * cellSize) / 2 + cellSize / 2,
        y: ship.center.y
      };
    }

    /* ---------- bounds ---------- */
    if (
      anchor.x < boardRect.left ||
      anchor.y < boardRect.top ||
      anchor.x > boardRect.right ||
      anchor.y > boardRect.bottom
    ) {
      return null;
    }

    /* ---------- snap anchor ---------- */
    const col = Math.floor((anchor.x - boardRect.left) / cellSize);
    const row = Math.floor((anchor.y - boardRect.top) / cellSize);

    /* ---------- compute cells ---------- */
    const cells = [];
    for (let i = 0; i < len; i++) {
      if (ship.orientation === 'vertical') {
        cells.push((row + i) * 10 + col);
      } else {
        cells.push(row * 10 + (col + i));
      }
    }

    setHighlighted(prev => ({
      ...prev,
      [shipId]: cells
    }));

    /* ---------- anchor → snapped center ---------- */
    let snappedCenter;
    if (ship.orientation === 'vertical') {
      snappedCenter = {
        x: boardRect.left + col * cellSize + cellSize / 2,
        y:
          boardRect.top +
          row * cellSize +
          (len * cellSize) / 2
      };
    } else {
      snappedCenter = {
        x:
          boardRect.left +
          col * cellSize +
          (len * cellSize) / 2,
        y: boardRect.top + row * cellSize + cellSize / 2
      };
    }

    return { cells, center: snappedCenter };
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
          WIDTH={boardRect.width}
          HEIGHT={boardRect.height}
        />
      )}
    </>
  );
}

export default ShipsBoard;
