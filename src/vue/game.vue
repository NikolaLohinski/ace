<template>
  <div class="game">
    <cards :hand="hand" :auction="bets && me.turn" :moveup="bidding">
    </cards>
    <gamemenu @pause="updateState" @quit="quit">
    </gamemenu>
    <buzzer>
    </buzzer>
    <auctions v-if="bets" :show="me.turn"
              @bidding="(e) => bidding = e"
              @pass="" @bet="">
    </auctions>
    <actors :players="players">
    </actors>
  </div>
</template>

<script>
  import Buzzer from './buzzer.vue';
  import Actors from './actors.vue';
  import Cards from './cards.vue';
  import Gamemenu from './gamemenu.vue';
  import Auctions from './auctions.vue';
  export default {
    data () {
      return {
        timeout: null,
        bidding: false
      };
    },
    computed: {
      session () {
        return this.$store.getters.session;
      },
      game () {
        return (this.session) ? this.session.game : {};
      },
      players () {
        return (this.game['players']) ? this.game['players'] : [];
      },
      me () {
        return (this.session) ? this.game.players[0] : {};
      },
      hand () {
        return (this.me) ? this.me['hand'] : [];
      },
      state () {
        return this.game['state'];
      },
      bets () {
        return this.game['state'] === global.GAME_STATE_BETS;
      }
    },
    components: {
      Cards,
      Actors,
      Buzzer,
      Gamemenu,
      Auctions
    },
    watch: {
      state (state) {
        if (state === global.GAME_STATE_ROOM) {
          this.$emit('redirect', 'room');
        }
      }
    },
    methods: {
      quit () {
        this.$store.dispatch('send', {
          H: 'UPDATE',
          B: {
            'id': this.$store.getters.session.client['id'],
            'game_id': this.$store.getters.session.client['game_id'],
            'target': 'PLAYER',
            'key': 'state',
            'value': global.PLAYER_DISCONNECTED
          }
        }).then(() => {
          this.$emit('redirect', 'home');
        });
      },
      updateState (pause) {
        this.$store.dispatch('send', {
          H: 'UPDATE',
          B: {
            'id': this.$store.getters.session.client['id'],
            'game_id': this.$store.getters.session.client['game_id'],
            'target': 'PLAYER',
            'key': 'state',
            'value': (pause) ? global.PLAYER_STATE_PAUSE : global.PLAYER_STATE_READY
          }
        }).then(null);
      },
      listener (socketStream) {
        this.spin = false;
        this.$store.dispatch('readSocket', {
          headers: 'GAME',
          socketStream: socketStream
        }).then((data) => {
          this.$store.commit('setSession', data.B);
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
    store: global.store,
    mounted () {
      this.$store.dispatch('registerListener', this.listener).then(() => {
        this.keepAlive(15000);
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
  @import "../scss/general";
  .game {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    &:after {
      display: block;
      content: '';
      position: absolute;
      background: $center-logo;
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 200px;
      min-height: 200px;
      width: 25vw;
      height: 25vw;
      max-width: 300px;
      max-height: 300px;
      z-index: -3;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
</style>
