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
    this._id = object.id || object._id || null;
    this._name = object.name || object._name || '';
    this._hand = object.hand || object._hand || [];
    this._position = (typeof object.position) !== 'undefined' ? object.position
       : (typeof object._position) !== 'undefined' ? object._position : null;
    this._played = object.played || object._played || null;
    this._status = (typeof object.status) !== 'undefined' ? object.status
      : (typeof object._status) !== 'undefined' ? object._status : Constants.__PLAYER_STATUS_CONNECTED__;
  }
  /**
   * Get identifier of the Player
   * @return {string}
   */
  getId () {
    return this._id;
  }
  /**
   * Get cards in hand of the player
   * @return {Array} The cards in hand
   */
  getHand () {
    return this._hand;
  }
  /**
   * Set the hand of the player
   * @param {Array<String>} hand New hand
   */
  setHand (hand) {
    this._hand = hand;
  }
  /**
   * Get card played by player
   * @return {String} the card played
   */
  getPlayed () {
    return this._played;
  }
  /**
   * Set a card as played
   * @param {String} card
   */
  play (card) {
    if (this._hand.indexOf(card) === -1) throw Error(`[Player.play] : Card ${card} not in hand`);
    this._played = this._hand.splice(this._hand.indexOf(card), 1)[0];
  }
  /**
   * Reverse a played card (if it was not possible to play it)
   * @param {String} card
   */
  reverse (card) {
    if (this._played !== card) throw Error(`[Player.reverse] : Trying to reverse ${card} card but was not played`);
    this._hand = this._hand.concat(this._played);
    this._played = null;
  }
  /**
   * Set status of player
   * @param {Number} status New status of the player
   */
  setStatus (status) {
    this._status = status;
  }
  /**
   * Return the position of the player between 0 and 3
   * @return {null|Number} the position of the player
   */
  getPosition () {
    return this._position;
  }
  /**
   * Tell whether the player is connected or not
   * @return {boolean} True if player is available
   */
  isAvailable () {
    return this._status === Constants.__PLAYER_STATUS_CONNECTED__;
  }
  /**
   * Get the name of the player
   * @return {String} the name of the player
   */
  getName () {
    return this._name;
  }
  /**
   * Tell whether the player is a bot or not
   * @return {boolean} Always false but this method can be overriden by Bot class
   */
  isBot () {
    return false;
  }
}
