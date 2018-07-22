import Constants from '../json/constants.json';
import Engine from './engine/Engine';
import Player from './engine/Player';
import Game from './engine/Game';
import utils from './utils';
import Bot from './AI/Bot';

const WAITFREQ = 1000;
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
    startDelay (state, startDelay) {
      state.startDelay = startDelay;
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
    whatForbiddenCards (state) {
      const game = new Game(state.game);
      if (!game.isPlay()) return () => [];
      return (who) => Engine.forbiddenCards(game, new Player(state.players[who]));
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
    },
    position (state) {
      return (position) => {
        if (!state.config.goClockwise || ![1, 3].includes(position)) {
          return position;
        } else {
          return position === 1 ? 3 : 1;
        }
      };
    }
  },
  actions: {
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
        state.dispatch('refresh', { game, players, bots }).then();
      });
    },
    bet (state, action) {
      return new Promise(() => {
        const token = action.token;
        state.dispatch('validate', token).then(() => {
          const game = state.getters.game;
          state.dispatch('refresh', Engine.bet(game, action.args)).then();
        });
      });
    },
    play (state, action) {
      return new Promise(() => {
        state.dispatch('validate', action.token).then(() => {
          const game = state.getters.game;
          const players = state.getters.players;
          const id = action.args.id;
          const player = players[id];
          player.play(action.args.card);
          const result = Engine.play(game, player);
          players[id] = player;
          result.players = players;
          if (state.getters.bots[id]) {
            result.bots = state.getters.bots;
            result.bots[id] = player;
          }
          state.dispatch('refresh', result).then();
        });
      });
    },
    restart (state) {
      return new Promise(() => {
        const restarted = Engine.restart(state.getters.game);
        state.dispatch('refresh', restarted).then(() => {
          state.dispatch('initialize');
        });
      });
    },
    validate (state, token) {
      return new Promise((resolve) => {
        token === state.getters.token ? resolve() : console.log(`[$store.validate] : Token ${token} is outdated`);
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
        state.dispatch('propagate').then(resolve);
      });
    },
    propagate (state) {
      return new Promise((resolve) => {
        if (state.getters.game.isWait()) {
          let delay = Constants.TIMEOUTWAIT;
          if (typeof state.getters.startDelay === 'number') {
            delay = state.getters.startDelay;
          }
          state.dispatch('start', delay);
        }
        resolve();
      });
    },
    AIct (state, action) {
      return new Promise(() => {
        switch (action.name) {
          case 'BET':
            state.dispatch('bet', action);
            break;
          case 'COINCHE':
            state.dispatch('bet', action);
            break;
          case 'PLAY':
            state.dispatch('play', action);
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
        clearTimeout(global.__timeoutStore);
        localStorage.removeItem('cards');
        resolve();
      });
    },
    wait (state, isDoneAfter) {
      return new Promise((resolve) => {
        clearTimeout(global.__timeoutStore);
        global.__timeoutStore = setTimeout(() => {
          if (isDoneAfter(WAITFREQ)) {
            resolve();
          } else {
            state.dispatch('wait', isDoneAfter).then(resolve);
          }
        }, WAITFREQ);
      });
    },
    start (state, delay) {
      state.commit('startDelay', delay);
      return new Promise(() => {
        state.dispatch('wait', (elapsed) => {
          const left = state.getters.startDelay;
          if (left < elapsed) {
            state.commit('startDelay', null);
            return true;
          } else {
            state.commit('startDelay', left - elapsed);
            return false;
          }
        }).then(() => state.dispatch('refresh', Engine.start(state.getters.game)).then());
      });
    }
  }
};

