import { memo, useEffect, useState, useRef, useLayoutEffect } from 'react';

const ShipsContainer = memo(function ShipsContainer({
  onDropShip,
  WIDTH,
  HEIGHT,
  cellsPositions,
  shipPlacement
}) {
  // console.log(shipPlacement, "ship placement");
  const [pos, setPos] = useState({
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 },
    3: { x: 0, y: 0 },
    4: { x: 0, y: 0 },
    5: { x: 0, y: 0 },
    6: { x: 0, y: 0 }
  });

  const [offset, setOffset] = useState({
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 },
    3: { x: 0, y: 0 },
    4: { x: 0, y: 0 },
    5: { x: 0, y: 0 },
    6: { x: 0, y: 0 }
  });

  const [readyToSnap, setReadyToSnap] = useState(false);
  const singleClickTimeout = useRef(null);
  const [rotateDeg, setRotateDeg] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  });
  const orientationRef = useRef({
    1: 'vertical',
    2: 'vertical',
    3: 'vertical',
    4: 'vertical',
    5: 'vertical',
    6: 'vertical'
  });

  const [center, setCenter] = useState(null);
  const [draggingShip, setDraggingShip] = useState(null);
  const [draggingShip2, setDraggingShip2] = useState(null);
  const draggedElWidth = useRef(0);
  const draggedElHeight = useRef(0);

  const ETarget = useRef(null);

  function handleMouseDown(e) {
    const ship = e.target.closest('[data-ship]').dataset.ship;

    const rect = e.target.getBoundingClientRect();

    draggedElWidth.current = rect.width;
    draggedElHeight.current = rect.height;

    console.log(rect.width, 'width');
    console.log(rect.height, 'height');

    setOffset((prev) => ({
      ...prev,
      [ship]: {
        x: e.clientX - rect.right,
        y: e.clientY - rect.top
      }
    }));

    setDraggingShip(ship);
    setDraggingShip2(ship);
  }

  function rotateShip(e) {
    clearTimeout(singleClickTimeout.current);
    ETarget.current = e;

    const ship = e.target.closest('[data-ship]').dataset.ship;

    const prevRotateValue = rotateDeg[ship];
    setRotateDeg((prev) => ({ ...prev, [ship]: (prevRotateValue + 90) % 360 }));
    orientationRef.current = {
      ...prev,
      [ship]:
        orientationRef.current[ship] === 'vertical' ? 'horizontal' : 'vertical'
    };
  }

  useLayoutEffect(() => {
    if (!ETarget.current) return;

    const rect = ETarget.current.target.getBoundingClientRect();

    const ShipCoordinates = {
      left: rect.left,
      top: rect.top,
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.bottom,
      center: { x: center.x, y: center.y }
    };

    onDropShip(
      ShipCoordinates,
      draggingShip2,
      orientationRef.current,
      ETarget.current.clientX,
      ETarget.current.clientY
    );
    ETarget.current = null;
    // setReadyToSnap(true);
  }, [rotateDeg]);

  useEffect(() => {
    if (readyToSnap) {
      // console.log(orientationRef.current[draggingShip2]);
      // console.log(shipPlacement, 'ship placement');
      const shipPlacementLength = Object.entries(
        shipPlacement[draggingShip2]
      ).length;
      if (orientationRef.current[draggingShip2] === 'vertical') {
        // console.log('triggered 1');
        // console.log(
        //   shipPlacement[draggingShip2][shipPlacementLength - 1],
        //   'trig 1'
        // );
        setPos((prev) => ({
          ...prev,
          [draggingShip2]: {
            x: (
              ((window.innerWidth -
                cellsPositions[shipPlacement[draggingShip2][0]].right) /
                window.innerWidth) *
              100
            ).toFixed(2),
            y: (
              (cellsPositions[shipPlacement[draggingShip2][0]].top /
                window.innerHeight) *
              100
            ).toFixed(2)
          }
        }));
        setReadyToSnap(false);
      } else {
        // console.log('triggered 2');
        // console.log(shipPlacement[draggingShip2][0], 'trig 2');
        setPos((prev) => ({
          ...prev,
          [draggingShip2]: {
            x: (
              ((window.innerWidth -
                cellsPositions[
                  shipPlacement[draggingShip2][shipPlacementLength - 1]
                ].right) /
                window.innerWidth) *
              100
            ).toFixed(2),
            y: (
              (cellsPositions[
                shipPlacement[draggingShip2][shipPlacementLength - 1]
              ].top /
                window.innerHeight) *
              100
            ).toFixed(2)
          }
        }));
        setReadyToSnap(false);
      }
    }
  }, [orientationRef.current, shipPlacement]);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!draggingShip) return;

      const resultX = (
        ((window.innerWidth - e.clientX + offset[draggingShip].x) /
          window.innerWidth) *
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

      clearTimeout(singleClickTimeout.current);

      const { left, top, right, bottom, width, height } =
        e.target.getBoundingClientRect();

      const shipBordersCoordinates = {
        left: left,
        top: top,
        right: window.innerWidth - right,
        bottom: window.innerHeight - bottom,
        center: { x: left + width / 2, y: top + height / 2 }
      };

      setCenter({ x: left + width / 2, y: top + height / 2 });

      const shipSize = e.target.closest('[data-ship]').dataset.ship;

      // console.log(shipBordersCoordinates);
      // console.log(shipBordersCoordinates.right, "right cursor");
      // console.log(shipBordersCoordinates.bottom, "bottom cursor")
      // console.log(shipBordersCoordinates.left, "left cursor")
      // console.log(shipBordersCoordinates.top, "top cursor")

      singleClickTimeout.current = setTimeout(() => {
        onDropShip(
          shipBordersCoordinates,
          shipSize,
          orientationRef.current,
          e.clientX,
          e.clientY
        );
        setReadyToSnap(true);
      }, 200);
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
      {['1', '2', '3', '4', '5', '6'].map((value) => (
        <div
          key={value}
          className="border border-amber-100 absolute "
          style={{
            right: pos[value].x === 0 ? '0%' : `${pos[value].x}%`,
            top: pos[value].y === 0 ? '50%' : `${pos[value].y}%`,
            cursor: 'grab',
            height: `${(HEIGHT * parseInt(value)) / 10 - 2}px`,
            width: `${WIDTH / 10 - 2}px`,
            transform: `rotate(${rotateDeg[value]}deg)`
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
