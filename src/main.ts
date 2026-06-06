import { availableBlockMatrix } from "./BlockMatrix";
import { Game } from "./Game";

const startButton = document.querySelector<HTMLButtonElement>("#start-button");
if (!startButton) {
  throw new Error(`Start button not found`);
}

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) {
  throw new Error(`Canvas was not found`);
}

const game = new Game(canvas, availableBlockMatrix);

startButton.addEventListener("click", () => {
  game.startGame();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    game.moveBlockLeft();
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    game.moveBlockRight();
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    game.moveBlockDown();
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    game.rotateBlock();
  }
});
