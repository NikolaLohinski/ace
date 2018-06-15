import Basic from './Basic.js';
import _consts_ from '../engine/constants.js';

/**
 * Implementation of the AI Handler
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 19th 2018
 */
export default {
  /**
   * React to current game state
   * @param {Object} game Current game state
   * @param {Array} players Current public state of all the players
   * @param {Player} me The AI
   * @return {Promise} Promise for reaction
   */
  react (game, players, me) {
    const token = game.token;
    return new Promise((react) => {
      const meIndex = players.findIndex((p) => p.id === me.id);
      const arrangedPlayers = [me];
      let arrangedTurn;
      if (game.turn) arrangedTurn = [game.turn[meIndex]];
      for (let k = 1; k < players.length; k++) {
        const arrangedIndex = (k + meIndex) % 4;
        arrangedPlayers.push(players[arrangedIndex]);
        if (game.turn) arrangedTurn.push(game.turn[arrangedIndex]);
      }
      let AI;
      switch (me.level) {
        default:
          AI = Basic;
      }
      if (players[meIndex].turn) { // Active reaction
        if (game.state === _consts_.__GAME_STATE_BETS__) {
          AI.bet(arrangedPlayers).then((arg) => {
            react({
              action: 'bet',
              arg: arg,
              token,
              id: me.id
            });
          });
        } else if (game.state === _consts_.__GAME_STATE_PLAY__) {
          AI.play(arrangedPlayers, arrangedTurn, game.auction).then((arg) => {
            react({
              action: 'play',
              arg: arg,
              token,
              id: me.id
            });
          });
        }
      } else { // Passive reaction
        if ([
          _consts_.__GAME_STATE_BETS__,
          _consts_.__GAME_STATE_WAIT__
        ].indexOf(game.state) !== -1) {
          AI.coinche(arrangedPlayers).then((coinche) => {
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
    });
  }
};
