import { memo, useEffect, useState, useRef } from 'react';
const ShipsContainer = memo(function ShipsContainer({ height = 0, width = 0 }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  function handleMouseDown(e) {
    const divPos = e.target.getBoundingClientRect();

    setOffset({
      x: e.clientX - divPos.left,
      y: e.clientY - divPos.top
    });
    setIsDragging(true);
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDragging) return;
      setPos({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
      console.log(e);
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <div className="grid gap-0.5 grid-cols-4 grid-rows-5 xl:h-[calc(65%/2)] lg:h-1/4 h-1/6 w-[calc(41px*4)] absolute"
            style={{
              left: `${pos.x === 0 ? "100%" : `${pos.x}px`}`,
              top: `${pos.y === 0 ? "50%" : `${pos.y}px`}`,
              cursor: "grab",
            }}
            onMouseDown={handleMouseDown}
      >
        {[5].map((value, index) => (
          <div
            key={index}
            className={`col-start-${
              index + 1
            } col-span-1 border-2 border-white`}
            style={{
              gridRowEnd: `span ${value}`,
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </>
  );
});

export default ShipsContainer;
