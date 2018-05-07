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
                  :position="i + 1">
    </other-player>
    <dealer-coin :position="dealer"></dealer-coin>
    <cards :forbidden="forbiddenCards"
           v-model="(config.sortCards) ? engine.sort(players[0].hand) : players[0].hand"
           :turn="turn"
           :move-up="showBetSelector"
           :disabled="disableCards"
           :leader="leader"
           @change="playCard">
    </cards>
    <auctions :auctions="auctions" :show-selector="showBetSelector" @bet="bet">
    </auctions>
    <buzzer :disabled="!coincheAvailable" @hit="coinche">
    </buzzer>
  </section>
</template>
<script>
  import Engine from '../../js/engine/Engine.js';

  import vLink from '../utils/link.vue';
  import otherPlayer from '../utils/other-player.vue';
  import dealerCoin from '../utils/dealer-coin.vue';
  import Cards from '../utils/cards.vue';
  import Auctions from '../utils/auctions.vue';
  import Buzzer from '../utils/buzzer.vue';

  export default {
    data () {
      return {
        engine: Engine
      };
    },
    store: global.store,
    computed: {
      game () {
        return this.$store.getters.game;
      },
      players () {
        return this.game.players || [];
      },
      otherPlayers () {
        return this.players.slice(1);
      },
      auctions () {
        const auctions = [];
        for (let p = 0; p < this.players.length; p++) {
          const player = this.players[p];
          if (player.auctions) {
            auctions.push(player.auctions[player.auctions.length - 1]);
          } else {
            auctions.push(null);
          }
        }
        return auctions;
      },
      showBetSelector () {
        return false;
      },
      disableCards () {
        return true;
      },
      coincheAvailable () {
        return false;
      },
      forbiddenCards () {
        return [];
      },
      turn () {
        return [];
      },
      leader () {
        return -1;
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
      playCard (card) {
        console.log(card);
        // this.$store.commit('updateGame');
      },
      bet (bet) {
        console.log(bet);
      },
      coinche () {
        console.log('coinche');
      },
      initGame () {
        this.engine.deal(this.players, null);
        this.game.intialized = true;
        this.$store.commit('updateGame');
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
      if (!this.game.intialized) {
        this.initGame();
      }
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
