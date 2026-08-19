/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawBoard(
  ctx,
  numberOfFields,
  width,
  height,
  left,
  top,
  right,
  bottom,
  gap = 0
) {
  const Field_size = (width - gap * (numberOfFields - 1)) / numberOfFields;

  // console.log(Field_size, "size of the one box");
  // console.log(width, "width of the whole board");
  if (width >= Field_size * numberOfFields + gap * (numberOfFields - 1)) {
    if (gap) {
      for (let i = 0; i <= numberOfFields; i++) {
        switch (i) {
          case 0:
            // horizontal
            ctx.beginPath();
            ctx.moveTo(left, top + i * Field_size);
            ctx.lineTo(right, top + i * Field_size);
            ctx.stroke();
            ctx.closePath();

            //vertical
            ctx.beginPath();
            ctx.moveTo(left + i * Field_size, top);
            ctx.lineTo(left + i * Field_size, bottom);
            ctx.stroke();
            ctx.closePath();
            break;
          case numberOfFields:
            ctx.strokeStyle = "red";
            // horizontal
            ctx.beginPath();
            ctx.moveTo(left, top + i * Field_size + gap * (numberOfFields - 1));
            ctx.lineTo(right, top + i * Field_size + gap * (numberOfFields - 1));
            ctx.stroke();
            ctx.closePath();

            //vertical
            ctx.beginPath();
            ctx.moveTo(left + i * Field_size + gap * (numberOfFields - 1), top);
            ctx.lineTo(left + i * Field_size + gap * (numberOfFields - 1), bottom);
            ctx.stroke();
            ctx.closePath();
            break;
          default:
            // horizontal
            ctx.beginPath();
            ctx.moveTo(left, top + i * Field_size - gap / 2 + i * gap);
            ctx.lineTo(right, top + i * Field_size - gap / 2 + i * gap);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(left, top + i * Field_size + gap / 2 + i * gap);
            ctx.lineTo(right, top + i * Field_size + gap / 2 + i * gap);
            ctx.stroke();
            ctx.closePath();

            // vertical
            ctx.beginPath();
            ctx.moveTo(left + i * Field_size - gap / 2 + i * gap, top);
            ctx.lineTo(left + i * Field_size - gap / 2 + i * gap, bottom);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(left + i * Field_size + gap / 2 + i * gap, top);
            ctx.lineTo(left + i * Field_size + gap / 2 + i * gap, bottom);
            ctx.stroke();
            ctx.closePath();
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
  } else {
    console.log("inproper dimensions");
  }
}
