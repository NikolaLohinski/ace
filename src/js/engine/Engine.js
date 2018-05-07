import _consts_ from './constants.js';
/**
 * Implementation of the Engine object that will run the game
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
export default {
  /**
   * Deal cards from deck among the players starting by the player following the
   * dealer. If no deck is provided, then a default is taken and shuffled
   * @param {Array} players self explanatory
   * @param {Array} deck deck of cards, from previous game for example
   */
  deal (players, deck) {
    if (!deck) {
      deck = _consts_.__DECK__;
      // shuffle
      let count = deck.length;
      let randomNumber;
      let temp;
      while (count) {
        randomNumber = Math.random() * count-- | 0;
        temp = deck[count];
        deck[count] = deck[randomNumber];
        deck[randomNumber] = temp;
      }
    }
    if (deck.length !== 32) {
      throw new Error('The deck does not look right');
    }
    const cutIndex = Math.floor(3 + Math.random() * 26);
    const dealOrder = _consts_.__DEAL_ORDERS__[Math.floor(Math.random() * _consts_.__DEAL_ORDERS__.length)];
    const dealerIndex = players.findIndex((p) => p.dealer);
    deck = deck.slice(cutIndex).concat(deck.slice(0, cutIndex));
    for (let k = 0; k < dealOrder.length; k++) {
      const count = dealOrder[k];
      for (let p = 0; p < players.length; p++) {
        const cards = deck.splice(0, count);
        const player = players[(p + dealerIndex + 1) % 4];
        player.hand = player.hand.concat(cards);
      }
    }
  },
  /**
   * Return new array with cards sorted
   * @param {Array} cards list of cards to sort
   * @param {String} NaAa No assets or all assets option
   * @param {String} asset The asset family if any
   * @return {Array} sorted cards
   */
  sort (cards, NaAa, asset) {
    const hand = [];
    const families = { c: [], s: [], d: [], h: [] };
    // Group by family
    for (let c = 0; c < cards.length; c++) {
      const card = cards[c];
      families[card[card.length - 1]].push(card);
    }
    let order = _consts_.__ORDERS__['REGUL'];
    if (NaAa === 'AA') {
      order = _consts_.__ORDERS__['ASSET'];
    }
    const familyOrder = (['c', 's'].indexOf(asset) !== -1) ? ['s', 'h', 'c', 'd'] : ['h', 's', 'd', 'c'];
    for (let f = 0; f < 4; f++) {
      const family = familyOrder[f];
      if (family === asset) {
        order = _consts_.__ORDERS__['ASSET'];
      }
      families[family].sort((x, y) => {
        return order.indexOf(x.slice(0, x.length - 1)) - order.indexOf(y.slice(0, y.length - 1));
      });
      for (let c = 0; c < families[family].length; c++) {
        const card = families[family][c];
        hand.push(card);
      }
      if (family === asset) {
        order = _consts_.__ORDERS__['REGUL'];
      }
    }
    return hand;
  }
};
