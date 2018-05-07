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
    if (['BOT', 'USR'].indexOf(playerObj.type) === -1) {
      throw new Error('Player type must be either IA or HUMAN');
    }
    /**
     * Type of player, either USR or BOT
     * @type {String}
     */
    this.type = playerObj.type;
    if (this.type === 'BOT') {
      /**
       * Level of the bot if any
       * @type {string}
       */
      this.level = playerObj.level;
    }
    /**
     * Integer identifier ot the player
     * @type {Number}
     */
    this.id = playerObj.id;
    /**
     * Name of the player
     * @type {String}
     */
    this.name = playerObj.name;
    /**
     * Whether this player is the dealer or not
     * @type {boolean}
     */
    this.dealer = false;
    /**
     * Bets of the player
     * @type {Array}
     */
    this.auctions = [];
    /**
     * Hand will hold the cards in hand of the player
     * @type {Array}
     */
    this.hand = [];
    /**
     * Status of the player, 1 for active, 0 for AFK, -1 for disconnected
     * @type {number}
     */
    this.status = _const_.__PLAYER_STATUS_CONNECTED__;
  };
}
