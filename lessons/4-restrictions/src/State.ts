import type { Position, BlockMatrix, StateSnapshot } from "./types";

export interface IState {
  readonly currentBlockMatrix: BlockMatrix | null;
  readonly snapshot: StateSnapshot;
  addBlock(block: BlockMatrix, position: Position): void;
  moveBlock(rowOffset: number, columnOffset: number): void;
  updateBlock(block: BlockMatrix, columnOffsets: readonly number[]): void;
  reset(): void;
}

export class State implements IState {
  private blockMatrix: BlockMatrix | null = null;
  private position: Position | null = null;
  private readonly size: Position;

  public constructor(size: Position) {
    this.size = size;
    this.reset();
  }

  public get currentBlockMatrix(): BlockMatrix | null {
    if (this.blockMatrix === null) {
      return null;
    }

    return this.blockMatrix.map((row) => [...row]);
  }

  public get snapshot(): StateSnapshot {
    return {
      currentBlock: this.currentBlockMatrix,
      currentPosition: this.position === null ? null : { ...this.position },
    };
  }

  public reset(): void {
    this.blockMatrix = null;
    this.position = null;
  }

  public addBlock(block: BlockMatrix, position: Position): void {
    if (
      this.currentBlockMatrix !== null ||
      !this.isPositionAvailable(block, position)
    ) {
      throw new Error("Block cannot be added at the specified position");
    }

    this.blockMatrix = block.map((b) => [...b]);
    this.position = { ...position };
  }

  public moveBlock(rowOffset: number, columnOffset: number): void {
    if (this.blockMatrix === null || this.position === null) {
      return;
    }

    const nextPosition = {
      row: this.position.row + rowOffset,
      column: this.position.column + columnOffset,
    };

    if (!this.isPositionAvailable(this.blockMatrix, nextPosition)) {
      throw new Error("Block cannot move to the specified position");
    }

    this.position = nextPosition;
  }

  public updateBlock(block: BlockMatrix, columnOffsets: number[]): void {
    if (this.blockMatrix === null || this.position === null) {
      return;
    }

    for (const columnOffset of columnOffsets) {
      const nextPosition = {
        row: this.position.row,
        column: this.position.column + columnOffset,
      };
      if (this.isPositionAvailable(block, nextPosition)) {
        this.blockMatrix = block.map((row) => [...row]);
        this.position = nextPosition;
        return;
      }
    }

    throw new Error("Block cannot update to new matrix");
    
  }

  private isPositionAvailable(block: BlockMatrix, position: Position): boolean {
    for (let row = 0; row < block.length; row++) {
      for (let column = 0; column < block[row].length; column++) {
        if (!block[row][column]) {
          continue;
        }

        const blockRow = position.row + row;
        const blockColumn = position.column + column;

        if (
          blockRow >= this.size.row ||
          blockColumn < 0 ||
          blockColumn >= this.size.column
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
