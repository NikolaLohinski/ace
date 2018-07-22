import Engine from '../../engine/Engine';
import Constants from '../../../json/constants.json';
const __TIMEOUTBET = 2500;  // Time in ms
const __TIMEOUTCOINCHE = 1500;  // Time in ms
const __TIMEOUTPLAY = 1500;  // Time in ms
/**
 * Implementation of a basic AI
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
export default {
  /**
   * Given a game state, decides on an auction or pass
   * @param {Game} game the game state
   * @param {Player} me Reference of me
   * @return {Promise} promise of a bet object defining the action
   */
  bet (game, me) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let price = null;
        let category = null;
        let type = Constants.PASS;
        const prices = [80, 90, 100, 110];
        const possibles = [];
        for (const p of prices) {
          if (game.getForbiddenPrices().indexOf(p) === -1) {
            possibles.push(p);
          }
        }
        if (Math.random() > 0.5 && possibles.length > 0) {
          price = possibles[Math.floor(Math.random() * possibles.length)];
          category = ['s', 'd', 'c', 'h'][Math.floor(Math.random() * 4)];
          type = Constants.BET;
        }
        resolve({
          price,
          category,
          type,
          id: me.getId()
        });
      }, __TIMEOUTBET);
    });
  },
  /**
   * Given a game state, decides to coinche or wait
   * @param {Game} game object
   * @param {Player} me Reference of me
   * @return {Promise} promise of a bet object defining the action
   */
  coinche (game, me) {
    return new Promise((resolve, reject) => {
      if (Math.random() > 0.75) {
        setTimeout(resolve, __TIMEOUTCOINCHE, {
          type: Constants.COINCHE,
          id: me.getId()
        });
      } else {
        reject();
      }
    });
  },
  /**
   * Given a game state, decides which card to play
   * @param {Game} game Game state
   * @param {Player} me The bot
   * @return {Promise} Promise of a play object defining the action
   */
  play (game, me) {
    return new Promise((resolve) => {
      const forbidden = Engine.forbiddenCards(game, me);
      setTimeout(() => {
        const possibles = me.getHand().filter((p) => forbidden.indexOf(p) === -1);
        const cardIndex = Math.floor(Math.random() * possibles.length);
        resolve({
          card: possibles[cardIndex],
          id: me.getId()
        });
      }, __TIMEOUTPLAY);
    });
  }
};
