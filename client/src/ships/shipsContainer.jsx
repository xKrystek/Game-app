import { memo, useContext, useEffect, useRef, useState } from 'react';
import { ShipsContext } from '../context/ShipsContext';

const SHIPS = ['1', '2', '3', '4', '5', '6'];

const PlacedShips = [];

const ShipsContainer = memo(function ShipsContainer({
  onDropShip,
  onHighlight,
  WIDTH,
  HEIGHT
}) {
  const draggingRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const { setShipsPlaced } = useContext(ShipsContext);

  const pendingHighlightRef = useRef(null);

  const [percentage, setPercentage] = useState(
    SHIPS.reduce((acc, id) => {
      acc[id] = { x: 90, y: 50 };
      return acc;
    }, {})
  );

  const [ships, setShips] = useState(() =>
    SHIPS.reduce((acc, id) => {
      acc[id] = {
        center: {
          x: window.innerWidth * 90 / 100,
          y: window.innerHeight / 2
        },
        orientation: 'vertical',
        rotation: 0,
        length: parseInt(id)
      };
      return acc;
    }, {})
  );

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

  useEffect(() => {
    function onMouseMove(e) {
      e.preventDefault();
      const id = draggingRef.current;
      if (!id) return;

      setShips((prev) => {
        const shipPlaced = {
          ...prev,
          [id]: {
            ...prev[id],
            center: {
              x: e.clientX - offsetRef.current.x,
              y: e.clientY - offsetRef.current.y
            }
          }
        };
        const snap = onDropShip(prev[id], id);
        if (!snap) {
          pendingHighlightRef.current = { id, cells: [] };
          return shipPlaced;
        }

        pendingHighlightRef.current = { id, cells: snap.cells };

        return shipPlaced;
      });
    }

    function onMouseUp() {
      const id = draggingRef.current;
      if (!id) return;

      draggingRef.current = null;

      setShips((prev) => {
        const ship = prev[id];
        const snap = onDropShip(ship);
        if (!snap) return prev;

        pendingHighlightRef.current = { id, cells: snap.cells };
        PlacedShips.push(ship);

        if(PlacedShips.length === 6) setShipsPlaced(true);

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

  function handleRotate(id) {
    setShips((prev) => {
      const ship = prev[id];
      const rotated = {
        ...ship,
        orientation:
          ship.orientation === 'vertical' ? 'horizontal' : 'vertical',
        rotation: (ship.rotation + 90) % 360
      };

      const snap = onDropShip(rotated);

      if (snap) {
        pendingHighlightRef.current = { id, cells: snap.cells };
      }

      return {
        ...prev,
        [id]: snap ? { ...rotated, center: snap.center } : rotated
      };
    });
  }

  useEffect(() => {
    setPercentage((prv) => {
      SHIPS.forEach((val) => {
        prv[val] = {
          y:
            Number((ships[val].center.y / window.innerHeight).toFixed(2)) * 100,
          x: Number((ships[val].center.x / window.innerWidth).toFixed(2)) * 100
        };
      });
      return prv
    });
  }, [ships]);

  useEffect(() => {
    // console.log(ships['6'].center.x, 'ship center x before');
    function handleResize() {
      // console.log(percentage);
      setShips((prev) => {
        SHIPS.forEach((id) => {
          prev[id].center.x = (window.innerWidth * percentage[id].x) / 100;
          prev[id].center.y = (window.innerHeight * percentage[id].y) / 100;
        });
        return { ...prev };
      });
    }
    window.addEventListener('resize', handleResize);

    // console.log(ships['6'].center.x, 'ship center x after');

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerHeight, window.innerWidth]);

  useEffect(() => {
    if (!pendingHighlightRef.current) return;

    const { id, cells } = pendingHighlightRef.current;
    pendingHighlightRef.current = null;
    onHighlight(id, cells);
  }, [pendingHighlightRef.current]);

  return (
    <>
      {SHIPS.map((id) => {
        const ship = ships[id];
        const cellW = WIDTH / 10;
        const cellH = HEIGHT / 10;

        return (
          <div
            key={id}
            onMouseDown={(e) => handleMouseDown(e, id)}
            onDoubleClick={() => handleRotate(id)}
            style={{
              position: 'absolute',
              left: ship.center.x,
              top: ship.center.y,
              width: cellW - 2,
              height: ship.length * cellH - 2,
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
