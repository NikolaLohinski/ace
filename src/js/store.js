const Store = {
  state: {
    loading: true,
    socket: null,
    roomId: null,
    player: {},
    players: [],
    error: [],
    langs: [],
    lang: 'english',
    currentView: null
  },
  getters: {
    currentView (state) {
      return state.currentView;
    },
    error (state) {
      return state.error;
    },
    player (state) {
      return state.player;
    },
    roomId (state) {
      return state.roomId;
    },
    players (state) {
      return state.players;
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
    setRoomId (state, idGame) {
      state.roomId = idGame;
    },
    setPlayers (state, players) {
      state.players = players;
      state.player = players.find((p) => p['id'] === state.player['id']);
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
          reject(['[ACTION: send]: no socket']);
        }
      });
    },
    killSocket (state) {
      return new Promise(() => {
        if (state.getters.socket) {
          state.dispatch('send', {
            head: 'QUIT'
          }).then(() => {
            localStorage['session'] = '';
            state.getters.socket.close();
            state.commit('setSocket', undefined);
          }, (err) => {
            console.error(err);
          });
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
          reject(['[ACTION: registerListener]: no socket']);
        }
      });
    },
    initPlayer (state, name) {
      return new Promise((resolve, reject) => {
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
        }, (errors) => {
          errors.push('[ACTION: initPlayer]: impossible to init');
          reject(errors);
        });
      });
    },
    init (state) {
      return new Promise((resolve, reject) => {
        if (navigator.onLine) {
          if (!('WebSocket' in window)) {
            state.commit('setError', 'noWebsocket');
            reject(['[ACTION: init]: socket not supported']);
          } else {
            try {
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
            } catch (e) {
              console.error(e);
              state.commit('setLoading', false);
              state.commit('setError', 'serverUnreachable');
              reject(['[ACTION: init]: server unreachable']);
            }
          }
        } else {
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
                if (data['head'] !== 'ERR') {
                  state.dispatch('loadSession', session);
                } else {
                  state.dispatch('killSocket');
                }
              }, { once: true });
              state.commit('setSocket', socket);
              state.dispatch('send', {
                head: 'RESTART',
                body: session
              }).then(() => resolve(), (errors) => {
                errors.push('[ACTION: restart]: impossible to send');
                reject(errors);
              });
            }, (errors) => {
            errors.push('[ACTION: restart]: impossible to init');
            reject(errors);
          });
        } else {
          reject(['[ACTION: restart]: no session saved']);
        }
      });
    },
    saveSession (state) {
      return new Promise((resolve, reject) => {
        localStorage['session'] = JSON.stringify({
          player: state.getters.player,
          roomId: state.getters.roomId,
          players: state.getters.players,
          currentView: state.getters.currentView
        });
        resolve();
      });
    },
    loadSession (state, session) {
      return new Promise((resolve, reject) => {
        state.commit('setPlayer', session['player']);
        state.commit('setRoomId', session['roomId']);
        state.commit('setPlayers', session['players']);
        state.commit('setCurrentView', session['currentView']);
        resolve();
      });
    },
    saveSettings (state) {
      return new Promise((resolve, reject) => {
        localStorage['settings'] = JSON.stringify({
          lang: state.getters.lang
        });
        resolve();
      });
    },
    loadSettings (state) {
      return new Promise((resolve, reject) => {
        if (localStorage['settings']) {
          const settings = JSON.parse(localStorage['settings']);
          state.commit('setLang', settings['lang']);
          resolve();
        } else {
          reject(['[ACTION: loadSettings]: no settings saved']);
        }
      });
    }
  }
};

module.exports = () => Store;
