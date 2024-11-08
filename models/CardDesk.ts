export class CardDeck {
    private cards: number[];
  
    constructor() {
      this.cards = this.generateDeck();
    }
  
    private generateDeck(): number[] {
      const singleDeck = [...Array(52)].map((_, i) => (i % 13) + 1);
      return [...Array(6)].flatMap(() => singleDeck); 
    }
  
    public drawCard(): number | null {
      if (this.cards.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * this.cards.length);
      return this.cards.splice(randomIndex, 1)[0];
    }
  }
  