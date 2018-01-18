const Store = {
  state: {
    loading: true,
    socket: null,
    player: {},
    error: [],
    langs: [],
    lang: 'english',
    currentView: null,
    http: null,
    room: {},
    game: {}
  },
  getters: {
    game (state) {
      return state.game;
    },
    room (state) {
      return state.room;
    },
    http (state) {
      return state.http;
    },
    currentView (state) {
      return state.currentView;
    },
    error (state) {
      return state.error;
    },
    player (state) {
      return state.player;
    },
    loading (state) {
      return state.loading;
    },
    socket (state) {
      if (state.socket) {
        return state.socket;
      }
    },
    langs (state) {
      return state.langs;
    },
    lang (state) {
      return state.lang;
    }
  },
  mutations: {
    setRoom (state, room) {
      const i = room['players'].findIndex((e) => state.player['id'] === e['id']);
      if (i !== -1) state.player = room['players'][i];
      state.room = room;
    },
    setGame (state, game) {
      const i = game['players'].findIndex((e) => state.player['id'] === e['id']);
      if (i !== -1) state.player = game['players'][i];
      state.game = game;
    },
    setHttp (state, http) {
      state.http = http;
    },
    setCurrentView (state, view) {
      state.currentView = view;
    },
    setError (state, error) {
      state.error = error;
    },
    setSocket (state, socket) {
      state.socket = socket;
    },
    setPlayer (state, player) {
      state.player = player;
    },
    setLoading (state, value) {
      state.loading = value;
    },
    setLangs (state, langs) {
      state.langs = langs;
    },
    setLang (state, lang) {
      this.i18n.set(lang);
      state.lang = lang;
    }
  },
  actions: {
    send (state, message) {
      return new Promise((resolve, reject) => {
        if (state.getters.socket) {
          state.getters.socket.send(JSON.stringify(message));
          resolve();
        } else {
          console.error('[ACTION: send]: no socket');
          state.commit('setLoading', false);
          reject('[ACTION: send]: no socket');
        }
      });
    },
    quit (state) {
      return new Promise(() => {
        if (state.getters.socket) {
          localStorage['session'] = '';
          state.dispatch('send', {
            head: 'QUIT'
          }).then(null, null);
        }
      });
    },
    stop (state) {
      return new Promise(() => {
        if (state.getters.socket) {
          try {
            state.getters.socket.close();
          } catch (e) {
            console.error(e);
          }
          state.commit('setSocket', undefined);
        }
      });
    },
    registerListener (state, args) {
      return new Promise((resolve, reject) => {
        if (state.getters.socket) {
          state.getters.socket.addEventListener('message', (message) => {
            args['callback'](JSON.parse(message['data']));
          }, { once: args['once'] });
          resolve();
        } else {
          state.commit('setLoading', false);
          console.error('[ACTION: registerListener]: no socket');
          reject('[ACTION: registerListener]: no socket');
        }
      });
    },
    initPlayer (state, name) {
      return new Promise((resolve) => {
        state.dispatch('init').then((socket) => {
          socket.addEventListener('message', (msg) => {
            const data = JSON.parse(msg['data']);
            if (data['head'] === 'PLY') {
              state.commit('setPlayer', data['body']);
              state.commit('setSocket', socket);
              resolve();
            }
          }, { once: true });
          socket.send(JSON.stringify({
            head: 'INIT',
            body: {
              name: name
            }
          }));
        });
      });
    },
    init (state) {
      return new Promise((resolve, reject) => {
        if (navigator.onLine) {
          if (!('WebSocket' in window)) {
            console.error('[ACTION: init]: socket not supported');
            state.commit('setError', 'noWebsocket');
            state.commit('setLoading', false);
            reject('[ACTION: init]: socket not supported');
          } else {
            try {
              state.dispatch('testConnection').then(() => {
                // Try to connect and send init command
                const socket = new WebSocket('ws://' + window.location.host + '/ws');
                socket.addEventListener('message', (msg) => {
                  const data = JSON.parse(msg['data']);
                  if (data['head'] === 'ERR') {
                    state.commit('setError', data['body']);
                    for (let i = 0; i < data['body'].length; i++) {
                      console.error(data['body'][i]);
                    }
                    state.commit('setLoading', false);
                  } else if (data['head'] === 'RESET') {
                    if (data['body']) {
                      state.commit('setError', data['body']);
                    }
                    state.dispatch('stop');
                    state.commit('setCurrentView', 'home');
                  }
                });
                socket.addEventListener('open', () => {
                  resolve(socket);
                });
                socket.addEventListener('error', (err) => {
                  console.error(err);
                  state.commit('setLoading', false);
                  state.commit('setError', 'serverUnreachable');
                });
              }, () => {
                console.error('[ACTION: init]: server unreachable');
                state.commit('setLoading', false);
                reject(['[ACTION: init]: server unreachable']);
              });
            } catch (e) {
              console.error('[ACTION: init]: server unreachable');
              state.commit('setLoading', false);
              state.commit('setError', 'serverUnreachable');
              reject(['[ACTION: init]: server unreachable']);
            }
          }
        } else {
          console.error('[ACTION: init]: no connection');
          state.commit('setLoading', false);
          state.commit('setError', 'lostConnection');
          reject(['[ACTION: init]: no connection']);
        }
      });
    },
    restart (state) {
      return new Promise((resolve, reject) => {
        if (localStorage['session']) {
          const session = JSON.parse(localStorage['session']);
          state.dispatch('init').then(
            (socket) => {
              socket.addEventListener('message', (msg) => {
                const data = JSON.parse(msg['data']);
                if (data['head'] === 'ERR') {
                  state.dispatch('quit');
                } else if (data['head'] === 'ROOM') {
                  state.commit('setRoom', data['body']);
                  state.commit('setCurrentView', 'room');
                  state.dispatch('loadSession', session);
                }
              }, { once: true });
              state.commit('setSocket', socket);
              state.dispatch('send', {
                head: 'RESTART',
                body: session
              }).then(() => {
                resolve();
              }, () => {
                console.error('[ACTION: restart]: impossible to send');
                state.commit('setLoading', false);
                reject('[ACTION: restart]: impossible to send');
              });
            }, () => {
            console.error('[ACTION: restart]: impossible to init');
            state.commit('setLoading', false);
            reject('[ACTION: restart]: impossible to init');
          });
        } else {
          console.error('[ACTION: restart]: no session saved');
          state.commit('setLoading', false);
          reject(['[ACTION: restart]: no session saved']);
        }
      });
    },
    saveSession (state) {
      return new Promise((resolve) => {
        localStorage['session'] = JSON.stringify({
          player: state.getters.player,
          roomId: state.getters.room['id']
        });
        resolve();
      });
    },
    loadSession (state, session) {
      return new Promise((resolve) => {
        state.commit('setPlayer', session['player']);
        state.commit('setRoomId', session['roomId']);
        resolve();
      });
    },
    saveSettings (state) {
      return new Promise((resolve) => {
        localStorage['settings'] = JSON.stringify({
          lang: state.getters.lang
        });
        resolve();
      });
    },
    loadSettings (state) {
      return new Promise(() => {
        if (localStorage['settings']) {
          const settings = JSON.parse(localStorage['settings']);
          state.commit('setLang', settings['lang']);
        }
      });
    },
    testConnection (state) {
      return new Promise((resolve, reject) => {
        state.getters.http.get('/reach', {
          timeout: 3000
        }).then(() => {
          resolve();
        }, () => {
          console.error('[ACTION: testConnection]: server unreachable');
          state.commit('setLoading', false);
          state.commit('setError', 'serverUnreachable');
          reject('[ACTION: testConnection]: server unreachable');
        });
      });
    }
  }
};

module.exports = () => Store;
