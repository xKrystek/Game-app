import { memo, useEffect, useState, useRef } from "react";

const ShipsContainer = memo(function ShipsContainer({ }) {
  const [pos, setPos] = useState({
    two: { x: 0, y: 0 },
    three: { x: 0, y: 0 },
    four: { x: 0, y: 0 },
    five: { x: 0, y: 0 }
  });

  const [offset, setOffset] = useState({
    two: { x: 0, y: 0 },
    three: { x: 0, y: 0 },
    four: { x: 0, y: 0 },
    five: { x: 0, y: 0 }
  });

  const [draggingShip, setDraggingShip] = useState(null);
  const draggedElWidth = useRef(0);
  const draggedElHeight = useRef(0);

  function handleMouseDown(e) {
    const ship = e.target.closest("[data-ship]").dataset.ship;

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

  useEffect(() => {
    function handleMouseMove(e) {
      if (!draggingShip) return;

      setPos((prev) => ({
        ...prev,
        [draggingShip]: {
          x: e.clientX - offset[draggingShip].x,
          y: e.clientY - offset[draggingShip].y
        }
      }));
    }
    function handleMouseUp(e){
      setDraggingShip(false);
    }

    function windowPreventDefault(e){
      e.preventDefault();
    }

    window.addEventListener("mousedown", windowPreventDefault)
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", windowPreventDefault);
    };
  }, [draggingShip, offset]);

  return (
    <>
      {["two", "three", "four", "five"].map((value, index) => (
        <div
          key={value}
          className="xl:h-[calc(65%/2)] lg:h-1/4 h-1/6 w-[41px] 
                     border border-amber-100 absolute -translate-y-1/2 
                     top-1/2 left-full -translate-x-full"
          style={{
            left: pos[value].x === 0 ? "100%" : `${pos[value].x}px`,
            top: pos[value].y === 0 ? "50%" : `${pos[value].y}px`,
            cursor: "grab",
            height: `calc(65%*${index + 2}/10)`
          }}
          onMouseDown={handleMouseDown}
          data-ship={value}
        >
          {value}
        </div>
      ))}
    </>
  );
});

export default ShipsContainer;


