import * as readline from 'readline';
import { CardDeck } from './CardDesk';
import { Player } from './Player';

export class Game {
  private deck: CardDeck;
  private players: Player[];
  private history: { round: number; drawnCard: number }[];
  private round: number;
  private currentCard: number | null;
  private rl: readline.Interface;

  constructor() {
    this.deck = new CardDeck();
    this.players = [];
    this.history = [];
    this.round = 0;
    this.currentCard = this.deck.drawCard();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public addPlayer(player: Player) {
    this.players.push(player);
  }

  public async start() {
    while (true) {
      this.round++;
      console.log(`Starting round ${this.round}`);

      await this.acceptBets();
      this.evaluateBets();

      if (this.currentCard !== null) {
        this.history.push({ round: this.round, drawnCard: this.currentCard });
      }

      await this.sleep(1000);
      this.currentCard = this.deck.drawCard();
      this.printPlayerHistory();
    }
  }

  private async acceptBets() {
    console.log("Accepting bets for 15 seconds...");
    const betPromises = this.players.map(player => this.promptPlayerBet(player));
    await Promise.all(betPromises);
  }

  private async promptPlayerBet(player: Player): Promise<void> {
    return new Promise((resolve) => {
      this.rl.question(`Player Balance: $${player.getBalance()}. Place your bet - type "higher", "lower", or "pass": `, (input) => {
        let guess: 'higher' | 'lower' | 'pass';
        if (input.toLowerCase() === 'higher' || input.toLowerCase() === 'lower') {
          guess = input.toLowerCase() as 'higher' | 'lower';
        } else {
          guess = 'pass';
        }

        const amount = guess === 'pass' ? 0 : 10;
        const bet = player.placeBet(amount, guess);
        if (bet) {
          player.addHistory(this.round, bet);
        }

        resolve();
      });
    });
  }

  private evaluateBets() {
    const nextCard = this.deck.drawCard();
    if (!nextCard) return;

    for (const player of this.players) {
      const lastBet = player.getBetHistory().find(bet => bet.round === this.round)?.bet;
      if (!lastBet) continue;

      if (lastBet.guess === 'pass') {
        lastBet.result = 'pass';
        console.log(`Player skipped the round.`);
        continue;
      }

      const result = (lastBet.guess === 'higher' && nextCard > this.currentCard!) ||
        (lastBet.guess === 'lower' && nextCard < this.currentCard!);

      lastBet.result = result ? 'win' : 'lose';
      const payout = result ? lastBet.amount * 1.7 : 0;

      if (result) player.updateBalance(payout);

      console.log(`Round ${this.round}: Current card was ${this.currentCard}, next card is ${nextCard}. Player ${result ? 'won' : 'lost'}.`);
    }

    this.currentCard = nextCard;
  }

  private printPlayerHistory() {
    console.log("=== Player Bet History ===");
    this.players.forEach((player, index) => {
      console.log(`Player ${index + 1} history:`);
      const history = player.getBetHistory();
      history.forEach((record, i) => {
        console.log(`  Round ${record.round}: Bet ${record.bet.amount} on "${record.bet.guess}" - Result: ${record.bet.result}`);
      });
    });
    console.log("===========================");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
