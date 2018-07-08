import Constants from '../../json/constants.json';
/**
 * Implementation of the Player object for cards and bets logic as well as
 * information storage and management
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
export default class Player {
  /**
   * @constructor
   * @param {Object} object JSON object containing every info to generate
   * a new player object
   */
  constructor (object) {
    this.id = object.id || '';
    if (this.id === '') {
      throw Error('[Player.constructor] : constructor needs an identifier');
    }
    this.name = object.name || '';
    this.hand = object.hand || [];
    this.played = object.played || null;
    this.status = (typeof object.status) !== 'undefined' ? object.status : Constants.__PLAYER_STATUS_CONNECTED__;
  }
  /**
   * Get identifier of the Player
   * @return {string}
   */
  getId () {
    return this.id;
  }

  /**
   * Get cards in hand of the player
   * @return {Array} The cards in hand
   */
  getHand () {
    return this.hand;
  }

  /**
   * Get card played by player
   * @return {String} the card played
   */
  getPlayed () {
    if (!this.played) throw Error(`[Player.getPlayed] : No card played by player ${this.id}`);
    return this.played;
  }
  /**
   * Set a card as played
   * @param {String} card
   */
  play (card) {
    if (this.hand.indexOf(card) === -1) throw Error(`[Player.play] : Card ${card} not in hand`);
    this.played = this.hand.splice(this.hand.indexOf(card), 1)[0];
  }
  /**
   * Reverse a played card (if it was not possible to play it)
   * @param {String} card
   */
  reverse (card) {
    if (this.played !== card) throw Error(`[Player.reverse] : Trying to reverse ${card} card but was not played`);
    this.hand = this.hand.concat(this.played);
    this.played = null;
  }
}
