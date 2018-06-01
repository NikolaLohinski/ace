import _consts_ from '../engine/constants.js';

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
      setTimeout(resolve, 1000, {
        price: null,
        category: null,
        type: _consts_.__BET_ACTION_PASS__
      });
    });
  },
  /**
   * Given a game state, decides to coinche or wait
   * @param {Array} players List of all players including me and my cards
   * @return {Promise} promise of a bet object defining the action
   */
  coinche (players) {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000, null);
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
      setTimeout(() => {
        let cardIndex = Math.floor(Math.random() * me.hand.length);
        while (me.forbiddenCards.indexOf(me.hand[cardIndex]) !== -1) {
          cardIndex = Math.floor(Math.random() * me.hand.length);
        }
        resolve({
          card: me.hand[cardIndex]
        });
      }, 4000);
    });
  }
};
