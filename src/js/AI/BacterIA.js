import _consts_ from '../../json/constants.json';
const __THINKING_TIME_BET__ = 2500;  // Time in ms
const __THINKING_TIME_COINCHE__ = 1500;  // Time in ms
const __THINKING_TIME_PLAY__ = 1500;  // Time in ms
/**
 * Implementation of a basic AI
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
export default {
  /**
   * Given a game state, decides on an auction or pass
   * @param {Array} players List of all players including me and my cards
   * @return {Promise} promise of a bet object defining the action
   */
  bet (players) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const me = players[0];
        let price = null;
        let category = null;
        let type = _consts_.__BET_ACTION_PASS__;
        const prices = [80, 90, 100, 110];
        const possibles = [];
        for (let p = 0; p < prices.length; p++) {
          if (me.forbiddenPrices.indexOf(prices[p]) === -1) {
            possibles.push(prices[p]);
          }
        }
        if (Math.random() > 0.5 && possibles.length > 0) {
          price = possibles[Math.floor(Math.random() * possibles.length)];
          category = ['s', 'd', 'c', 'h'][Math.floor(Math.random() * 4)];
          type = _consts_.__BET_ACTION_BET__;
        }
        resolve({
          price,
          category,
          type
        });
      }, __THINKING_TIME_BET__);
    });
  },
  /**
   * Given a game state, decides to coinche or wait
   * @param {Array} players List of all players including me and my cards
   * @return {Promise} promise of a bet object defining the action
   */
  coinche (players) {
    return new Promise((resolve) => {
      if (players[0].canCoinche && Math.random() > 0.9) {
        setTimeout(resolve, __THINKING_TIME_COINCHE__, {
          type: _consts_.__BET_ACTION_COINCHE__
        });
      }
    });
  },
  /**
   * Given a game state, decides which card to play
   * @param {Array} players List of all players including me and my cards
   * @param {Array} turn Current turn
   * @param {Object} auction Current auction played
   * @return {Promise} Promise of a play object defining the action
   */
  play (players, turn, auction) {
    return new Promise((resolve) => {
      const me = players[0];
      const possibles = [];
      setTimeout(() => {
        for (let c = 0; c < me.hand.length; c++) {
          if (me.forbiddenCards.indexOf(me.hand[c]) === -1) {
            possibles.push(me.hand[c]);
          }
        }
        const cardIndex = Math.floor(Math.random() * possibles.length);
        resolve({
          card: possibles[cardIndex]
        });
      }, __THINKING_TIME_PLAY__);
    });
  }
};
