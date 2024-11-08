interface Bet {
  amount: number;
  guess: 'higher' | 'lower' | 'pass';
  result?: 'win' | 'lose' | 'pass';
}

export class Player {
  private balance: number;
  private history: { round: number; bet: Bet }[];

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    this.history = [];
  }

  public placeBet(amount: number, guess: 'higher' | 'lower' | 'pass'): Bet | null {
    if (guess !== 'pass' && amount > this.balance) {
      console.log("Insufficient balance.");
      return null;
    }

    if (guess !== 'pass') {
      this.balance -= amount;
    }
    const bet: Bet = { amount, guess };
    return bet;
  }

  public updateBalance(amount: number) {
    this.balance += amount;
  }

  public addHistory(round: number, bet: Bet) {
    this.history.push({ round, bet });
  }

  public getBetHistory(): { round: number; bet: Bet }[] {
    return this.history;
  }

  public getBalance(): number {
    return this.balance;
  }
}
