import { useNavigate } from 'react-router-dom';
import { callLogoutUser } from '../services/apiCalls.js';
import { useEffect, useRef, useState } from 'react';
import ShipsContainer from './shipsContainer.jsx';

function ShipsBoard() {
  const navigate = useNavigate();

  const handleLogoutUser = () => {
    callLogoutUser().then(() => navigate('/auth'));
  };

  const [highlighted, setHighlighted] = useState({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
  });

  const [HEIGHT, setHEIGHT] = useState(0);
  const [WIDTH, setWIDTH] = useState(0);

  const BoardRef = useRef(null);
  const cellsRef = useRef({});

  useEffect(() => {
  const refs = cellsRef.current;
  Object.keys(refs).forEach((key) => {
    const el = refs[key];
    if (el) {
      refs[key] = el.getBoundingClientRect();
    }

    const board = BoardRef.current.getBoundingClientRect();

    setHEIGHT(board.height);
    setWIDTH(board.width);
  });


}, []);

  function onDropShip(draggedShip, shipSize, orientation, mouseX, mouseY) {
    const ShipsBoardStats = BoardRef.current.getBoundingClientRect();

    const cell = Math.round(ShipsBoardStats.height / 10);
    // console.log(cell, 'cell size');

    // console.log(parseInt(shipSize), "ship size");

    // console.log(window.innerWidth - ShipsBoardStats.right, 'right');
    // console.log(window.innerHeight - ShipsBoardStats.top, 'top');
    // console.log(ShipsBoardStats.left, 'left');
    // console.log(ShipsBoardStats.right, 'right');
    //check if cursor is inside the shipsBoard
    if (
      window.innerWidth - ShipsBoardStats.right < draggedShip.right &&
      ShipsBoardStats.left < draggedShip.left &&
      ShipsBoardStats.top < draggedShip.top &&
      window.innerHeight - ShipsBoardStats.bottom < draggedShip.bottom
    ) {
      // Row of the cell within cursor underneath it
      const cellUnderCursorX =
        (mouseY - ShipsBoardStats.top) / cell % 10;
      const cellUnderCursorY =
        (mouseX - ShipsBoardStats.left) / cell % 10;

      const shipColumn = Math.round((draggedShip.top - ShipsBoardStats.top) / cell % 10);
      const shipTopRow = Math.round((draggedShip.left - ShipsBoardStats.left) / cell % 10);

      // console.log(cellUnderCursorX, 'row under the cursor');
      // console.log(cellUnderCursorY, 'column under the cursor');
      console.log((draggedShip.left - ShipsBoardStats.left) / cell % 10, "left border of ship from left side of board");
      console.log(Math.round((draggedShip.left - ShipsBoardStats.left) / cell % 10), "rounded to snap X");
      console.log((draggedShip.top - ShipsBoardStats.top) / cell % 10, "top border of ship from top side of board");
      console.log(Math.round((draggedShip.top - ShipsBoardStats.top) / cell % 10), "rounded to snap Y");
      // console.log((draggedShip.center.x - ShipsBoardStats.left) / cell % 10, "center x cord");
      // console.log((draggedShip.center.y - ShipsBoardStats.top) / cell % 10, "center y cord");
    
      const shipPlacement = () => {
        const shipPlacementArray = {[shipSize]: []};

        console.log(shipPlacementArray, "array");

        if(orientation[shipSize] === "vertical"){

          for(let i = 0; i < parseInt(shipSize); i++){
            shipPlacementArray[shipSize].push(shipTopRow + ((shipColumn + i) * 10 ));
          }
  
        } else {

          for(let i = 0; i < parseInt(shipSize); i++){
            shipPlacementArray[shipSize].push(shipTopRow + i + shipColumn * 10);
          }
        }
        return shipPlacementArray;
      }
      setHighlighted(prev => ({...prev, ...shipPlacement()}));
      // console.log("highlighted placement ship", shipPlacement());
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
        {Array.from({length: 100},(_, index) => index).map((value, index) => {

          const indexesOfEachShip = Object.values(highlighted);
          const isHighlighted = indexesOfEachShip.some(arr => arr.includes(index));


          return (
            <div
              className="w-full aspect-square border border-white"
              data-cell={value}
              key={index}
              style={{backgroundColor: isHighlighted ? "lightsalmon" : null}}
              ref={(el) => {
                cellsRef.current[index] = el;
              }}
            ></div>
          );
        })}
      </div>

      <ShipsContainer onDropShip={onDropShip} WIDTH={WIDTH} HEIGHT={HEIGHT} cellsPositions={cellsRef.current} />
    </>
  );
}

export default ShipsBoard;
