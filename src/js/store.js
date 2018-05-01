import createPersistedState from 'vuex-persistedstate';

export default {
  state: {
    current: null
  },
  mutations: {
    current (state, current) {
      state.current = current;
    },
    language (state, language) {
      state.i18n.locale = language;
      localStorage['i18n'] = language;
    }
  },
  getters: {
    current (state) {
      return state.current;
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
    }
  },
  plugins: [createPersistedState({
    paths: [
      'current'
    ]
  })]
};

