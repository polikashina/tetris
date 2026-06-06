import { Canvas, type ICanvas } from "./Canvas";

interface IGame {
  startGame(): void;
}

export class Game implements IGame {
  private readonly canvas: ICanvas;
  
  private readonly columns = 10;
  private readonly rows = 20;

  private readonly fallIntervalMs = 500;
  private fallTimerId: number | null = null;

  public constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new Canvas(canvasElement, this.columns, this.rows);
  }

  public startGame(): void {
    if (this.fallTimerId !== null) {
      return;
    }
    this.fallTimerId = window.setInterval(() => {
      this.finishGame();
    }, this.fallIntervalMs);
  }


  private finishGame(): void {
    if (this.fallTimerId !== null) {
      window.clearInterval(this.fallTimerId);
      this.fallTimerId = null;
    }

    this.canvas.renderText("Game Over");
  }
}
