export interface ICanvas {
  clear(): void;
  renderText(text: string): void;
}

export class Canvas implements ICanvas {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private readonly columns: number;
  private readonly rows: number;

  public constructor(canvas: HTMLCanvasElement, columns: number, rows: number) {
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2D canvas context is not available");
    }

    this.canvas = canvas;
    this.context = context;
    this.columns = columns;
    this.rows = rows;
    this.clear();
  }

  public clear(): void {
    const fieldBackgroundColor = "#D5D8C0";

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = fieldBackgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
  }

  private drawGrid(): void {
    const gridColor = "#74785A";
    const cellLineOffset = 0.5;
    const cellWidth = this.canvas.width / this.columns;
    const cellHeight = this.canvas.height / this.rows;

    this.context.strokeStyle = gridColor;
    this.context.lineWidth = 1;
    this.context.beginPath();

    for (let column = 1; column < this.columns; column++) {
      const x = column * cellWidth + cellLineOffset;
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas.height);
    }

    for (let row = 1; row < this.rows; row++) {
      const y = row * cellHeight + cellLineOffset;
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas.width, y);
    }

    this.context.stroke();
  }

  public renderText(text: string): void {
    const panelPadding = 24;
    const panelHeight = 90;
    const textBackgroundColor = "#D5D8C0";
    const textColor = "#702124";
    const textFont = "bold 36px sans-serif";

    this.context.save();
    this.context.font = textFont;
    const panelWidth = Math.min(
      this.canvas.width,
      this.context.measureText(text).width + panelPadding * 2,
    );
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = (this.canvas.height - panelHeight) / 2;

    this.context.fillStyle = textBackgroundColor;
    this.context.fillRect(panelX, panelY, panelWidth, panelHeight);

    this.context.strokeStyle = textColor;
    this.context.lineWidth = 3;
    this.context.strokeRect(panelX, panelY, panelWidth, panelHeight);

    this.context.fillStyle = textColor;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      text,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(1, panelWidth - panelPadding * 2),
    );
    this.context.restore();
  }
}
