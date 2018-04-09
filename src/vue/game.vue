<template>
  <div class="game">
    <cards :players="players" :auction="bets && me.turn"
           @card="play"
           :turn="me.turn"
           :moveup="bidding">
    </cards>
    <gamemenu @pause="updateState" @quit="quit">
    </gamemenu>
    <buzzer :state="state"
            :auction="auction"
            :coinche-available="me.can_coinche"
            @coinche="coinche">
    </buzzer>
    <auctions v-if="bets" :show="me.turn"
              :forbidden-prices="me.forbidden_bets"
              @bidding="(e) => bidding = e"
              @bid="bid">
    </auctions>
    <actors :players="players" :bets="bets">
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
        startTimeout: null,
        keepAliveTimeout: null,
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
      turn () {
        return this.players.filter((p) => !p.turn).pop();
      },
      admin () {
        return this.players.filter((p) => p.admin).pop();
      },
      me () {
        return (this.session) ? this.game.players[0] : {};
      },
      state () {
        return this.game['state'];
      },
      bets () {
        return this.game['state'] === global.__STATE_BETS__;
      },
      wonAuctions () {
        return this.players.filter((p) => p['won_auctions']).pop() || {};
      },
      auction () {
        return (this.wonAuctions.bets) ? this.wonAuctions.bets[this.wonAuctions.bets.length - 1] : {};
      },
      coinchor () {
        return this.players.filter((p) => {
          return p.coinche &&
            p !== this.wonAuctions &&
            p !== this.players[(this.players.indexOf(this.wonAuctions) + 2) % 4];
        }).pop();
      },
      surcoinchor () {
        return this.players.filter((p) => p.coinche && p !== this.coinchor).pop();
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
      players: {
        deep: true,
        handler () {
          if (this.coinchor && this.bets) {
            if (this.surcoinchor) {
              this.$store.dispatch('vibrate').then(() => {
                this.$store.commit('setNotification', {
                  title: this.$t('game.surcoinched'),
                  body: `${this.surcoinchor.name} ${this.$t('game.playerSurcoinched')}`
                });
              });
            } else {
              const self = this;
              this.$store.dispatch('vibrate').then(() => {
                if ([0, 2].indexOf(this.players.indexOf(this.coinchor)) !== -1) {
                  this.$store.commit('setNotification', {
                    title: this.$t('game.coinched'),
                    body: `${this.coinchor.name} ${this.$t('game.playerCoinched')}`
                  });
                } else {
                  this.$store.commit('setNotification', {
                    body: `${this.coinchor.name} ${this.$t('game.playerCoinchedDoYouSurcoinche')}`,
                    timer: {
                      timeout: 3,
                      value: false
                    },
                    callback (surcoinche) {
                      if (surcoinche) {
                        self.coinche();
                      }
                    }
                  });
                }
              });
            }
          }
          if (!this.turn && this.bets && this.me.admin) {
            this.start();
          }
        }
      },
      state (state) {
        if (state === global.__STATE_ROOM__) {
          this.$emit('redirect', 'room');
        }
      },
      turn (turn) {
        // If it is no ones turn and game is still bets, then set a timer of
        // 3s in case of coinche to start game
        if (!turn && this.bets && this.me.admin) {
          this.start();
        }
      }
    },
    methods: {
      start () {
        clearTimeout(this.startTimeout);
        this.startTimeout = setTimeout(this.$store.dispatch, 3000, 'send', {
          H: 'START',
          B: this.$store.getters.session.client
        });
      },
      coinche () {
        if (!this.surcoinchor) {
          this.$store.dispatch('send', {
            H: 'PLAY',
            B: {
              'target': 'COINCHE',
              'id': this.$store.getters.session.client.id,
              'game_id': this.$store.getters.session.client.game_id
            }
          });
        }
      },
      play (card) {
        this.$store.dispatch('send', {
          H: 'PLAY',
          B: {
            'target': 'CARD',
            'card': card,
            'id': this.$store.getters.session.client.id,
            'game_id': this.$store.getters.session.client.game_id
          }
        });
      },
      bid (bid) {
        this.$store.dispatch('send', {
          H: 'PLAY',
          B: {
            'target': 'BET',
            'bet': bid,
            'id': this.$store.getters.session.client.id,
            'game_id': this.$store.getters.session.client.game_id
          }
        });
      },
      quit () {
        this.$store.dispatch('send', {
          H: 'UPDATE',
          B: {
            'id': this.$store.getters.session.client['id'],
            'game_id': this.$store.getters.session.client['game_id'],
            'target': 'PLAYER',
            'key': 'state',
            'value': global.__PLAYER_OFFLINE__
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
            'value': (pause) ? global._PLAYER_PAUSE__ : global.__PLAYER_READY__
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
      keepAlive (keepAliveTimeout) {
        this.keepAliveTimeout = setTimeout(() => {
          this.$store.dispatch('send', {
            H: 'ALIVE',
            B: {}
          }).then(() => {
            this.keepAlive(keepAliveTimeout);
          }, () => {
            clearTimeout(this.keepAliveTimeout);
          });
        }, keepAliveTimeout);
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
        clearTimeout(this.keepAliveTimeout);
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
