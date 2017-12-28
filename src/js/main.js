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
    name: '',
    idPlayer: -1,
    idGame: -1,
    players: []
  },
  getters: {
    name (state) {
      return state.name;
    },
    idGame (state) {
      return state.idGame;
    },
    idPlayer (state) {
      return state.idPlayer;
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
    setSocket (state, socket) {
      state.socket = socket;
    },
    killSocket (state) {
      if (state.socket) {
        state.socket.close();
        state.socket = undefined;
      }
    },
    setName (state, name) {
      state.name = name;
    },
    setIdPlayer (state, idPlayer) {
      state.idPlayer = parseInt(idPlayer);
    },
    setIdGame (state, idGame) {
      state.idGame = idGame;
    },
    setPlayers (state, players) {
      state.players = players;
    },
    setLoading (state, value) {
      state.loading = value;
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
    registerListener (state, callback) {
      return new Promise((resolve, reject) => {
        if (state.getters.socket) {
          state.getters.socket.addEventListener('message', (message) => {
            callback(JSON.parse(message['data']));
          });
          resolve();
        } else {
          reject('No socket.');
        }
      });
    },
    initDialog (state, name) {
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
              if (data['head'] === 'IDPLY') {
                state.commit('setName', data['body']['name']);
                state.commit('setIdPlayer', data['body']['id']);
                state.commit('setSocket', socket);
                resolve();
              }
            }, { once: true });
            socket.addEventListener('open', () => {
              socket.send(JSON.stringify({
                head: 'INIT',
                body: {
                  name: name
                }
              }));
            });
          } catch (e) {
            reject(e);
          }
        }
      });
    }
  }
});

global.vm = new Vue({
  el: '#app-container',
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
    this.$store.commit('setLoading', false);
  }
});

// To reload page whenever cache has been updated
window.applicationCache.addEventListener('updateready', () => window.location.reload());
if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
  window.location.reload();
}
