import {
  useLayoutEffect,
  useRef,
} from "react";

function Canvas() {
  const canvasRef = useRef(null);
  useLayoutEffect(() => {
    /** @type {HTMLCanvasElement} */
    const canvas = canvasRef.current;
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    ctx.strokeStyle = "white";
    const LEFT = canvas.width / 2 - 250;
    const UP = canvas.height / 2 - 250;
    const RIGHT = canvas.width / 2 + 250;
    const DOWN = canvas.height / 2 + 250;
    ctx.strokeRect(canvas.width / 2 - 250, canvas.height / 2 - 250, 500, 500);
  }, []);

  return <canvas width={100} height={100} ref={canvasRef}></canvas>;
}

export default Canvas;
