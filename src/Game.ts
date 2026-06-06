import { Block } from "./Block";
import type { BlockMatrix } from "./types";
import { Canvas, type ICanvas } from "./Canvas";
import { State, type IState } from "./State";

export class Game {
  private readonly canvas: ICanvas;
  private readonly state: IState;
  private readonly blocks: BlockMatrix[];

  private readonly wallKickColumnOffsets = [0, -1, 1, -2, 2];

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
    this.state = new State({ column: this.columns, row: this.rows });
  }

  public startGame(): void {
    if (this.fallTimerId !== null) {
      return;
    }

    this.state.reset();
    this.canvas.clear();

    if (!this.spawnNextBlock()) {
      this.finishGame();
      return;
    }

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
    const currentBlock = this.state.currentBlock;
    if (currentBlock === null) {
      return;
    }

    const rotatedBlock = new Block(currentBlock);
    rotatedBlock.rotateRight();

    try {
      this.state.rotateBlock(rotatedBlock.matrix, this.wallKickColumnOffsets);
    } catch {
      return;
    }

    this.renderGame();
  }

  private spawnNextBlock(): boolean {
    const nextBlock = this.getNextBlock();
    const matrix = nextBlock.matrix;

    const lastFilledRow = matrix.reduce(
      (last, row, index) => (row.some(Boolean) ? index : last),
      -1,
    );
    if (lastFilledRow === -1) {
      throw new Error("Block matrix must contain at least one filled cell");
    }

    const startColumn = Math.floor((this.columns - nextBlock.columns) / 2);
    const startRow = -lastFilledRow;

    try {
      this.state.addBlock(matrix, {
        column: startColumn,
        row: startRow,
      });
    } catch {
      return false;
    }

    return true;
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
    if (this.state.currentBlock === null) {
      return;
    }

    try {
      this.state.moveBlock(rowOffset, columnOffset);
    } catch {
      if (rowOffset === 0) {
        return;
      }

      this.state.lockBlock();
      const filledRows = this.state.findFilledRows();
      this.state.clearRows(filledRows);

      if (!this.spawnNextBlock()) {
        this.finishGame();
        return;
      }
    }

    this.renderGame();
  }

  private renderGame(): void {
    this.canvas.render(this.state.snapshot);
  }
}
