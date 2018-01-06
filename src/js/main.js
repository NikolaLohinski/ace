'use strict';

import 'inobounce';
import Vue from 'vue';
import Vuex from 'vuex';
import VueTouch from 'vue-touch';
import Root from '../vue/root.vue';
import Spinner from '../vue/utils/spinner.vue';

Vue.use(Vuex);
Vue.use(VueTouch, { name: 'v-touch' });

Vue.directive('focus', {
  inserted (el) {
    el.focus();
  }
});

global.store = new Vuex.Store({
  state: {
    loading: true,
    socket: undefined,
    roomId: -1,
    player: {},
    players: [],
    error: '',
    currentView: undefined
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
      for (let k = 0; k < players.length; k++) {
        const p = players[k];
        if (p['id'] === state.player['id']) {
          state.player = p;
        }
      }
    },
    setLoading (state, value) {
      state.loading = value;
    },
    setSession (state) {
      localStorage['session'] = JSON.stringify({
        player: state.player,
        roomId: state.roomId,
        players: state.players
      });
    }
  },
  actions: {
    send (state, message) {
      return new Promise((resolve, reject) => {
        if (state.getters.socket) {
          state.getters.socket.send(JSON.stringify(message));
          resolve();
        } else {
          reject('No socket.');
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
          reject('No socket.');
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
        }, (e) => {
          reject(e);
        });
      });
    },
    init (state) {
      return new Promise((resolve, reject) => {
        if (!('WebSocket' in window)) {
          window.alert('Websocket is not supported by this browser. How about Google Chrome ?');
          reject();
        } else {
          try {
            // Try to connect and send init command
            const socket = new WebSocket('ws://' + window.location.host + '/ws');
            socket.addEventListener('message', (msg) => {
              const data = JSON.parse(msg['data']);
              if (data['head'] === 'ERR') {
                state.commit('setError', data['body'][0]);
                for (let i = 0; i < data['body'].length; i++) {
                  console.error(data['body'][i]);
                }
              }
            });
            socket.addEventListener('open', () => {
              resolve(socket);
            });
          } catch (e) {
            reject(e);
          }
        }
      });
    },
    retrieveSession (state) {
      return new Promise((resolve, reject) => {
        if (localStorage['session']) {
          const session = JSON.parse(localStorage['session']);
          state.commit('setPlayer', session['player']);
          state.commit('setRoomId', session['roomId']);
          state.commit('setPlayers', session['players']);
          state.dispatch('init').then(
            (socket) => {
              socket.addEventListener('message', (msg) => {
                const data = JSON.parse(msg['data']);
                if (data['head'] === 'ROOM') {
                  state.commit('setCurrentView', 'room');
                }
              }, { once: true });
              state.commit('setSocket', socket);
              state.dispatch('send', {
                head: 'RESTART',
                body: session
              }).then(() => resolve(), (err) => reject(err));
            }, (err) => reject(err));
        } else {
          reject();
        }
      });
    }
  }
});

global.vm = new Vue({
  el: '#app-container',
  data () {
    return {
      session: {
        player: undefined,
        roomId: -1
      }
    };
  },
  computed: {
    loading () {
      return this.$store.getters.loading;
    }
  },
  components: {
    Root,
    Spinner
  },
  store: global.store,
  mounted () {
    // Get local session storage
    this.$store.dispatch('retrieveSession').then(() => {
      this.$store.commit('setLoading', false);
    }, (err) => {
      if (err) console.error(err);
      this.$store.commit('setLoading', false);
    });
  }
});

// To reload page whenever cache has been updated
window.applicationCache.addEventListener('updateready', () => window.location.reload());
if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
  window.location.reload();
}
