const Store = {
  state: {
    socket: null,
    loading: true,
    error: [],
    view: null,
    http: null,
    session: null,
    settings: {
      langs: ['english', 'french'],
      lang: 'english',
      name: ''
    }
  },
  getters: {
    session (state) {
      return state.session;
    },
    socket (state) {
      return state.socket;
    },
    http (state) {
      return state.http;
    },
    view (state) {
      return state.view;
    },
    error (state) {
      return state.error;
    },
    loading (state) {
      return state.loading;
    },
    settings (state) {
      return state.settings;
    }
  },
  mutations: {
    setSession (state, session) {
      state.session = session;
      localStorage['session'] = (session) ? JSON.stringify(session) : '';
    },
    setSocket (state, socket) {
      state.socket = socket;
    },
    setHttp (state, http) {
      state.http = http;
    },
    setView (state, view) {
      state.view = view;
      localStorage['view'] = view;
    },
    setError (state, error) {
      state.error = error;
    },
    setLoading (state, value) {
      state.loading = value;
    },
    setSettings (state, args) {
      if (args['all']) {
        state.settings = args['settings'];
      } else {
        state.settings[args['setting']] = args['value'];
      }
      localStorage['settings'] = JSON.stringify(state.settings);
      this.i18n.set(state.settings.lang);
    }
  },
  actions: {
    loadSettings (state) {
      return new Promise((resolve) => {
        if (localStorage['settings']) {
          const settings = JSON.parse(localStorage['settings']);
          state.commit('setSettings', {
            settings: settings,
            all: true
          });
        }
        resolve();
      });
    },
    loadSession (state) {
      return new Promise((resolve) => {
        if (localStorage['session']) {
          state.dispatch('initSocket').then(() => {
            state.dispatch('registerListener', {
              H: 'GAME||ERROR',
              once: true,
              callback (H, B) {
                if (H === 'GAME') {
                  state.commit('setSession', B);
                  state.commit('setView', localStorage['view']);
                } else {
                  console.error(`[loadSession]: ${B}`);
                  state.commit('setSession', null);
                  state.commit('setView', 'home');
                }
                resolve();
              }
            }).then(() => {
              state.dispatch('send', {
                H: 'RESTART',
                B: JSON.parse(localStorage['session']).client
              });
            });
          });
        } else {
          state.commit('setView', localStorage['view'] || 'home');
          resolve();
        }
      });
    },
    quit (state) {
      return new Promise((resolve) => {
        state.dispatch('send', {
          H: 'QUIT',
          B: state.getters.session.client
        }).then(() => {
          state.commit('setSession', null);
          resolve();
        });
      });
    },
    send (state, message) {
      return new Promise((resolve, reject) => {
        try {
          if (state.getters.socket) {
            state.getters.socket.send(JSON.stringify(message));
          } else {
            console.error('[send]: no socket');
          }
          state.commit('setLoading', false);
          resolve();
        } catch (err) {
          console.error(`[socket]: ${err}`);
          state.commit('setLoading', false);
          state.commit('setError', 'serverUnreachable');
          (reject) ? reject() : resolve();
        }
      });
    },
    registerListener (state, args) {
      return new Promise((resolve) => {
        if (state.getters.socket) {
          const headers = args['H'].split('||');
          state.getters.socket.addEventListener('message', (message) => {
            const data = JSON.parse(message['data']);
            if (headers.includes(data['H'])) {
              args['callback'](data['H'], data['B']);
            }
          }, { once: args['once'] });
          resolve();
        } else {
          console.error('[registerListener]: no socket');
        }
      });
    },
    initSocket (state) {
      return new Promise((resolve) => {
        if (navigator.onLine) {
          if (!('WebSocket' in window)) {
            console.error('[initSocket]: socket not supported');
            state.commit('setError', 'noWebsocket');
            state.commit('setLoading', false);
          } else {
            try {
              state.dispatch('testConnection').then(() => {
                // Try to connect and send init command
                const socket = new WebSocket('ws://' + window.location.host + '/ws');
                socket.addEventListener('message', (msg) => {
                  const data = JSON.parse(msg['data']);
                  if (data['H'] === 'ERROR') {
                    state.commit('setError', data['B']);
                    for (let i = 0; i < data['B'].length; i++) {
                      console.error(data['B'][i]);
                    }
                    state.commit('setLoading', false);
                  }
                });
                socket.addEventListener('error', (err) => {
                  console.error(`[socket]: ${err}`);
                  state.commit('setLoading', false);
                  state.commit('setError', 'serverUnreachable');
                });
                socket.addEventListener('open', () => {
                  state.commit('setSocket', socket);
                  resolve();
                });
              });
            } catch (e) {
              console.error('[initSocket]: server unreachable');
              state.commit('setError', 'serverUnreachable');
              state.commit('setLoading', false);
            }
          }
        } else {
          console.error('[initSocket]: no connection');
          state.commit('setError', 'lostConnection');
          state.commit('setLoading', false);
        }
      });
    },
    testConnection (state) {
      return new Promise((resolve) => {
        state.getters.http.get('/reach', {
          timeout: 10000
        }).then(() => {
          resolve();
        }, () => {
          console.error('[testConnection]: server unreachable');
          state.commit('setLoading', false);
          state.commit('setError', 'serverUnreachable');
        });
      });
    },
    vibrate () {
      return new Promise((resolve) => {
        const root = document.getElementById('root-identifier');
        root.setAttribute('vibrate', 'true');
        setTimeout(() => {
          root.removeAttribute('vibrate');
        }, 1000);
        resolve();
      });
    }
  }
};

module.exports = () => Store;
