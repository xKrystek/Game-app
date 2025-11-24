import { memo, useEffect, useState, useRef } from 'react';

const ShipsContainer = memo(function ShipsContainer({ onDropShip }) {
  const [pos, setPos] = useState({
    one: { x: 0, y: 0 },
    two: { x: 0, y: 0 },
    three: { x: 0, y: 0 },
    four: { x: 0, y: 0 },
    five: { x: 0, y: 0 },
    six: { x: 0, y: 0 }
  });

  const [offset, setOffset] = useState({
    one: { x: 0, y: 0 },
    two: { x: 0, y: 0 },
    three: { x: 0, y: 0 },
    four: { x: 0, y: 0 },
    five: { x: 0, y: 0 },
    six: { x: 0, y: 0 }
  });

  const [draggingShip, setDraggingShip] = useState(null);
  const draggedElWidth = useRef(0);
  const draggedElHeight = useRef(0);

  function handleMouseDown(e) {
    const ship = e.target.closest('[data-ship]').dataset.ship;

    const rect = e.target.getBoundingClientRect();

    draggedElWidth.current = rect.width;
    draggedElHeight.current = rect.height;

    setOffset((prev) => ({
      ...prev,
      [ship]: {
        x: e.clientX - draggedElWidth.current - rect.left,
        y: e.clientY - draggedElHeight.current / 2 - rect.top
      }
    }));

    setDraggingShip(ship);
  }

  function rotateShip(e) {
    e.target.style.width = `${draggedElHeight.current}px`;
    e.target.style.height = `${draggedElWidth.current}px`;
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!draggingShip) return;

      const resultX = (
        ((e.clientX - offset[draggingShip].x) / window.innerWidth) *
        100
      ).toFixed(2);
      const resultY = (
        ((e.clientY - offset[draggingShip].y) / window.innerHeight) *
        100
      ).toFixed(2);

      // console.log(resultX, 'resultx');
      // console.log(resultY, 'resultY');

      setPos((prev) => ({
        ...prev,
        [draggingShip]: {
          x: resultX,
          y: resultY
        }
      }));
    }
    function handleMouseUp(e) {
      setDraggingShip(false);
      const { left, top, right, bottom, width, height } =
        e.target.getBoundingClientRect();
      const shipBordersCoordinates = {
        left: left,
        top: top,
        right: window.innerWidth - right,
        bottom: window.innerHeight - bottom,
        center: { x: left + width / 2, y: top + height / 2 }
      };
      console.log(shipBordersCoordinates);
      // console.log(shipBordersCoordinates.right, "right cursor");
      // console.log(shipBordersCoordinates.bottom, "bottom cursor")
      // console.log(shipBordersCoordinates.left, "left cursor")
      // console.log(shipBordersCoordinates.top, "top cursor")
      onDropShip(shipBordersCoordinates, e.clientX, e.clientY);
    }

    function windowPreventDefault(e) {
      e.preventDefault();
    }

    window.addEventListener('mousedown', windowPreventDefault);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousedown', windowPreventDefault);
    };
  }, [draggingShip, offset]);

  return (
    <>
      {['one', 'two', 'three', 'four', 'five', 'six'].map((value, index) => (
        <div
          key={value}
          className="w-[calc(55%/20)] border-8 border-amber-100 absolute -translate-y-1/2 
                     top-1/2 left-full -translate-x-full"
          style={{
            left: pos[value].x === 0 ? '100%' : `${pos[value].x}%`,
            top: pos[value].y === 0 ? '50%' : `${pos[value].y}%`,
            cursor: 'grab',
            height: `calc(64%*${index + 1}/10)`
          }}
          onMouseDown={handleMouseDown}
          onDoubleClick={rotateShip}
          data-ship={value}
        >
          {value}
        </div>
      ))}
    </>
  );
});

export default ShipsContainer;
