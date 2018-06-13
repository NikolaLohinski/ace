import _consts_ from './engine/constants.js';
import Engine from './engine/Engine.js';
import Player from './engine/Player.js';
import utils from './utils.js';
import AIHandler from './AI/AIHandler';

const __DELAY_UI__ = 2000;  // in ms

export default {
  state: {
    timeoutId: -1
  },
  localState: {
    path: null,
    game: {},
    players: [],
    config: {},
    engineTimeout: 0
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
    },
    engineTimeout (state, timeout) {
      state.engineTimeout = timeout;
    },
    timeoutId (state, id) {
      state.timeoutId = id;
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
    },
    engineTimeout (state) {
      return state.engineTimeout;
    },
    timeoutId (state) {
      return state.timeoutId;
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
    afk (state, isAfk) {
      return new Promise((resolve) => {
        state.getters.players[0].status =
          isAfk ? _consts_.__PLAYER_STATUS_INACTIVE__
          : _consts_.__PLAYER_STATUS_CONNECTED__;
        state.dispatch('notify', [state.getters.game, state.getters.players]).then(resolve);
      });
    },
    continueGame (state) {
      return new Promise(() => {
        state.dispatch('afk', false).then(() => {
          if (state.getters.players.findIndex((p) => p.status !== _consts_.__PLAYER_STATUS_CONNECTED__) === -1) {
            const [game, players] = Engine.clear(state.getters.game, state.getters.players);
            state.dispatch('notify', Engine.init(game, players)).then();
          }
        });
      });
    },
    initGame (state) {
      return new Promise(() => {
        let game = state.getters.game;
        let players = state.getters.players;
        players[0].status = _consts_.__PLAYER_STATUS_CONNECTED__;
        if (!game.initialized) {
          [game, players] = Engine.init(game, players);
        } else if ([_consts_.__GAME_STATE_INTER__, _consts_.__GAME_STATE_END__].indexOf(game.state) !== -1) {
          players[0].status = _consts_.__PLAYER_STATUS_INACTIVE__;
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
          console.error(`Action outdated from ${act.id}`);
        }
      });
    },
    play (state, play) {
      return new Promise(() => {
        state.dispatch(
          'notify',
          Engine.play(state.getters.game, state.getters.players, play)
        ).then(() => {
          if (state.getters.game.state === _consts_.__GAME_STATE_INTER__) {
            setTimeout(() => {
              state.dispatch(
                'notify',
                Engine.evaluate(state.getters.game, state.getters.players)
              ).then(() => {
                state.dispatch('afk', true).then();
              });
            }, __DELAY_UI__);
          }
        });
      });
    },
    bet (state, bet) {
      return new Promise(() => {
        state.dispatch(
          'notify',
          Engine.bet(state.getters.game, state.getters.players, bet)
        ).then(() => {
          if (state.getters.game.state === _consts_.__GAME_STATE_INTER__) {
            setTimeout(() => {
              state.dispatch(
                'notify',
                Engine.clear(state.getters.game, state.getters.players)
              ).then(() => {
                setTimeout(state.dispatch, __DELAY_UI__, 'initGame');
              });
            }, __DELAY_UI__);
          } else if (state.getters.game.state === _consts_.__GAME_STATE_WAIT__) {
            state.dispatch('wait', _consts_.__WAIT_TIMEOUT__).then(() => {
              state.dispatch(
                'notify',
                Engine.start(state.getters.game, state.getters.players)
              ).then();
            });
          }
        });
      });
    },
    wait (state, duration) {
      return new Promise((resolve) => {
        clearTimeout(state.getters.timeoutId);
        state.commit('engineTimeout', duration);
        state.commit('timeoutId', setTimeout(() => {
          const newDuration = duration - 1000;
          if (newDuration < 0) resolve();
          else state.dispatch('wait', newDuration).then(resolve);
        }, duration));
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

