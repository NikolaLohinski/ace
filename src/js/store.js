export default {
  localState: {
    path: null,
    game: {},
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
    game (state, game) {
      state.game = game;
    },
    setPlayers (state, players) {
      state.game.players = players;
      this.commit('updateGame');
    },
    updateGame (state) {
      state.game = JSON.parse(JSON.stringify(state.game));
    },
    setConfig (state, data) {
      state.config[data['key']] = data['value'];
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
    game (state) {
      return state.game;
    },
    config (state) {
      return state.config;
    }
  },
  actions: {
    clearGame (state) {
      return new Promise((resolve) => {
        state.commit('game', {});
        resolve();
      });
    }
  }
};

