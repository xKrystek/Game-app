import { useLayoutEffect, useRef, useState } from "react";

import { Board, Game_Engine, Ship } from "../scripts/canvas_scripts.js";

function Canvas() {
  const canvasRef = useRef(null);
  const [WINDOW_WIDTH, setWINDOW_WIDTH] = useState(window.innerWidth);
  const [WINDOW_HEIGHT, setWindow_HEIGHT] = useState(window.innerHeight);
  const draggingShip = useRef(false);
  const offset = useRef(null);

  const handleResize = () => {
    setWINDOW_WIDTH(window.innerWidth);
    setWindow_HEIGHT(window.innerHeight);
  };

  /**
   * @param {Event} e 
   * @param {Ship} ship 
   */
  const setOffset = (e, ship) => {
    if (
      e.clientX > ship.x &&
      e.clientY > ship.y &&
      e.clientX < ship.x + ship.SHIP_WIDTH &&
      e.clientY < ship.y + ship.SHIP_HEIGHT
    ) {
      offset.current = {
        x: ship.x - e.clientX,
        y: ship.y - e.clientY,
      };
      draggingShip.current = true;
    }
    console.log(e.clientX);
  };

  /**
   * @param {Event} e 
   * @param {Ship} ship 
   */

  const cursorStyle = (e, ship) => {
    if (
      e.clientX > ship.x &&
      e.clientY > ship.y &&
      e.clientX < ship.x + ship.SHIP_WIDTH &&
      e.clientY < ship.y + ship.SHIP_HEIGHT
    ) {
      e.target.style.cursor = "pointer";
      console.log("triggered");
    } else e.target.style.cursor = "default";
  };

  /**
    @param {Ship} ship 
    @param {Game_Engine} gameEngine
    @param {Board} board
   */

  const dragShips = (e, ship, gameEngine, board) => {
    if (draggingShip.current) {
      gameEngine.clearCanvas();
      // gameEngine.checkField();
      board.drawBoard();
      ship.drawShip(e.clientX + offset.current.x, e.clientY + offset.current.y);
    }
  };

  useLayoutEffect(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = canvasRef.current;
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    canvas.height = WINDOW_HEIGHT;
    canvas.width = WINDOW_WIDTH;

    const HEIGHT = window.innerHeight * 0.3;
    const WIDTH = window.innerWidth * 0.3;

    const BORDER_SIZE = HEIGHT < WIDTH ? WIDTH : HEIGHT;
    const NUMBER_OF_FIELDS = 10;
    const LEFT = canvas.width / 2 - BORDER_SIZE / 2;
    const TOP = canvas.height / 2 - BORDER_SIZE / 2;
    const RIGHT = canvas.width / 2 + BORDER_SIZE / 2;
    const BOTTOM = canvas.height / 2 + BORDER_SIZE / 2;
    const GAP = 10;

    const SHIP_SIZE_UNIT = (BORDER_SIZE - GAP * (NUMBER_OF_FIELDS - 1)) / NUMBER_OF_FIELDS;
    console.log(SHIP_SIZE_UNIT);

    const SHIP_6 = new Ship(ctx, 6, WINDOW_WIDTH, TOP, SHIP_SIZE_UNIT, GAP);

    ctx.strokeStyle = "white";
    const ShipsBoard = new Board(
      ctx,
      NUMBER_OF_FIELDS,
      BORDER_SIZE,
      LEFT,
      TOP,
      RIGHT,
      BOTTOM,
      GAP,
      SHIP_SIZE_UNIT
    );
    ShipsBoard.drawBoard();

    SHIP_6.drawShip();

    const GAME_ENGINE = new Game_Engine(ctx, SHIP_6, ShipsBoard);
    // GAME_ENGINE.checkField();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", (e) => setOffset(e, SHIP_6));
    window.addEventListener("mousemove", (e) => {
      dragShips(e, SHIP_6, GAME_ENGINE, ShipsBoard);
      cursorStyle(e, SHIP_6);
    }
    );
    window.addEventListener("mouseup", () => {
      draggingShip.current = false;
    });

    return () => {
      // window.removeEventListener("mousedown");
      window.removeEventListener("resize", handleResize);
    };
  }, [WINDOW_WIDTH, WINDOW_HEIGHT]);

  return <canvas width={100} height={100} ref={canvasRef}></canvas>;
}

export default Canvas;
