<template>
  <div class="room">
    <div class="content">
      <header>
        <div class="definition">{{ $t('room.roomId') }}</div>
        <div class="room-id">{{ gameId }}</div>
      </header>
      <table class="players-list">
        <thead>
          <tr>
            <th>{{ $t('room.name') }}</th>
            <th class="ready-tag">{{ $t('room.ready') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in players">
            <td>{{ p.name }}
              <span class="admin" v-if="p.admin">
                {{ `(${$t('room.admin')})` }}
              </span>
            </td>
            <td class="ready-tag">
              <span class="state" :status="p.state"></span>
            </td>
          </tr>
          <tr v-for="i in (4 - ((players) ? players.length : 0))">
            <td colspan="2" class="waiting-for-players">
              <div class="small-loader">
                <div class="small-spinner"></div>
              </div>
              {{ $t('room.waitingForPlayers') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="continue" :disabled="ready">
      <v-touch tag="span" @tap="updateState" class="text" v-if="!spin">
        {{ (me.state) ? $t('cancel') : $t('room.ready') }}
      </v-touch>
      <div v-else class="small-loader">
        <div class="small-spinner"></div>
      </div>
    </div>
    <v-touch tag="div" class="back" :disabled="me.state > 0" @tap="quit">
      {{ $t('back') }}
    </v-touch>
  </div>
</template>
<script>
  import Spinner from './spinner.vue';
  export default {
    data () {
      return {
        spin: false,
        timeout: null,
        player: {},
        room: {},
        started: false
      };
    },
    store: global.store,
    computed: {
      session () {
        return this.$store.getters.session;
      },
      game () {
        return (this.session) ? this.session.game : {};
      },
      gameId () {
        return this.game['id'];
      },
      players () {
        return (this.game['players']) ? this.game['players'] : [];
      },
      ready () {
        return this.players.every((p) => {
          return p.state > 0;
        }) && this.me.admin && this.players.length === 4;
      },
      me () {
        return (this.session) ? this.game.players[0] : {};
      },
      state () {
        return this.game['state'];
      }
    },
    components: {
      Spinner
    },
    watch: {
      state (state) {
        this.$store.commit('setLoading', false);
        if (state !== global.__STATE_ROOM__) {
          this.$emit('redirect', 'game');
        }
      }
    },
    methods: {
      updateState ($event) {
        $event.preventDefault();
        this.$store.dispatch('send', {
          H: 'UPDATE',
          B: {
            'id': this.$store.getters.session.client['id'],
            'game_id': this.$store.getters.session.client['game_id'],
            'target': 'PLAYER',
            'key': 'state',
            'value': (this.me.state) ? global._PLAYER_PAUSE__ : global.__PLAYER_READY__
          }
        }).then(() => {
          this.spin = true;
        });
      },
      start () {
        if (!this.started) {
          this.$store.commit('setLoading', true);
          this.$store.dispatch('send', {
            H: 'START',
            B: this.$store.getters.session.client
          }).then(() => {
            this.started = true;
          });
        }
      },
      quit () {
        this.$emit('back');
        this.$store.dispatch('quit').then(null);
      },
      authorize () {
        const self = this;
        self.$store.commit('setNotification', {
          body: `${self.$t('room.everyoneHereShallStart')}`,
          timer: {
            timeout: 5,
            value: true
          },
          callback (value) {
            (value) ? self.start() : self.updateState();
          }
        });
      },
      listener (socketStream) {
        this.spin = false;
        this.$store.dispatch('readSocket', {
          headers: 'GAME||RESET',
          socketStream: socketStream
        }).then((data) => {
          if (data.H === 'GAME') {
            this.$store.commit('setSession', data.B);
            if (this.ready && !this.started) {
              this.authorize();
            }
          } else if (data.H === 'RESET') {
            this.$store.commit('setNotification', {
              body: this.$t('notifications.adminLeft')
            });
            this.$store.commit('setSession', null);
            this.$emit('back');
          }
        }, null);
      },
      keepAlive (timeout) {
        this.timeout = setTimeout(() => {
          this.$store.dispatch('send', {
            H: 'ALIVE',
            B: {}
          }).then(() => {
            this.keepAlive(timeout);
          }, () => {
            clearTimeout(this.timeout);
          });
        }, timeout);
      }
    },
    mounted () {
      this.$store.dispatch('registerListener', this.listener).then(() => {
        this.keepAlive(15000);
        if (this.ready) {
          this.authorize();
        }
      });
    },
    beforeDestroy () {
      this.$store.dispatch('removeListener', this.listener).then(() => {
        clearTimeout(this.timeout);
      });
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import './../scss/general';
  .room {
    position: absolute;
    height: 100vh;
    width: 100vw;
    .content {
      @media screen and (max-device-height: 400px),
      screen and (max-height: 400px) {
        height: 100vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
      header {
        margin-top: 15px;
        text-align: center;
        > * {
          margin: 0 15px;
        }
        .definition {
          color: $lighter-text-color;
          font-size: 15px;
          line-height: 30px;
          display: inline-block;
        }
        .room-id {
          font-size: 30px;
          display: inline-block;
        }
        @media screen and (min-width: $min-m-width),
        screen and (min-device-width: $min-m-width) {
          .definition {
            font-size: 30px;
            line-height: 60px;
          }
          .room-id {
            font-size: 60px;
          }
        }
      }
      table.players-list {
        text-align: center;
        margin: 15px auto 30px auto;
        width: 75%;
        thead th {
          font-size: 15px;
          color: $lighter-text-color;
          font-weight: normal;
        }
        tbody td {
          position: relative;
          padding: 15px 0;
          width: 50%;
          &.ready-tag {
            width: 50%;
            .state {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              transition: background-color 200ms;
              background-color: red;
              display: inline-block;
              box-shadow: inset -1px 1px 2px rgba(0,0,0,0.2);
              &[status='0'] {
                background-color: #ffff00;
              }
              &[status='1'] {
                background-color: #00d516;
              }
            }
          }
          .admin {
            color: $lighter-text-color
          }
          &.waiting-for-players {
            font-style: italic;
            color: $lighter-text-color;
            .small-loader {
              display: inline-block;
              position: initial;
              margin: 0 15px;
              vertical-align: middle;
              transform: translateY(-3px);
            }
          }
        }
      }
    }
    .back,
    .continue {
      &.back {
        left: 15px;
      }
      &.continue {
        right: 15px;
        min-width: 30px;
        min-height: 20px;
        text-align: right;
      }
      position: absolute;
      bottom: 15px;
      cursor: pointer;
      &[disabled] {
        pointer-events: none;
        opacity: 0.3;
      }
      &:hover, &:active {
        color: $link-text-color;
      }
    }
    .small-loader {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      transition: opacity 200ms;
      > .small-spinner {
        display: block;
        margin: 2.5px auto;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: 0 0;
        border: 4px solid #ddd;
        border-bottom-color: #777;
        animation: loading 1.2s infinite linear;
      }
      @keyframes loading {
        to {
          transform: rotate(360deg)
        }
      }
    }
  }
</style>
