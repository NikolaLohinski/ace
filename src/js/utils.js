const Utils = {
  generateId () {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },
  getCardFamily (card) {
    return card[card.length - 1];
  },
  getCardValue (card) {
    return card.slice(0, card.length - 1);
  },
  randomIntUnder (sup) {
    return Math.floor(Math.random() * sup);
  },
  pickRandom (array) {
    return array.length ? array[Utils.randomIntUnder(array.length)] : null;
  }
};

export default Utils;
