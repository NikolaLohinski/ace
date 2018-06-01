import _consts_ from './engine/constants.js';
import Engine from './engine/Engine.js';
import Player from './engine/Player.js';
import utils from './utils.js';
import AIHandler from './AI/AIHandler';

export default {
  localState: {
    path: null,
    game: {},
    players: [],
    config: {}
  },
  mutations: {
    path (state, path) {
      state.path = path;
    },
    language (state, language) {
      state.i18n.locale = language;
      localStorage['i18n'] = language;
    },
    setConfig (state, data) {
      state.config[data['key']] = data['value'];
    },
    game (state, game) {
      game.token = utils.generateId();
      state.game = JSON.parse(JSON.stringify(game));
    },
    players (state, players) {
      state.players = players;
    }
  },
  getters: {
    path (state) {
      return state.path;
    },
    language (state) {
      return state.i18n.locale;
    },
    languages (state) {
      const languages = [];
      for (const language in state.i18n.translations) {
        if (!state.i18n.translations.hasOwnProperty(language)) continue;
        languages.push(language);
      }
      return languages;
    },
    sortCards () {
      return Engine.sort;
    },
    findLeader (state) {
      return Engine.leader(state.game, state.players);
    },
    config (state) {
      return state.config;
    },
    game (state) {
      return state.game;
    },
    players (state) {
      const players = [];
      for (let k = 0; k < state.players.length; k++) {
        players.push(new Player(state.players[k]));
      }
      return players;
    },
    publicPlayers (state) {
      const players = [];
      for (let k = 0; k < state.players.length; k++) {
        players.push(new Player(state.players[k]).getPublicImage());
      }
      return players;
    }
  },
  actions: {
    clearGame (state) {
      return new Promise((resolve) => {
        state.commit('game', {});
        state.commit('players', []);
        resolve();
      });
    },
    initGame (state) {
      return new Promise(() => {
        let game = state.getters.game;
        let players = state.getters.players;
        if (!game.initialized) {
          [game, players] = Engine.deal(game, players);
        }
        state.dispatch('notify', [game, players]).then();
      });
    },
    act (state, act) {
      return new Promise(() => {
        if (act.token === state.getters.game.token) {
          const arg = act.arg;
          arg.id = act.id;
          state.dispatch(act.action, arg).then();
        } else {
          throw Error('Action outdated');
        }
      });
    },
    play (state, play) {
      return new Promise(() => {
        state.dispatch(
          'notify',
          Engine.play(state.getters.game, state.getters.players, play)
        ).then();
      });
    },
    bet (state, bet) {
      return new Promise(() => {
        state.dispatch(
          'notify',
          Engine.bet(state.getters.game, state.getters.players, bet)
        ).then(() => {
          if (state.getters.game.state === _consts_.__GAME_STATE_INTER__) {
            state.dispatch(
                'notify',
                Engine.clear(state.getters.game, state.getters.players
              )).then(() => {
                setTimeout(state.dispatch, 2000, 'initGame');
              });
          }
        });
      });
    },
    notify (state, [game, players]) {
      return new Promise((resolve) => {
        state.commit('game', game);
        state.commit('players', players);
        for (let k = 0; k < state.getters.players.length; k++) {
          const player = state.getters.players[k];
          if (player.type === 'BOT') {
            AIHandler.react(
              state.getters.game,
              state.getters.publicPlayers,
              player
            ).then((reaction) => {
              state.dispatch('act', reaction).then();
            });
          }
        }
        resolve();
      });
    }
  }
};

