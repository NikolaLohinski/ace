<template>
  <transition name="fade">
  <div class="buzzer" :disabled="!enable" v-if="!hide" :punched="punched">
    <div class="buzzer-holder">
      <v-touch tag="div" class="buzzer-btn"
               @tap.prevent="hit">
      </v-touch>
    </div>
  </div>
  </transition>
</template>
<script>
  import Constants from '../../json/constants.json';
  export default {
    methods: {
      hit () {
        this.$store.dispatch('bet', {
          args: {
            price: null,
            category: null,
            type: Constants.COINCHE,
            id: this.$store.getters.me
          },
          token: this.$store.getters.token
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
        return !(this.$store.getters.game.isBets() || this.$store.getters.game.isWait());
      },
      punched () {
        const didCoinche = this.$store.getters.game.getDidCoinche();
        return didCoinche ? didCoinche[this.$store.getters.me] : false;
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/variables';
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
    &[punched] * {
      opacity: 1;
      .buzzer-btn {
        background-color: $danger-link-color;
        box-shadow: inset 1px 1px 2px $default-text-color;
        border-color: $active-button-background-color;
        color: white;
      }
    }
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active {
    transition: opacity .25s;
  }
</style>
