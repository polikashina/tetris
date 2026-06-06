export type BlockMatrix = number[][];

export type Position = {
  column: number;
  row: number;
};

export type StateSnapshot = {
  readonly locked: BlockMatrix;
  readonly currentBlock: BlockMatrix | null;
  readonly currentPosition: Position | null;
};
