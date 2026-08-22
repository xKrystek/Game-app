/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawBoard(
  ctx,
  numberOfFields,
  border_size,
  left,
  top,
  right,
  bottom,
  gap = 0
) {
  const Field_size = (border_size - gap * (numberOfFields - 1)) / numberOfFields;

  console.log(Field_size, "size of the one box");
  console.log(border_size, "width of the whole board");
    if (gap) {
      for (let i = 0; i < numberOfFields; i++) {
        for(let j = 0; j < numberOfFields; j++){
          ctx.strokeRect(left + j * (Field_size + gap), top + i * (Field_size + gap), Field_size, Field_size);
        }
      }
    } else {
      for (let i = 0; i <= numberOfFields; i++) {
        // horizontal
        ctx.beginPath();
        ctx.moveTo(left, top + i * Field_size);
        ctx.lineTo(right, top + i * Field_size);
        ctx.stroke();
        ctx.closePath();

        // vertical
        ctx.beginPath();
        ctx.moveTo(left + i * Field_size, top);
        ctx.lineTo(left + i * Field_size, bottom);
        ctx.stroke();
        ctx.closePath();
      }
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */

export function drawShip(ctx, size, x, y, shipSizeUnit){
  const SHIP_HEIGHT = shipSizeUnit * size;
  const SHIP_WIDTH = shipSizeUnit;

  ctx.strokeRect(x - SHIP_WIDTH - 15, y, SHIP_WIDTH, SHIP_HEIGHT);
  ctx.strokeText("6", x - SHIP_WIDTH / 3 * 2 - 15, y + 15);
}