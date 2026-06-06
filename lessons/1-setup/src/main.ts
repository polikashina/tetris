import { Game } from "./Game";

const startButton = document.querySelector<HTMLButtonElement>("#start-button");
if (!startButton) {
  throw new Error(`Start button not found`);
}

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) {
  throw new Error(`Canvas was not found`);
}

const game = new Game(canvas);

startButton.addEventListener("click", () => {
  game.startGame();
});

