import Player from '../engine/Player';
import Penny from './bots/Penny';
import Lucy from './bots/Lucy';

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
        this._AI = Penny;
        break;
      case 2:
        this._AI = Lucy;
        break;
      default:
        this._AI = Penny;
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
      if (game.getCanCoinche()[id]) {
        this.getAI().coinche(game, this).then(
          (args) => resolve({ args, token, id, name: 'COINCHE' }),
          () => {
            this.activeReaction(game, token).then(resolve);
          }
        );
      } else {
        this.activeReaction(game, token).then(resolve);
      }
    });
  }
  /**
   * React actively to a current game state
   * @param {Game} game current Game state
   * @param {String} token current Game token for reaction
   * @return {Promise} Promise for reaction
   */
  activeReaction (game, token) {
    return new Promise((resolve) => {
      const id = this.getId();
      if (game.getWhosTurn() === id) {
        if (game.isBets()) {
          this.getAI().bet(game, this).then((args) => resolve({ args, token, id, name: 'BET' }));
        } else if (game.isPlay()) {
          this.getAI().play(game, this).then((args) => resolve({ args, token, id, name: 'PLAY' }));
        }
      }
    });
  }
}
