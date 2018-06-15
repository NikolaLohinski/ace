<template>
  <div class="auctions">
    <transition-group name="fade" tag="div">
      <div v-for="(auction, index) in auctions" :key="index"
                        :position="index" class="bet" v-if="auction">
        <span v-if="auction.type !== passType">
          <div v-if="auction.price === 'CAP' || auction.price === 'GEN'" class="price">
            {{ $t(`play.${auction.price}`) }}
          </div>
          <span v-else class="price">
            {{ auction.price }}
          </span>
          <span>
            <i :class="`card-icon ${auction.category}`" class="type">
            </i>
          </span>
        </span>
        <span v-else class="pass">
          {{ $t('play.pass')}}
        </span>
      </div>
    </transition-group>
    <nav v-if="showSelector">
      <div class="nav-bet">
        <v-select class="bet-option"
                  :options="options"
                  @select="bet"
                  :default="[]">
          {{ $t('play.bet') }}
        </v-select>
        <v-touch tag="button"
                 @tap="() => bet(null)"
                 class="cube-btn bet-option">
          {{ $t('play.pass') }}
        </v-touch>
      </div>
    </nav>
  </div>
</template>
<script>
  import _consts_ from '../../js/engine/constants.js';
  import vSelect from './select.vue';
  export default {
    data () {
      return {
        prices: _consts_.__AUCTION_PRICES__,
        categories: _consts_.__AUCTION_CATEGORIES__,
        passType: _consts_.__BET_ACTION_PASS__,
        priceOptions: this.computePrices(_consts_.__AUCTION_PRICES__, this.forbiddenPrices)
      };
    },
    props: {
      forbiddenPrices: {
        type: Array,
        default () {
          return [];
        }
      },
      auctions: {
        type: Array,
        required: true,
        validator (auctions) {
          return auctions.length <= 4 && auctions.length >= 0;
        }
      },
      showSelector: {
        type: Boolean,
        required: true
      }
    },
    components: {
      vSelect
    },
    computed: {
      categoryOptions () {
        const categoryOptions = [];
        for (let k = 0; k < this.categories.length; k++) {
          categoryOptions.push({
            text: `<i class="card-icon ${this.categories[k]}"></i>`,
            value: this.categories[k]
          });
        }
        return categoryOptions;
      },
      options () {
        return [this.priceOptions, this.categoryOptions];
      }
    },
    watch: {
      forbiddenPrices: {
        deep: true,
        handler (forbiddenPrices) {
          this.priceOptions = this.computePrices(this.prices, forbiddenPrices);
        }
      }
    },
    methods: {
      computePrices (prices, forbidden) {
        const priceOptions = [];
        for (let k = 0; k < prices.length; k++) {
          const price = prices[k];
          if (forbidden.indexOf(price) === -1) {
            priceOptions.push({
              text: (price === 'GEN' || price === 'CAP') ? this.$t(`play.${price}`) : price,
              value: price
            });
          }
        }
        return priceOptions;
      },
      bet (bet) {
        this.$emit('bet', {
          price: bet ? bet[0] : null,
          category: bet ? bet[1] : null,
          type: bet ? _consts_.__BET_ACTION_BET__ : _consts_.__BET_ACTION_PASS__
        });
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/sizes';
  .auctions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    pointer-events: none;
    z-index: 200;
    .bet {
      position: absolute;
      text-align: center;
      font-size: 12px;
      z-index: 0;
      .pass {
        font-style: italic;
        color: $lighter-text-color;
      }
      .price {
        margin-bottom: 5px;
      }
      .type:before {
        width: 20px;
        height: 20px;
      }
      &[position='0'] {
        bottom: 28vh;
        left: 50%;
        transform: translate(-50%, 0);
        > div {
          display: inline-block;
        }
      }
      &[position='1'] {
        top: 50%;
        right: 25vw;
        transform: translate(0, -50%);
      }
      &[position='2'] {
        top: 60px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &[position='3'] {
        top: 50%;
        left: 25vw;
        transform: translate(0, -50%);
      }
      @include answer-to-height ('s') {
        &[position='0'] {
          bottom: 25vh;
        }
      }
      @include answer-to-width ('s') {
        &[position='1'] {
          right: 35px;
        }
        &[position='3'] {
          left: 35px;
        }
      }
    }
    nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: auto;
      text-align: center;
      height: 65px;
      background-color: $general-background;
      box-shadow: -1px -1px 5px rgba(0, 0, 0, 0.2);
      .nav-bet {
        margin: 0 auto;
        width: 100%;
        max-width: 500px;
        line-height: 65px;
        .bet-option {
          display: inline-block;
          width: 48%;
        }
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
