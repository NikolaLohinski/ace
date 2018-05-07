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
           :hand="hand"
           :turn="turn"
           :move-up="showBetSelector"
           :disabled="disableCards"
           :leader="leader"
           @play="playCard">
    </cards>
    <auctions :auctions="auctions" :show-selector="showBetSelector" @bet="bet">
    </auctions>
    <buzzer :disabled="!coincheAvailable" @hit="coinche">
    </buzzer>
  </section>
</template>
<script>
  // import saveState from 'vue-save-state';

  import vLink from '../utils/link.vue';
  import otherPlayer from '../utils/other-player.vue';
  import dealerCoin from '../utils/dealer-coin.vue';
  import Cards from '../utils/cards.vue';
  import Auctions from '../utils/auctions.vue';
  import Buzzer from '../utils/buzzer.vue';

  export default {
    // mixins: [saveState],
    data () {
      return {
        players: [],
        gameState: 0,
        //  Game states
        GAME_STATE_END: -1,
        GAME_STATE_INIT: 0,
        GAME_STATE_BETS: 1,
        GAME_STATE_PLAY: 2,
        GAME_STATE_INTER: 3
      };
    },
    computed: {
      otherPlayers () {
        return this.players.slice(1);
      },
      auctions () {
        return [];
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
      hand () {
        return [];
      },
      turn () {
        return [];
      },
      leader () {
        return -1;
      },
      dealer () {
        return -1;
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
      },
      bet (bet) {
        console.log(bet);
      },
      coinche () {
        console.log('coinche');
      },
      getSaveStateConfig () {
        return {
          'cacheKey': 'offline'
        };
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/colors';
  .offline {
    position: fixed;
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
        color: $default-text-color;
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
