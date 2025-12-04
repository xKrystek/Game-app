import { useNavigate } from 'react-router-dom';
import { callLogoutUser } from '../services/apiCalls.js';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import ShipsContainer from './shipsContainer.jsx';
import { ShipsContext } from '../context/ShipsContext.jsx';

function ShipsBoard() {
  const navigate = useNavigate();

  const handleLogoutUser = () => {
    callLogoutUser().then(() => navigate('/auth'));
  };

  const {highlighted, setHighlighted} = useContext(ShipsContext);

  const [HEIGHT, setHEIGHT] = useState(0);
  const [WIDTH, setWIDTH] = useState(0);

  // DOM nodes
  const BoardRef = useRef(null);
  const cellsRef = useRef({});
  const [cellsPositions, setCellsPositions] = useState({});

  /** 
   * Measure cells & board immediately after mount and before paint 
   * (critical for correct getBoundingClientRect)
   */
  useLayoutEffect(() => {
    const nodes = cellsRef.current;

    for (let i = 0; i < 100; i++) {
      const el = nodes[i];
      if (el) {
        setCellsPositions((prev) => ({...prev, [i]: el.getBoundingClientRect()}))
      }
    }

    if (BoardRef.current) {
      const board = BoardRef.current.getBoundingClientRect();
      setHEIGHT(board.height);
      setWIDTH(board.width);
    }
  }, []);

  function onDropShip(draggedShip, shipSize, orientation, mouseX, mouseY) {
    const ShipsBoardStats = BoardRef.current.getBoundingClientRect();
    const cellSize = ShipsBoardStats.height / 10;

    console.log(orientation, "orientation from shipsBoard")

    // is cursor inside the board?
    if (
      window.innerWidth - ShipsBoardStats.right < draggedShip.right &&
      ShipsBoardStats.left < draggedShip.left &&
      ShipsBoardStats.top < draggedShip.top &&
      window.innerHeight - ShipsBoardStats.bottom < draggedShip.bottom
    ) {
      const shipColumn = Math.round((draggedShip.top - ShipsBoardStats.top) / cellSize % 10);
      const shipTopRow = Math.round((draggedShip.left - ShipsBoardStats.left) / cellSize % 10);

      const shipPlacement = () => {
        const shipPlacementArray = { [shipSize]: [] };
        const length = parseInt(shipSize);

        if (orientation[shipSize] === 'vertical') {
          for (let i = 0; i < length; i++) {
            shipPlacementArray[shipSize].push(shipTopRow + ((shipColumn + i) * 10));
          }
        } else {
          for (let i = 0; i < length; i++) {
            shipPlacementArray[shipSize].push(shipTopRow + i + shipColumn * 10);
          }
        }

        return shipPlacementArray;
      };

      setHighlighted(prev => ({ ...prev, ...shipPlacement() }));
    }
  }

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
        {Array.from({ length: 100 }).map((_, index) => {
          const highlightedCells = Object.values(highlighted);
          const isHighlighted = highlightedCells.some(arr => arr.includes(index));

          return (
            <div
              key={index}
              data-cell={index}
              className="w-full aspect-square border border-white"
              style={{ backgroundColor: isHighlighted ? 'lightsalmon' : null }}
              ref={el => {
                if (el) cellsRef.current[index] = el;
              }}
            />
          );
        })}
      </div>

      <ShipsContainer
        onDropShip={onDropShip}
        WIDTH={WIDTH}
        HEIGHT={HEIGHT}
        cellsPositions={cellsPositions}
        shipPlacement={highlighted}
      />
    </>
  );
}

export default ShipsBoard;
