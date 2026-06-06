import type { Position, BlockMatrix, StateSnapshot } from "./types";

export interface IState {
  readonly currentBlockMatrix: BlockMatrix | null;
  readonly snapshot: StateSnapshot;
  addBlock(block: BlockMatrix, position: Position): void;
  moveBlock(rowOffset: number, columnOffset: number): void;
  updateBlock(block: BlockMatrix): void;
  reset(): void;
}

export class State implements IState {
  private blockMatrix: BlockMatrix | null = null;
  private position: Position | null = null;

  public constructor() {
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

    this.position = nextPosition;
  }

  public updateBlock(block: BlockMatrix): void {
    if (this.blockMatrix === null || this.position === null) {
      return;
    }

    this.blockMatrix = block.map((row) => [...row]);
  }
}
