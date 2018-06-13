import _const_ from './constants.js';
/**
 * Implementation of the Player object for cards and bets logic as well as
 * information storage and management
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
export default class Player {
  /**
   * @constructor
   * @param {Object} playerObj JSON object containing every info to generate
   * a new player object
   */
  constructor (playerObj) {
    for (const property in playerObj) {
      if (playerObj.hasOwnProperty(property)) {
        this[property] = playerObj[property];
      }
    }
    this.dealer = this.dealer || false;
    this.turn = this.turn || false;
    this.canCoinche = this.canCoinche || false;
    this.auctions = this.auctions || [];
    this.forbiddenPrices = this.forbiddenPrices || [];
    this.forbiddenCards = this.forbiddenCards || [];
    this.hand = this.hand || [];
    this.folds = this.folds || [];
    this.status = (typeof this.status) !== 'undefined' ? this.status : _const_.__PLAYER_STATUS_CONNECTED__;
    if (!this.name ||
      ['USR', 'BOT'].indexOf(this.type) === -1 ||
      (this.type === 'BOT' && !this.level)) {
      throw Error('Errors in defintion of player');
    }
  }

  /**
   * Get a public image of a player, that can be share with other ones
   * @return {object} Current public image of the player
   */
  getPublicImage () {
    return {
      type: this.type,
      name: this.name,
      id: this.id,
      dealer: this.dealer,
      turn: this.turn,
      auctions: this.auctions,
      status: this.status
    };
  }
}
