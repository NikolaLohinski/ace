<template>
  <section class="offline">
    <layer :z-index="0"><background></background></layer>
    <layer :z-index="1"><statuses></statuses></layer>
    <layer :z-index="4"><dealer-coin></dealer-coin></layer>
    <layer :z-index="5"><buzzer></buzzer></layer>
    <layer :z-index="6"><cards :moveup="placingBets"></cards></layer>
    <layer :z-index="7"><belote></belote></layer>
    <layer :z-index="8"><names></names></layer>
    <layer :z-index="9"><auctioneer @placing="placingBets = true" @finished="placingBets = false"></auctioneer></layer>
    <layer :z-index="10"><div>
      <v-link to="offline/scores" class="menu r"><i class="fa fa-trophy"></i></v-link>
      <v-link to="offline/menu" class="menu l"><i class="fa fa-bars"></i></v-link>
    </div></layer>
    <layer :z-index="20"><notification></notification></layer>
  </section>
</template>
<script>
  import Background from '../layers/background.vue';
  import Statuses from '../layers/statuses.vue';
  import Names from '../layers/names.vue';
  import Belote from '../layers/belote.vue';
  import DealerCoin from '../layers/dealerCoin.vue';
  import Auctioneer from '../layers/auctioneer.vue';
  import Buzzer from '../layers/buzzer.vue';
  import Cards from '../layers/cards.vue';
  import Notification from '../layers/notification.vue';
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
      Notification,
      Statuses,
      Names,
      Belote,
      DealerCoin,
      Auctioneer,
      Buzzer,
      Cards,
      Layer,
      vLink
    },
    store: global.store,
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
    .menu {
      position: absolute;
      min-width: 60px;
      min-height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 30px;
      pointer-events: auto;
      text-shadow: 1px 1px 2px $default-text-color;
      top: 5px;
      &.r { right: 5px; }
      &.l { left: 5px; }
    }
  }
</style>
