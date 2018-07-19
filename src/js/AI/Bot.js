import Player from '../engine/Player';
import BacterIA from './BacterIA';
// import LucIA from './LucIA';

/**
 * Implementation of the Bot object for cards and bets logic as well as
 * information storage and management, that extends a Player
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: July 13th 2018
 */
export default class Bot extends Player {
  /**
   * @constructor
   * @param {Object} object JSON object containing every info to generate
   * a new bot object
   */
  constructor (object) {
    super(object);
    this._level = object.level || object._level || 1;
    switch (this._level) {
      case 1:
        this._AI = BacterIA;
        break;
      // case 2:
      //   this._AI = LucIA;
      //   break;
      default:
        this._AI = BacterIA;
    }
  }
  /**
   * Tell whether the player is a bot or not
   * @override
   * @return {boolean} Always true to override from default class
   */
  isBot () {
    return true;
  }
  /**
   * Get the AI
   * @return {BacterIA} the AI
   */
  getAI () {
    return this._AI;
  }
  /**
   * React to a current game state
   * @param {Game} game current Game state
   * @param {String} token current Game token for reaction
   * @return {Promise} Promise for reaction
   */
  react (game, token) {
    return new Promise((resolve) => {
      const id = this.getId();
      let method = null;
      let name = null;
      if (game.getWhosTurn() === id) { // Active reaction
        if (game.isBets()) {
          method = this.getAI().bet;
          name = 'BET';
        } else if (game.isPlay()) {
          method = this.getAI().play;
          name = 'PLAY';
        }
      } else { // Passive reaction
        if (game.getCanCoinche()[id]) {
          method = this.getAI().coinche;
          name = 'COINCHE';
        }
      }
      if (method && name) {
        method(game, this).then((args) => resolve({ args, token, id, name }));
      }
    });
  }
}
