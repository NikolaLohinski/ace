import Constants from '../json/constants.json';
import Engine from './engine/Engine';
import Player from './engine/Player';
import Game from './engine/Game';
import utils from './utils';
import Bot from './AI/Bot';

global.__timeoutStore = null;

export default {
  state: {
    loading: true
  },
  localState: {
    path: null,
    game: {},
    token: null,
    players: {},
    me: null,
    config: {},
    bots: {},
    startDelay: null
  },
  mutations: {
    loading (state, loading) {
      state.loading = loading;
    },
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
      state.token = utils.generateId();
      state.game = game;
    },
    players (state, players) {
      state.players = players;
    },
    bots (state, bots) {
      state.bots = bots;
    },
    me (state, id) {
      state.me = id;
    },
    startDelay (state, delay) {
      state.startDelay = delay;
    }
  },
  getters: {
    loading (state) {
      return state.loading;
    },
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
    sort (state) {
      const lastAuction = new Game(state.game).getLastAuction();
      const category = lastAuction ? lastAuction.category : null;
      return (cards) => state.config.sortCards ? Engine.niceSort(cards, category) : cards;
    },
    config (state) {
      return state.config;
    },
    game (state) {
      return new Game(state.game);
    },
    players (state) {
      return Object.assign({}, ...Object.keys(state.players).map((key) => ({
        [key]: new Player(state.players[key])
      })));
    },
    bots (state) {
      return Object.assign({}, ...Object.keys(state.bots).map((key) => ({
        [key]: new Bot(state.bots[key])
      })));
    },
    me (state) {
      return state.me;
    },
    token (state) {
      return state.token;
    },
    startDelay (state) {
      return state.startDelay;
    }
  },
  actions: {
    clearGame (state) {
      return new Promise((resolve) => {
        state.commit('game', {});
        state.commit('players', {});
        resolve();
      });
    },
    afk (state, isAfk) {
      return new Promise((resolve) => {
        const players = state.getters.players;
        if (isAfk) {
          players[state.getters.me].setStatus(Constants.__PLAYER_STATUS_INACTIVE__);
        } else {
          players[state.getters.me].setStatus(Constants.__PLAYER_STATUS_CONNECTED__);
        }
        state.dispatch('notify', {
          players: players
        }).then(resolve);
      });
    },
    continueGame (state) {
      return new Promise(() => {
        state.dispatch('afk', false).then(() => {
          if (Object.values(state.getters.players).findIndex((p) => {
            return p.status !== Constants.__PLAYER_STATUS_CONNECTED__;
          }) === -1) {
            const result = Engine.init(Engine.restart(state.getters.game).game, state.getters.players);
            const items = {
              game: result.game,
              players: {}
            };
            const deal = Engine.deal(items.game);
            result.forEach((ply) => {
              ply.hand = deal.hands[ply.getId()];
              items.players[ply.getId()] = ply;
            });
            state.dispatch('notify', items).then();
          }
        });
      });
    },
    initGame (state) {
      return new Promise(() => {
        const items = {
          game: state.getters.game
        };
        if (!items.game.isInitialized()) {
          const playersArray = [];
          items.players = state.getters.players;
          let k = 0;
          while (k < 4) {
            for (const player of Object.values(items.players)) {
              if (player.position === playersArray.length) {
                playersArray.push(player);
              }
            }
            k++;
          }
          const init = Engine.init(items.game, playersArray);
          const deal = Engine.deal(init.game);
          const players = {};
          init['players'].forEach((ply) => {
            ply.hand = deal.hands[ply.getId()];
            players[ply.getId()] = ply;
          });
          items.players = players;
          items.game = deal['game'];
        } else if ([
          Constants.__GAME_STATE_INTER__,
          Constants.__GAME_STATE_END__
        ].indexOf(items.game.getState()) !== -1) {
          items.players = state.getters.players;
          items.players[state.getters.me].setStatus(Constants.__PLAYER_STATUS_INACTIVE__);
        }
        state.dispatch('notify', items).then();
      });
    },
    act (state, act) {
      return new Promise(() => {
        if (act.token === state.getters.token) {
          const arg = act.arg;
          arg.id = act.id;
          state.dispatch(act.action, arg).then();
        } else {
          console.error(`Action outdated from ${act.id}`);
        }
      });
    },
    // New Functions -----------------------------------------------------------
    initialize (state) {
      return new Promise(() => {
        let players = null;
        let bots = null;
        let game = state.getters.game;
        if (!game.isInitialized()) {
          players = state.getters.players;
          bots = state.getters.bots;
          const array = Object.values(players);
          array.sort((p1, p2) => p1.getPosition() - p2.getPosition());
          const init = Engine.init(game, array);
          const deal = Engine.deal(game);
          init['players'].forEach((ply) => {
            players[ply.getId()].setHand(deal.hands[ply.getId()]);
            if (bots.hasOwnProperty(ply.getId())) {
              bots[ply.getId()].setHand(deal.hands[ply.getId()]);
            }
          });
          game = deal['game'];
        }
        state.dispatch('refresh', { game, players, bots }).then(() => {
          if (typeof state.getters.startDelay === 'number') {
            state.dispatch('start', state.getters.startDelay).then();
          }
        });
      });
    },
    bet (state, action) {
      return new Promise(() => {
        const token = state.getters.token;
        state.dispatch('validate', token).then(() => {
          const game = state.getters.game;
          state.dispatch('refresh', Engine.bet(game, action)).then();
        });
      });
    },
    play (state, action) {
      return new Promise(() => {
        const token = state.getters.token;
        state.dispatch('validate', token).then(() => {
          const game = state.getters.game;
          const players = state.getters.players;
          const player = players[action.id];
          player.play(action.card);
          const result = Engine.play(game, player);
          players[action.id] = player;
          result.players = players;
          if (state.getters.bots[action.id]) {
            result.bots = state.getters.bots;
            result.bots[action.id] = player;
          }
          state.dispatch('refresh', result).then();
        });
      });
    },
    validate (state, token) {
      return new Promise((resolve, reject) => {
        token === state.getters.token ? resolve() : reject();
      });
    },
    refresh (state, args) {
      return new Promise((resolve) => {
        if (args.game) state.commit('game', args.game);
        if (args.bots) state.commit('bots', args.bots);
        if (args.players) state.commit('players', args.players);
        state.dispatch('notify').then(resolve);
      });
    },
    notify (state) {
      return new Promise((resolve) => {
        const token = state.getters.token;
        const game = state.getters.game;
        for (const bot of Object.values(state.getters.bots)) {
          bot.react(game, token).then((reaction) => state.dispatch('AIct', reaction).then());
        }
        resolve();
      });
    },
    AIct (state, action) {
      return new Promise(() => {
        switch (action.name) {
          case 'BET':
            action.args.id = action.id;
            state.dispatch('bet', action.args);
            break;
          case 'PLAY':
            action.args.id = action.id;
            state.dispatch('play', action.args);
            break;
          default:
            break;
        }
      });
    },
    clear (state) {
      return new Promise((resolve) => {
        state.commit('game', {});
        state.commit('players', {});
        state.commit('bots', {});
        resolve();
      });
    },
    start (state, delay = Constants.__WAIT_TIMEOUT__) {
      if (typeof state.getters.startDelay !== 'number') {
        state.commit('startDelay', delay);
      }
      return new Promise(() => {
        clearTimeout(global.__timeoutStore);
        global.__timeoutStore = setTimeout(() => {
          state.commit('startDelay', delay);
          const left = delay - 1000;
          if (left < 0) {
            // start
            state.commit('startDelay', null);
            const game = state.getters.game;
            state.dispatch('refresh', Engine.start(game));
          } else {
            state.dispatch('start', left).then();
          }
        }, delay);
      });
    }
  }
};

