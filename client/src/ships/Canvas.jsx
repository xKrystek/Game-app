import { useLayoutEffect, useRef, useState } from "react";

import { drawBoard } from "../scripts/canvas_scripts";

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

    const WIDTH = window.innerWidth * 0.3;
    const HEIGHT = WIDTH;
    const LEFT = canvas.width / 2 - WIDTH / 2;
    const TOP = canvas.height / 2 - HEIGHT / 2;
    const RIGHT = canvas.width / 2 + WIDTH / 2;
    const BOTTOM = canvas.height / 2 + HEIGHT / 2;

    ctx.strokeStyle = "white";
    // ctx.strokeRect(LEFT, TOP, WIDTH, HEIGHT);
    drawBoard(ctx, 10, WIDTH, HEIGHT, LEFT, TOP, RIGHT, BOTTOM, 5);
  }, [WINDOW_WIDTH, WINDOW_HEIGHT]);

  return <canvas width={100} height={100} ref={canvasRef}></canvas>;
}

export default Canvas;
