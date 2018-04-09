export default {
  state: {
    socket: null,
    loading: false,
    notification: {},
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
    notification (state) {
      return state.notification;
    },
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
    loading (state) {
      return state.loading;
    },
    settings (state) {
      return state.settings;
    }
  },
  mutations: {
    setNotification (state, notification) {
      state.notification = notification;
    },
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
            const listener = (socketStream) => {
              state.dispatch('readSocket', {
                headers: 'GAME',
                socketStream: socketStream
              }).then((data) => {
                state.commit('setSession', data.B);
                state.commit('setView', localStorage['view']);
              }, () => {
                console.error('[loadSession]: Failed to load last session');
                state.commit('setSession', null);
                state.commit('setView', 'home');
              });
              state.dispatch('removeListener', listener).then(() => {
                resolve();
              });
            };
            state.dispatch('registerListener', listener).then(() => {
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
          state.commit('setNotification', {
            body: this.i18n.translate('errors.serverUnreachable')
          });
          (reject) ? reject() : resolve();
        }
      });
    },
    registerListener (state, callback) {
      return new Promise((resolve) => {
        if (state.getters.socket) {
          state.getters.socket.addEventListener(
            'message', callback
          );
        } else {
          console.error('[registerListener]: no socket');
        }
        resolve();
      });
    },
    readSocket (state, args) {
      return new Promise((resolve, reject) => {
        try {
          const headers = args['headers'].split('||');
          const socketStream = args['socketStream'];
          const data = JSON.parse(socketStream['data']);
          if (headers.indexOf(data['H']) !== -1) {
            resolve(data);
          } else {
            reject();
          }
        } catch (e) {
          reject();
        }
      });
    },
    removeListener (state, callback) {
      return new Promise((resolve) => {
        if (state.getters.socket) {
          state.getters.socket.removeEventListener('message', callback);
        } else {
          console.error('[removeListener]: no socket');
        }
        resolve();
      });
    },
    initSocket (state) {
      return new Promise((resolve) => {
        if (navigator.onLine) {
          if (!('WebSocket' in window)) {
            console.error('[initSocket]: socket not supported');
            state.commit('setNotification', {
              body: this.i18n.translate('errors.noWebsocket')
            });
            state.commit('setLoading', false);
          } else {
            try {
              state.dispatch('testConnection').then(() => {
                // Try to connect and send init command
                const socket = new WebSocket('ws://' + window.location.host + '/ws');
                socket.addEventListener('message', (msg) => {
                  const data = JSON.parse(msg['data']);
                  if (data['H'] === 'ERROR') {
                    state.commit('setNotification', {
                      body: this.i18n.translate(`errors.${data['B']}`)
                    });
                    console.error(data['B']);
                    state.commit('setLoading', false);
                  } else if (data['H'] === 'NOTIF') {
                    state.commit('setNotification', {
                      body: this.i18n.translate(`notifications.${data['B']}`)
                    });
                  }
                });
                socket.addEventListener('error', (err) => {
                  console.error(`[socket]: ${err}`);
                  state.commit('setLoading', false);
                  state.commit('setNotification', {
                    body: this.i18n.translate('errors.serverUnreachable')
                  });
                });
                socket.addEventListener('open', () => {
                  state.commit('setSocket', socket);
                  resolve();
                });
              });
            } catch (e) {
              console.error('[initSocket]: server unreachable');
              state.commit('setNotification', {
                body: this.i18n.translate('errors.serverUnreachable')
              });
              state.commit('setLoading', false);
            }
          }
        } else {
          console.error('[initSocket]: no connection');
          state.commit('setNotification', {
            body: this.i18n.translate('errors.lostConnection')
          });
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
          state.commit('setView', 'home');
          state.commit('setLoading', false);
          state.commit('setNotification', {
            body: this.i18n.translate('errors.serverUnreachable')
          });
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

