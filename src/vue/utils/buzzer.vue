<template>
  <div class="buzzer-container">
    <transition name="fade" mode="out-in">
    <div class="buzzer-holder" v-if="showBuzzer">
      <v-touch tag="button" class="buzzer cube-btn"
               @tap.prevent="hit">
      </v-touch>
    </div>
    <div class="auction" v-else>
      <i :class="`category card-icon ${auction.category}`"></i>
      <div class="price">
        <span v-if="['GEN', 'CAP'].indexOf(auction.price) !== -1">
        {{ $t(`play.${auction.price}`) }}
        </span>
        <span v-else>
          {{ auction.price }}
        </span>
      </div>
    </div>
    </transition>
  </div>
</template>
<script>
  import _consts_ from '../../js/engine/constants.js';
  export default {
    methods: {
      hit () {
        this.$emit('hit', {
          price: null,
          category: null,
          type: _consts_.__BET_ACTION_COINCHE__
        });
      }
    },
    props: {
      showBuzzer: {
        type: Boolean,
        required: true
      },
      auction: {
        type: Object,
        default () {
          return {};
        }
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/colors';
  .buzzer-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $size-center-logo;
    height: $size-center-logo;
    display: table;
    pointer-events: none;
    .buzzer-holder {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      .buzzer {
        cursor: pointer;
        display: inline-block;
        background: $coinche center no-repeat;
        background-color: $lighter-background;
        background-size: 95%;
        border: 1px solid $default-border-color;
        width: $size-center-logo / 3.5;
        height: $size-center-logo / 3.5;
        line-height: $size-center-logo / 3.8;
        font-size: $size-center-logo / 5;
        border-radius: 50%;
        padding: 0;
        pointer-events: auto;
        color: $default-text-color;
        &:focus {
          outline: none;
        }
        &:active {
          background-color: $danger-link-color;
          box-shadow: inset 1px 1px 2px $default-text-color;
          border-color: $active-button-background-color;
          outline: none;
          color: white;
        }
        &:after {
          content: none;
          display: none;
        }
        > i.fa {
          margin-right: 0;
          transform: none;
        }
      }
    }
    .auction {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      .category {
        position: relative;
        top: -4px;
        &:before {
          width: 20px !important;
          height: 20px !important;
        }
      }
      .price {
        color: $darker-text-color;
        font-size: 7px;
        margin-top: -3px;
      }
    }
    &[disabled] {
      .buzzer {
        pointer-events: none;
        opacity: 0.3;
      }
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .2s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
