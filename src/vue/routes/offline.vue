<template>
  <section class="offline">
    <layer :z-index="0"><background></background></layer>
    <layer :z-index="4"><dealer-coin></dealer-coin></layer>
    <layer :z-index="5"><buzzer></buzzer></layer>
    <layer :z-index="6"><cards :moveup="placingBets"></cards></layer>
    <layer :z-index="7"><player-info></player-info></layer>
    <layer :z-index="8"><auctioneer @placing="placingBets = true" @finished="placingBets = false"></auctioneer></layer>
    <layer :z-index="10"><div>
      <v-link to="offline/scores" class="menu r"><i class="fa fa-trophy"></i></v-link>
      <v-link to="offline/menu" class="menu l"><i class="fa fa-bars"></i></v-link>
    </div></layer>
  </section>
</template>
<script>
  import Background from '../layers/background.vue';
  import PlayerInfo from '../layers/playerInfo.vue';
  import DealerCoin from '../layers/dealerCoin.vue';
  import Auctioneer from '../layers/auctioneer.vue';
  import Buzzer from '../layers/buzzer.vue';
  import Cards from '../layers/cards.vue';
  import Layer from '../utils/layer.vue';
  import vLink from '../utils/link.vue';
  export default {
    data () {
      return {
        placingBets: false
      };
    },
    components: {
      Background,
      PlayerInfo,
      DealerCoin,
      Auctioneer,
      Buzzer,
      Cards,
      Layer,
      vLink
    },
    store: global.store,
    computed: {
      isWait () {
        return this.$store.getters.game.isWait();
      }
    },
    watch: {
      isWait (isWait) {
        if (isWait) {
          this.$store.dispatch('start');
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      const game = this.$store.getters.game;
      const self = this;
      if (to.path.indexOf('/offline') === -1) {
        if (game.hasEnded()) {
          self.$store.dispatch('clear').then(next);
        } else {
          self.$createDialog({
            type: 'confirm',
            icon: 'cubeic-danger',
            title: self.$t('utils.warning'),
            content: self.$t('menu.youWillLoseYourCurrentProgress'),
            confirmBtn: self.$t('menu.quit'),
            cancelBtn: self.$t('utils.cancel'),
            onConfirm: () => self.$store.dispatch('clear').then(next),
            onCancel: () => next(false)
          }).show();
        }
      } else {
        next();
      }
    },
    mounted () {
      this.$store.dispatch('initialize').then();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  .offline {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    &[vibrate] {
      animation-name: shake;
      animation-duration: 1s;
      transform-origin:50% 50%;
      animation-timing-function: linear;
    }
    .menu {
      position: absolute;
      min-width: 50px;
      text-align: center;
      font-size: 30px;
      pointer-events: auto;
      text-shadow: 1px 1px 2px $default-text-color;
      top: 10px;
      &.r { right: 5px; }
      &.l { left: 5px; }
    }
    @keyframes shake {
      0% { -webkit-transform: translate(2px, 1px) rotate(0deg); }
      10% { -webkit-transform: translate(-1px, -2px) rotate(-1deg); }
      20% { -webkit-transform: translate(-3px, 0px) rotate(1deg); }
      30% { -webkit-transform: translate(0px, 2px) rotate(0deg); }
      40% { -webkit-transform: translate(1px, -1px) rotate(1deg); }
      50% { -webkit-transform: translate(-1px, 2px) rotate(-1deg); }
      60% { -webkit-transform: translate(-3px, 1px) rotate(0deg); }
      70% { -webkit-transform: translate(2px, 1px) rotate(-1deg); }
      80% { -webkit-transform: translate(-1px, -1px) rotate(1deg); }
      90% { -webkit-transform: translate(2px, 2px) rotate(0deg); }
      100% { -webkit-transform: translate(1px, -2px) rotate(-1deg); }
    }
  }
</style>
