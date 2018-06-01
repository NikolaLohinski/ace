<template>
  <section class="offline">
    <nav>
      <v-link to="offline/scores" class="menu-btn right"><i class="fa fa-trophy"></i></v-link>
      <v-link to="offline/menu" class="menu-btn left"><i class="fa fa-bars"></i></v-link>
    </nav>
    <other-player v-for="(p, i) in otherPlayers"
                  :key="p.name"
                  :name="p.name"
                  :status="p.status"
                  :playing="p.turn"
                  :position="i + 1">
    </other-player>
    <dealer-coin :position="dealer"></dealer-coin>
    <auctions :auctions="auctions"
              :forbidden-prices="me.forbiddenPrices"
              :show-selector="showBetSelector"
              @bet="bet">
    </auctions>
    <cards :forbidden="forbiddenCards"
           :hand="hand"
           :turn="turn"
           :starter="game.starter || game.leader"
           :move-up="showBetSelector"
           :disabled="disableCards"
           :leader="leader"
           @played="play">
    </cards>
    <buzzer :disabled="!coincheAvailable" @hit="coinche">
    </buzzer>
  </section>
</template>
<script>
  import _consts_ from '../../js/engine/constants.js';

  import vLink from '../utils/link.vue';
  import otherPlayer from '../utils/other-player.vue';
  import dealerCoin from '../utils/dealer-coin.vue';
  import Cards from '../utils/cards.vue';
  import Auctions from '../utils/auctions.vue';
  import Buzzer from '../utils/buzzer.vue';

  export default {
    store: global.store,
    computed: {
      leader () {
        const leader = this.$store.getters.findLeader;
        return (leader === -1) ? this.dealer : leader;
      },
      game () {
        return this.$store.getters.game;
      },
      players () {
        return this.$store.getters.players;
      },
      me () {
        return this.players[0] || {};
      },
      hand () {
        if (!this.config.sortCards) {
          return this.me.hand;
        }
        const category = this.game.auction ? this.game.auction.category : null;
        return this.$store.getters.sortCards(this.me.hand, category);
      },
      otherPlayers () {
        return this.players.slice(1);
      },
      auctions () {
        const auctions = [];
        if (this.game.state === _consts_.__GAME_STATE_BETS__) {
          for (let p = 0; p < this.players.length; p++) {
            const player = this.players[p];
            if (player.auctions && p !== this.players.findIndex((e) => e.turn)) {
              auctions.push(player.auctions[player.auctions.length - 1]);
            } else {
              auctions.push(null);
            }
          }
        }
        return auctions;
      },
      showBetSelector () {
        return this.me.turn && this.game.state === _consts_.__GAME_STATE_BETS__;
      },
      disableCards () {
        return !(this.me.turn && this.game.state === _consts_.__GAME_STATE_PLAY__);
      },
      coincheAvailable () {
        return this.me.canCoinche || false;
      },
      forbiddenCards () {
        return this.me.forbiddenCards || [];
      },
      turn () {
        return this.game.turn || [null, null, null, null];
      },
      dealer () {
        return this.players.findIndex((p) => p.dealer);
      },
      config () {
        return this.$store.getters.config;
      }
    },
    components: {
      vLink,
      otherPlayer,
      dealerCoin,
      Cards,
      Auctions,
      Buzzer
    },
    methods: {
      play (card) {
        this.$store.dispatch('act', {
          action: 'play',
          arg: card,
          token: this.game.token,
          id: this.me.id
        }).then();
      },
      bet (bet) {
        this.$store.dispatch('act', {
          action: 'bet',
          arg: bet,
          token: this.game.token,
          id: this.me.id
        }).then();
      },
      coinche (coinche) {
        this.$store.dispatch('act', {
          action: 'bet',
          arg: coinche,
          token: this.game.token,
          id: this.me.id
        }).then();
      }
    },
    beforeRouteLeave (to, from, next) {
      const self = this;
      if (to.path.indexOf('/offline') === -1) {
        self.$createDialog({
          type: 'confirm',
          icon: 'cubeic-danger',
          title: self.$t('utils.warning'),
          content: self.$t('menu.youWillLoseYourCurrentProgress'),
          confirmBtn: self.$t('menu.quit'),
          cancelBtn: self.$t('utils.cancel'),
          onConfirm: () => {
            this.$store.dispatch('clearGame').then(next);
          }
        }).show();
      } else {
        next();
      }
    },
    mounted () {
      this.$store.dispatch('initGame').then();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/colors';
  .offline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $center-logo center no-repeat;
    background-size: $size-center-logo $size-center-logo;
    nav {
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      padding: 15px 0;
      .menu-btn {
        position: absolute;
        min-width: 50px;
        text-align: center;
        display: inline-block;
        font-size: 30px;
        pointer-events: auto;
        text-shadow: 1px 1px 2px $default-text-color;
        &.right {
          right: 5px;
        }
        &.left {
          left: 5px;
        }
      }
    }
  }
</style>
