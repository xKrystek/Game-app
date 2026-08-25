export class Game_Engine {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Ship} ship
   * @param {Board} board
   */
  constructor(ctx, ship, board) {
    this.ctx = ctx;
    this.ship = ship;
    this.board = board;
  }

  checkField(){
    const snapPoints = [];
    for(let i = 1; i <= this.board.numberOfFields - 1; i++){
      snapPoints.push(this.board.Field_size + this.board.gap / 2);
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

export class Board {
  /**
   * @type {CanvasRenderingContext2D}
   */ ctx;
  constructor(
    ctx,
    numberOfFields,
    border_size,
    left,
    top,
    right,
    bottom,
    gap = 0,
  ) {
    this.ctx = ctx;
    this.numberOfFields = numberOfFields;
    this.border_size = border_size;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.gap = gap;
  }

  Field_size = (this.border_size - this.gap * (this.numberOfFields - 1)) / this.numberOfFields;

  drawBoard() {

    if (this.gap) {
      for (let i = 0; i < this.numberOfFields; i++) {
        for (let j = 0; j < this.numberOfFields; j++) {
          this.ctx.strokeRect(
            this.left + j * (Field_size + this.gap),
            this.top + i * (Field_size + this.gap),
            Field_size,
            Field_size,
          );
        }
      }
    } else {
      for (let i = 0; i <= this.numberOfFields; i++) {
        // horizontal
        this.ctx.beginPath();
        this.ctx.moveTo(this.left, this.top + i * Field_size);
        this.ctx.lineTo(this.right, this.top + i * Field_size);
        this.ctx.stroke();
        this.ctx.closePath();

        // vertical
        this.ctx.beginPath();
        this.ctx.moveTo(this.left + i * Field_size, this.top);
        this.ctx.lineTo(this.left + i * Field_size, this.bottom);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }
}

export class Ship {
  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  constructor(ctx, size, x, y, shipSizeUnit) {
    this.ctx = ctx;
    this.size = size;
    this.shipSizeUnit = shipSizeUnit;
    this.SHIP_HEIGHT = shipSizeUnit * size;
    this.SHIP_WIDTH = shipSizeUnit;
    this.x = x - this.SHIP_WIDTH - 15;
    this.y = y;
  }

  drawShip(x = this.x, y = this.y) {
    this.ctx.strokeRect(x, y, this.SHIP_WIDTH, this.SHIP_HEIGHT);
    this.ctx.font = "15px Arial";
    const metricsOfText = this.ctx.measureText("6");
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    const actualFontHeight =
      metricsOfText.actualBoundingBoxAscent +
      metricsOfText.actualBoundingBoxDescent;
    this.ctx.strokeText("6", x + this.SHIP_WIDTH / 2, y + actualFontHeight);
    this.setPosition(x, y);
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
