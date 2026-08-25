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
    this.snapPointsX = [];
    this.snapPointsY = [];
  }

  checkField(){
    this.ctx.save();
    for(let i = 1; i <= this.board.numberOfFields - 1; i++){
      this.snapPointsX.push(i * (this.board.Field_size + this.board.gap ) + this.board.left - this.board.gap / 2);
      this.snapPointsY.push(i * (this.board.Field_size + this.board.gap ) + this.board.top - this.board.gap / 2);
    }
    this.ctx.beginPath();
    this.snapPointsX.forEach(x => {
      this.ctx.strokeStyle = "green";
      this.ctx.moveTo(x, this.board.top);
      this.ctx.lineTo(x, this.board.bottom);
      this.ctx.stroke();
    })
    this.ctx.beginPath();
    this.snapPointsY.forEach(y => {
      this.ctx.strokeStyle = "red";
      this.ctx.moveTo(this.board.left, y);
      this.ctx.lineTo(this.board.right, y);
      this.ctx.stroke();
    })
    this.ctx.restore();
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
    Field_size
  ) {
    this.ctx = ctx;
    this.numberOfFields = numberOfFields;
    this.border_size = border_size;
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.gap = gap;
    this.Field_size = Field_size;
  }


  drawBoard() {

    if (this.gap) {
      for (let i = 0; i < this.numberOfFields; i++) {
        for (let j = 0; j < this.numberOfFields; j++) {
          this.ctx.strokeRect(
            this.left + j * (this.Field_size + this.gap),
            this.top + i * (this.Field_size + this.gap),
            this.Field_size,
            this.Field_size,
          );
        }
      }
    } else {
      for (let i = 0; i <= this.numberOfFields; i++) {
        // horizontal
        this.ctx.beginPath();
        this.ctx.moveTo(this.left, this.top + i * this.Field_size);
        this.ctx.lineTo(this.right, this.top + i * this.Field_size);
        this.ctx.stroke();
        this.ctx.closePath();

        // vertical
        this.ctx.beginPath();
        this.ctx.moveTo(this.left + i * this.Field_size, this.top);
        this.ctx.lineTo(this.left + i * this.Field_size, this.bottom);
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

  constructor(ctx, size, x, y, shipSizeUnit, gap) {
    this.ctx = ctx;
    this.size = size;
    this.shipSizeUnit = shipSizeUnit;
    this.SHIP_HEIGHT = shipSizeUnit * size + (size - 1) * gap;
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
    const number = this.size.toString();
    this.ctx.strokeText(number, x + this.SHIP_WIDTH / 2, y + actualFontHeight);
    this.setPosition(x, y);
  }
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
