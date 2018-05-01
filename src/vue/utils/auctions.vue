<template>
  <div class="auctions">
    <div v-for="(auction, index) in auctions" :position="index" class="bet">
      <div v-if="auction.price === 'CAP' || auction.price === 'GEN'" class="price">
        {{ $t(`play.${auction.price}`) }}
      </div>
      <span v-else class="price">
        {{ auction.price }}
      </span>
      <div v-if="auction.type === 'AA' || auction.type === 'NA'" class="type">
        {{ $t(`play.${auction.type}`) }}
      </div>
      <span v-else>
        <i :class="`card-icon ${auction.type}`" class="type">
        </i>
      </span>
    </div>
    <nav v-if="showSelector">
      <div class="nav-bet">
        <v-select class="bet-option"
                  :options="options"
                  @select="(val) => $emit('auction', val)"
                  :default="[]">
          {{ $t('play.bet') }}
        </v-select>
        <v-touch tag="button"
                 @tap="() => $emit('pass')"
                 class="cube-btn bet-option">
          {{ $t('play.pass') }}
        </v-touch>
      </div>
    </nav>
  </div>
</template>
<script>
  import vSelect from './select.vue';
  export default {
    data () {
      return {
        prices: [
          80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 'CAP', 'GEN'
        ],
        types: [
          { text: '♠', value: 's' },
          { text: '♥', value: 'h' },
          { text: '♣', value: 'c' },
          { text: '♦', value: 'd' },
          { text: this.$t('play.AA'), value: 'AA' },
          { text: this.$t('play.NA'), value: 'NA' }
        ],
        auctions: [
          { price: 120, type: 's' },
          { price: 90, type: 'c' },
          { price: 80, type: 'd' },
          { price: 'GEN', type: 'h' }
        ],
        showSelector: false
      };
    },
    components: {
      vSelect
    },
    computed: {
      options () {
        const options = [[], this.types];
        for (let k = 0; k < this.prices.length; k++) {
          const price = this.prices[k];
          options[0].push({
            text: (price === 'GEN' || price === 'CAP') ? this.$t(`play.${price}`) : price,
            value: price
          });
        }
        return options;
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  .auctions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    pointer-events: none;
    .bet {
      position: absolute;
      text-align: center;
      font-size: 12px;
      z-index: 0;
      .price {
        margin-bottom: 5px;
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
      @media screen and (max-height: 350px),
      screen and (max-device-height: 350px) {
        &[position='0'] {
          bottom: 25vh;
        }
      }
      @media screen and (max-width: 450px),
      screen and (max-device-width: 450px) {
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
  }
</style>
