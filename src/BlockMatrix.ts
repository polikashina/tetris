import { BlockMatrix } from "./types";

const blockI: BlockMatrix = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 0, 0],
];

const blockZ: BlockMatrix = [
  [1, 1, 0],
  [0, 1, 1],
];

const blockJ: BlockMatrix = [
  [1, 0, 0],
  [1, 1, 1],
];

const blockL: BlockMatrix = [
  [0, 0, 1],
  [1, 1, 1],
];

const blockO: BlockMatrix = [
  [1, 1],
  [1, 1],
];

const blockS: BlockMatrix = [
  [0, 1, 1],
  [1, 1, 0],
];

const blockT: BlockMatrix = [
  [1, 1, 1],
  [0, 1, 0],
];

export const availableBlockMatrix: BlockMatrix[] = [
  blockI,
  blockZ,
  blockJ,
  blockL,
  blockO,
  blockS,
  blockT,
];
