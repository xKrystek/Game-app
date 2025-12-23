import { memo, useEffect, useRef, useState } from 'react';

const SHIPS = ['1', '2', '3', '4', '5', '6'];
const DRAG_THRESHOLD = 4; // px

const ShipsContainer = memo(function ShipsContainer({
  onDropShip,
  WIDTH,
  HEIGHT
}) {
  const draggingRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const [ships, setShips] = useState(() =>
    SHIPS.reduce((acc, id) => {
      acc[id] = {
        center: {
          x: window.innerWidth * 0.9,
          y: window.innerHeight / 2
        },
        orientation: 'vertical', // LOGICAL ONLY
        rotation: 0,              // VISUAL ONLY
        length: parseInt(id)
      };
      return acc;
    }, {})
  );

  /* ---------------- DRAG START ---------------- */

  function handleMouseDown(e, id) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    offsetRef.current = {
      x: e.clientX - cx,
      y: e.clientY - cy
    };

    startPosRef.current = {
      x: e.clientX,
      y: e.clientY
    };

    draggingRef.current = id;
  }

  /* ---------------- DRAG MOVE / END ---------------- */

  useEffect(() => {
    function onMouseMove(e) {
      const id = draggingRef.current;
      if (!id) return;

      setShips(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          center: {
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y
          }
        }
      }));
    }

    function onMouseUp(e) {
      const id = draggingRef.current;
      if (!id) return;

      draggingRef.current = null;

      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);

      // CLICK → do nothing (allows double click)
      if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return;

      // REAL DRAG → snap
      setShips(prev => {
        const ship = prev[id];
        const snap = onDropShip(ship, id);
        if (!snap) return prev;

        return {
          ...prev,
          [id]: {
            ...ship,
            center: snap.center
          }
        };
      });
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onDropShip]);

  /* ---------------- ROTATE + RESNAP ---------------- */

  function handleRotate(id) {
    setShips(prev => {
      const ship = prev[id];
      const rotated = {
        ...ship,
        orientation:
          ship.orientation === 'vertical' ? 'horizontal' : 'vertical',
        rotation: (ship.rotation + 90) % 360
      };

      const snap = onDropShip(rotated, id);

      return {
        ...prev,
        [id]: snap ? { ...rotated, center: snap.center } : rotated
      };
    });
  }

  /* ---------------- RENDER ---------------- */

  return (
    <>
      {SHIPS.map(id => {
        const ship = ships[id];
        const cellW = WIDTH / 10;
        const cellH = HEIGHT / 10;

        // 🔥 IMPORTANT: ALWAYS VERTICAL GEOMETRY
        const width = cellW - 2;
        const height = ship.length * cellH - 2;

        return (
          <div
            key={id}
            onMouseDown={e => handleMouseDown(e, id)}
            onDoubleClick={() => handleRotate(id)}
            style={{
              position: 'absolute',
              left: ship.center.x,
              top: ship.center.y,
              width,
              height,
              transform: `translate(-50%, -50%) rotate(${ship.rotation}deg)`,
              border: '1px solid #fbbf24',
              cursor: 'grab',
              userSelect: 'none'
            }}
          >
            {id}
          </div>
        );
      })}
    </>
  );
});

export default ShipsContainer;

