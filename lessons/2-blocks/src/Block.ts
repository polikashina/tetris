import type { BlockMatrix } from "./types";

interface IBlock {
  matrix: BlockMatrix;
  rows: number;
  columns: number;
  rotateRight(): void;
}

export class Block implements IBlock {
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
    const newMatrix: number[][] = []

    //
    // [[0, 1, 2]   =>  [[3, 0]
    //  [3, 4, 5]]       [4, 1]
    //                   [5, 2]]
    //
    for (let j=0; j<this.columns; j++){
      newMatrix[j] = []
      for (let i=0; i<this.rows; i++) {
        newMatrix[j][this.rows-1-i] = this.matrixValue[i][j]
      }
    }
    this.matrixValue = newMatrix
  }
}
