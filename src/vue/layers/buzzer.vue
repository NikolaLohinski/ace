<template>
  <div class="buzzer" :disabled="!enable" :hidden="hide">
    <div class="buzzer-holder">
      <v-touch tag="div" class="buzzer-btn "
               @tap.prevent="hit">
      </v-touch>
    </div>
  </div>
</template>
<script>
  import Constants from '../../json/constants.json';
  export default {
    methods: {
      hit () {
        this.$store.dispatch('bet', {
          price: null,
          category: null,
          type: Constants.__BET_ACTION_COINCHE__,
          id: this.$store.getters.me
        });
      }
    },
    store: global.store,
    computed: {
      enable () {
        const canCoinche = this.$store.getters.game.getCanCoinche();
        return canCoinche && canCoinche[this.$store.getters.me];
      },
      hide () {
        return !this.$store.getters.game.isBets();
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/colors';
  .buzzer {
    pointer-events: none;
    .buzzer-holder {
      width: $size-center-logo / 3.5;
      height: $size-center-logo / 3.5;
      position: fixed;
      left: 50%;
      top: 50%;
      text-align: center;
      vertical-align: middle;
      transform: translate(-50%, -50%);
      transition: opacity 200ms;
      *:focus, *:active {
        outline: none !important;
      }
      .buzzer-btn {
        cursor: pointer;
        pointer-events: auto;
        height: 100%;
        background: $coinche center no-repeat $lighter-background;
        background-size: 95%;
        border: 1px solid $default-border-color;
        line-height: $size-center-logo / 3.8;
        font-size: $size-center-logo / 5;
        border-radius: 50%;
        color: $default-text-color;
        &:active {
          background-color: $danger-link-color;
          box-shadow: inset 1px 1px 2px $default-text-color;
          border-color: $active-button-background-color;
          color: white;
        }
      }
    }
    &[disabled] * {
      pointer-events: none !important;
      opacity: 0.3;
    }
    &[hidden] {
      display: none;
    }
  }
</style>
