import type { Position, BlockMatrix, StateSnapshot } from "./types";

const EMPTY_STATE = 0;
const FILLED_STATE = 1;

export interface IState {
  readonly currentBlock: BlockMatrix | null;
  readonly snapshot: StateSnapshot;
  addBlock(block: BlockMatrix, position: Position): void;
  moveBlock(rowOffset: number, columnOffset: number): void;
  rotateBlock(block: BlockMatrix, columnOffsets: readonly number[]): void;
  lockBlock(): void;
  findFilledRows(): number[];
  clearRows(rows: number[]): void;
  reset(): void;
}

export class State implements IState {
  private currentBlockValue: BlockMatrix | null = null;
  private currentPositionValue: Position | null = null;
  private locked: BlockMatrix = [];
  private readonly size: Position;

  public constructor(size: Position) {
    this.size = size;
    this.reset();
  }

  public get currentBlock(): BlockMatrix | null {
    if (this.currentBlockValue === null) {
      return null;
    }

    return this.currentBlockValue.map((row) => [...row]);
  }

  public get snapshot(): StateSnapshot {
    return {
      locked: this.locked.map((row) => [...row]),
      currentBlock: this.currentBlock,
      currentPosition:
        this.currentPositionValue === null
          ? null
          : { ...this.currentPositionValue },
    };
  }

  private createEmptyRow(): number[] {
    return Array<number>(this.size.column).fill(EMPTY_STATE);
  }

  public reset(): void {
    this.locked = Array.from({ length: this.size.row }, () =>
      this.createEmptyRow(),
    );
    this.currentBlockValue = null;
    this.currentPositionValue = null;
  }

  public addBlock(block: BlockMatrix, position: Position): void {
    if (
      this.currentBlockValue !== null ||
      !this.isPositionAvailable(block, position)
    ) {
      throw new Error("Block cannot be added at the specified position");
    }

    this.currentBlockValue = block;
    this.currentPositionValue = { ...position };
  }

  public moveBlock(rowOffset: number, columnOffset: number): void {
    if (this.currentBlockValue === null || this.currentPositionValue === null) {
      return;
    }

    const nextPosition = {
      row: this.currentPositionValue.row + rowOffset,
      column: this.currentPositionValue.column + columnOffset,
    };

    if (!this.isPositionAvailable(this.currentBlockValue, nextPosition)) {
      throw new Error("Block cannot move to the specified position");
    }

    this.currentPositionValue = nextPosition;
  }

  public rotateBlock(
    block: BlockMatrix,
    columnOffsets: readonly number[],
  ): void {
    if (this.currentBlockValue === null || this.currentPositionValue === null) {
      return;
    }

    for (const columnOffset of columnOffsets) {
      const nextPosition = {
        row: this.currentPositionValue.row,
        column: this.currentPositionValue.column + columnOffset,
      };
      if (this.isPositionAvailable(block, nextPosition)) {
        this.currentBlockValue = block.map((row) => [...row]);
        this.currentPositionValue = nextPosition;
        return;
      }
    }

    throw new Error("Block cannot rotate to the specified position");
  }

  public lockBlock(): void {
    if (this.currentBlockValue === null || this.currentPositionValue === null) {
      return;
    }

    const position = this.currentPositionValue;

    this.currentBlockValue.forEach((matrixRow, row) => {
      matrixRow.forEach((cell, column) => {
        if (cell !== EMPTY_STATE && position.row + row >= 0) {
          this.locked[position.row + row][position.column + column] =
            FILLED_STATE;
        }
      });
    });

    this.currentBlockValue = null;
    this.currentPositionValue = null;
  }

  public findFilledRows(): number[] {
    const filledRows: number[] = [];

    this.locked.forEach((row, index) => {
      if (row.every((cell) => cell === FILLED_STATE)) {
        filledRows.push(index);
      }
    });

    return filledRows;
  }

  public clearRows(rows: number[]): void {
    const rowsToClear = new Set(rows);
    if (rowsToClear.size === 0) {
      return;
    }

    this.locked = this.locked.filter((_, row) => !rowsToClear.has(row));
    this.locked.unshift(
      ...Array.from({ length: rowsToClear.size }, () => this.createEmptyRow()),
    );
  }

  private isPositionAvailable(block: BlockMatrix, position: Position): boolean {
    for (let row = 0; row < block.length; row++) {
      for (let column = 0; column < block[row].length; column++) {
        if (!block[row][column]) {
          continue;
        }

        const boardRow = position.row + row;
        const boardColumn = position.column + column;

        if (
          boardRow >= this.size.row ||
          boardColumn < 0 ||
          boardColumn >= this.size.column ||
          (boardRow >= 0 && this.locked[boardRow][boardColumn] === FILLED_STATE)
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
