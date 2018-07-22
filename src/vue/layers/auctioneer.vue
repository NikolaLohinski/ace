<template>
  <div class="auctions">
    <nav :disabled="disabled">
      <div class="nav-bet">
        <v-select class="bet-option"
                  :options="options"
                  :default="defaultOption"
                  @select="bet"
                  @open="(e) => $emit('placing', e)"
                  @close="(e) => $emit('finished', e)">
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
  import Constants from '../../json/constants.json';
  import vSelect from '../utils/select.vue';
  export default {
    data () {
      return {
        categories: Constants.__AUCTION_CATEGORIES__,
        passType: Constants.PASS
      };
    },
    components: {
      vSelect
    },
    store: global.store,
    computed: {
      disabled () {
        return !this.$store.getters.game.isBets() || this.$store.getters.game.getWhosTurn() !== this.$store.getters.me;
      },
      forbiddenPrices () {
        return this.$store.getters.game.getForbiddenPrices();
      },
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
        const priceOptions = [];
        for (let k = 0; k < Constants.AUCTIONPRICES.length; k++) {
          const price = Constants.AUCTIONPRICES[k];
          if (this.forbiddenPrices.indexOf(price) === -1) {
            priceOptions.push({
              text: (price === 'GEN' || price === 'CAP') ? this.$t(`play.${price}`) : price,
              value: price
            });
          }
        }
        return [priceOptions, this.categoryOptions];
      },
      defaultOption () {
        const game = this.$store.getters.game;
        const partner = game.getPartner(this.$store.getters.me);
        const auctions = game.getAuctions();
        if (auctions) {
          const partnersAuctions = auctions[partner];
          if (partnersAuctions.length) {
            const auction = partnersAuctions[partnersAuctions.length - 1];
            if (auction.type === Constants.BET) {
              return [0, this.categoryOptions.findIndex((category) => category.value === auction.category)];
            }
          }
          const myAuctions = auctions[this.$store.getters.me];
          if (myAuctions.length) {
            const auction = myAuctions[myAuctions.length - 1];
            if (auction.type === Constants.BET) {
              return [0, this.categoryOptions.findIndex((category) => category.value === auction.category)];
            }
          }
        }
        return [];
      }
    },
    methods: {
      bet (bet) {
        const auction = {
          args: {
            price: bet ? bet[0] : null,
            category: bet ? bet[1] : null,
            type: bet ? Constants.BET : Constants.PASS,
            id: this.$store.getters.me
          },
          token: this.$store.getters.token
        };
        this.$store.dispatch('bet', auction);
        this.$emit('finished');
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/sizes';
  @import '../../scss/variables';
  .auctions {
    nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: auto;
      text-align: center;
      height: 65px;
      background-color: $general-background;
      transition: bottom 500ms, opacity 500ms;
      box-shadow: -1px -1px 5px rgba(0, 0, 0, 0.2);
      .nav-bet {
        margin: 0 auto;
        width: 100%;
        max-width: $max-width-main;
        line-height: 65px;
        .bet-option {
          display: inline-block;
          width: 48%;
        }
      }
    }
    &[disabled] > nav,
    nav[disabled] {
      bottom: -65px;
      opacity: 0;
    }
  }
</style>
