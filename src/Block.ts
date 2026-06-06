import type { BlockMatrix } from "./types";

export class Block {
  private matrixValue: BlockMatrix;

  public constructor(matrix: BlockMatrix) {
    this.matrixValue = matrix.map((row) => [...row]);
  }

  public get matrix(): BlockMatrix {
    return this.matrixValue.map((row) => [...row]);
  }

  public get rows(): number {
    return this.matrixValue.length;
  }

  public get columns(): number {
    return this.matrixValue[0].length;
  }

  public rotateRight(): void {
    this.matrixValue = this.matrixValue[0].map((_, column) =>
      this.matrixValue.map((row) => row[column]).reverse(),
    );
  }

  public rotateLeft(): void {
    const lastColumn = this.matrixValue[0].length - 1;

    this.matrixValue = this.matrixValue[0].map((_, column) =>
      this.matrixValue.map((row) => row[lastColumn - column]),
    );
  }
}
