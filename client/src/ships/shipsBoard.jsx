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

  const BoardRef = useRef(null);

  function onDropShip(draggedShip, mouseX, mouseY) {
    const ShipsBoardStats = BoardRef.current.getBoundingClientRect();

    const cell = Math.round(ShipsBoardStats.height / 10);
    console.log(cell, 'cell size');

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

      console.log(cellUnderCursorX, 'row under the cursor');
      console.log(cellUnderCursorY, 'column under the cursor');
      console.log((draggedShip.left - ShipsBoardStats.left) / cell % 10, "left border of ship from left side of board")
      console.log(Math.round((draggedShip.left - ShipsBoardStats.left) / cell % 10), "rounded to snap")
      console.log((draggedShip.top - ShipsBoardStats.top) / cell % 10, "top border of ship from top side of board")
      console.log(Math.round((draggedShip.top - ShipsBoardStats.top) / cell % 10), "rounded to snap")
      console.log((draggedShip.center.x - ShipsBoardStats.left) / cell % 10, "center x cord");
      console.log((draggedShip.center.y - ShipsBoardStats.top) / cell % 10, "center y cord");
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
        {wordsList(100).map((value, index) => {
          return (
            <div
              className="w-full aspect-square border border-white"
              data-cell={value}
              key={index}
            ></div>
          );
        })}
      </div>

      <ShipsContainer onDropShip={onDropShip} />
    </>
  );
}

export default ShipsBoard;
