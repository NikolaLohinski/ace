<template>
  <div class="background">
    <div v-for="auction in displayAuctions"
         v-if="auction"
         class="auction"
         :position="auction.position">
      <span class="pass" v-if="isPass(auction)">
        {{ $t('play.pass')}}
      </span>
      <span v-else>
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
    </div>
  </div>
</template>
<script>
  import Constants from '../../json/constants.json';
  export default {
    store: global.store,
    computed: {
      auctions () {
        return this.$store.getters.game.getAuctions();
      },
      displayAuctions () {
        const game = this.$store.getters.game;
        if (!game.isBets() && !game.isWait()) return [];
        const players = this.$store.getters.players;
        return Object.values(this.auctions || {}).map((auctions) => {
          if (auctions.length && auctions.id !== game.getWhosTurn()) {
            let i = auctions.length - 1;
            while (this.isCoinche(auctions[i]) && i > -1) {
              i--;
            }
            if (i < 0) {
              return null;
            }
            const lastAuction = auctions[i];
            return {
              position: players[lastAuction.id].getPosition(),
              type: lastAuction.type,
              category: lastAuction.category,
              price: lastAuction.price
            };
          }
          return null;
        });
      }
    },
    methods: {
      isPass (auction) {
        return auction && auction.type === Constants.__BET_ACTION_PASS__;
      },
      isCoinche (auction) {
        return auction && auction.type === Constants.__BET_ACTION_COINCHE__;
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/sizes';
  $img-path: '../../img';
  @import '../../scss/images';
  .background {
    background: $center-logo center no-repeat;
    background-size: $size-center-logo $size-center-logo;
    .auction {
      width: 0; height: 0;
      position: fixed;
      pointer-events: auto;
      font-size: 15px;
      i.card-icon:before {
        width: 20px;
        height: 20px;
        top: -2px;
      }
      @include answer-to-width('s') {
        font-size: 13px;
        i.card-icon:before {
          width: 15px;
          height: 15px;
          top: -1px;
        }
      }
      > * {
        display: inline-block;
        width: 70px;
        text-align: center;
      }
      &[position='3'] {
        top: 50%; left: 30px;
        > * {
          transform: translate(0, -50%);
          text-align: left;
        }
      }
      &[position='2'] {
        top: 35px; left: 50%;
        > * {
          transform: translate(-50%, 0);
        }
      }
      &[position='1'] {
        top: 50%; right: 30px;
        > * {
          transform: translate(-100%, -50%);
          text-align: right;
        }
      }
      &[position='0'] {
        top: 100%; left: 50%; margin-top: -150px;
        > * {
          transform: translate(-50%, -100%);
        }
        @include answer-to-height('m') {
          top: 50%; left: 50%; margin-top: $size-center-logo / 2;
          > * {
            transform: translate(-50%, 0);
          }
        }
      }
      .pass {
        font-style: italic;
        color: $lighter-text-color;
      }
    }
  }
</style>
