import { Block } from "./Block";
import type { BlockMatrix } from "./types";
import { Canvas, type ICanvas } from "./Canvas";
import { State, type IState } from "./State";

interface IGame {
  startGame(): void;
  rotateBlock(): void;
  moveBlockLeft(): void;
  moveBlockRight(): void;
  moveBlockDown(): void;
}

export class Game implements IGame {
  private readonly canvas: ICanvas;
  private readonly state: IState;
  private readonly blocks: BlockMatrix[];

  private readonly columns = 10;
  private readonly rows = 20;

  private readonly fallIntervalMs = 500;
  private fallTimerId: number | null = null;

  public constructor(canvasElement: HTMLCanvasElement, blocks: BlockMatrix[]) {
    if (blocks.length === 0) {
      throw new Error("No blocks have been registered");
    }

    this.blocks = blocks;
    this.canvas = new Canvas(canvasElement, this.columns, this.rows);
    this.state = new State();
  }

  public startGame(): void {
    if (this.fallTimerId !== null) {
      return;
    }

    this.state.reset();

    this.spawnNextBlock();
    this.renderGame();

    this.fallTimerId = window.setInterval(() => {
      this.moveBlockDown();
    }, this.fallIntervalMs);
  }

  private getRandomValue(maxValue: number): number {
    return Math.floor(Math.random() * maxValue);
  }

  private getNextBlock(): Block {
    const blockIndex = this.getRandomValue(this.blocks.length);
    const nextBlock = new Block(this.blocks[blockIndex]);

    const rotationsCount = this.getRandomValue(4);
    for (let rotation = 0; rotation < rotationsCount; rotation++) {
      nextBlock.rotateRight();
    }

    return nextBlock;
  }

  public moveBlockLeft(): void {
    this.moveActiveBlock(0, -1);
  }

  public moveBlockRight(): void {
    this.moveActiveBlock(0, 1);
  }

  public moveBlockDown(): void {
    this.moveActiveBlock(1, 0);
  }

  public rotateBlock(): void {
    const currentBlockMatrix = this.state.currentBlockMatrix;
    if (currentBlockMatrix === null) {
      return;
    }

    const rotatedBlock = new Block(currentBlockMatrix);
    rotatedBlock.rotateRight();
    this.state.updateBlock(rotatedBlock.matrix);
    this.renderGame();
  }

  private spawnNextBlock() {
    const nextBlock = this.getNextBlock();
    const matrix = nextBlock.matrix;

    const lastFilledRow = matrix.reduce(
      (last, row, index) => (row.some(Boolean) ? index : last),
      0,
    );

    const startRow = -lastFilledRow;
    const startColumn = Math.floor((this.columns - nextBlock.columns) / 2);

    this.state.addBlock(matrix, {
      column: startColumn,
      row: startRow,
    });
  }

  private finishGame(): void {
    if (this.fallTimerId !== null) {
      window.clearInterval(this.fallTimerId);
      this.fallTimerId = null;
    }

    this.renderGame();
    this.canvas.renderText("Game Over");
  }

  private moveActiveBlock(rowOffset: number, columnOffset: number): void {
    if (this.state.currentBlockMatrix === null) {
      return;
    }

    this.state.moveBlock(rowOffset, columnOffset);
    this.renderGame();
  }

  private renderGame(): void {
    this.canvas.render(this.state.snapshot);
  }
}
