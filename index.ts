import { Game } from './models/Game';
import { Player } from './models/Player';

const game = new Game();
const player1 = new Player(100);
game.addPlayer(player1);

game.start().then(() => {
  console.log("Game has started.");
});
