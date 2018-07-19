import BacterIA from './BacterIA.js';
// import LucIA from './LucIA.js';
import Constants from '../../json/constants.json';

/**
 * Implementation of the AI Handler
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 19th 2018
 */
export default {
  /**
   * React to current game state
   * @param {Game} game Current game state
   * @param {Player} me The bot
   * @param {String} token token to respond to the action
   * @return {Promise} Promise for reaction
   */
  react (game, me, token) {
    return new Promise((react) => {
      let AI;
      switch (me.level) {
        case 2:
          // AI = LucIA;
          break;
        default:
          AI = BacterIA;
      }
      if (game.getWhosTurn() === me.getId()) { // Active reaction
        if (game.getState() === Constants.__GAME_STATE_BETS__) {
          AI.bet(game, me).then((bet) => {
            react({
              action: 'bet',
              arg: bet,
              token,
              id: me.id
            });
          });
        } else if (game.getState() === Constants.__GAME_STATE_PLAY__) {
          AI.play(game, me).then((newMe) => {
            react({
              action: 'play',
              arg: newMe,
              token,
              id: me.id
            });
          });
        }
      } else { // Passive reaction
        if ([
          Constants.__GAME_STATE_BETS__,
          Constants.__GAME_STATE_WAIT__
        ].indexOf(game.getState()) !== -1) {
          if (game.getCanCoinche()[me.getId()]) {
            AI.coinche(game, me).then((coinche) => {
              if (coinche) {
                react({
                  action: 'bet',
                  arg: coinche,
                  token,
                  id: me.id
                });
              }
            });
          }
        }
      }
    });
  }
};
