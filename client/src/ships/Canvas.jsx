import { useLayoutEffect, useRef, useState } from "react";

import { drawBoard, drawShip } from "../scripts/canvas_scripts";

function Canvas() {
  const canvasRef = useRef(null);
  const [WINDOW_WIDTH, setWINDOW_WIDTH] = useState(window.innerWidth);
  const [WINDOW_HEIGHT, setWindow_HEIGHT] = useState(window.innerHeight);

  window.addEventListener("resize", () => {
    setWINDOW_WIDTH(window.innerWidth);
    setWindow_HEIGHT(window.innerHeight);
  });

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
    const SHIP_SIZE_UNIT = BORDER_SIZE / NUMBER_OF_FIELDS;
    const LEFT = canvas.width / 2 - BORDER_SIZE / 2;
    const TOP = canvas.height / 2 - BORDER_SIZE / 2;
    const RIGHT = canvas.width / 2 + BORDER_SIZE / 2;
    const BOTTOM = canvas.height / 2 + BORDER_SIZE / 2;

    ctx.strokeStyle = "white";
    // ctx.strokeRect(LEFT, TOP, WIDTH, HEIGHT);
    drawBoard(ctx, NUMBER_OF_FIELDS, BORDER_SIZE, LEFT, TOP, RIGHT, BOTTOM, 4);
    drawShip(ctx, 6, WINDOW_WIDTH, TOP, SHIP_SIZE_UNIT);
  }, [WINDOW_WIDTH, WINDOW_HEIGHT]);

  return <canvas width={100} height={100} ref={canvasRef}></canvas>;
}

export default Canvas;
