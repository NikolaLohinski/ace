<template>
  <div class="scores">
    <v-header back-to="/play/offline">
      <i class="fa fa-trophy"></i>{{ $t('scores.title') }}
    </v-header>
    <div class="container">
      <table>
        <thead>
          <th class="total">{{ scores[0] }}</th>
          <th class="title">
            {{ 'scores.us' | translate }}
          </th>
          <th class="title">
            {{ 'scores.them' | translate }}
          </th>
          <th class="total">{{ scores[1] }}</th>
        </thead>
        <tr v-for="game in history">
          <td>
            <span v-if="[0, 2].indexOf(whoIsAuctioneer(game)) !== -1">
              <span class="price" v-if="['CAP', 'GEN'].indexOf(game.auction.price) !== -1">
                {{ `play.${game.auction.price}` | translate }}
              </span>
              <span class="price" v-else>
                {{ game.auction.price }}
              </span>
              <span class="category" v-if="['AA', 'NA'].indexOf(game.auction.category) !== -1">
                {{ `play.${game.auction.category}` | translate }}
              </span>
              <span class="category" v-else>
                <i :class="`card-icon ${game.auction.category}`"></i>
                <span v-if="game.belote">B</span>
              </span>
            </span>
          </td>
          <td v-if="isCapOrGen(game)" class="cap-gen"
              colspan="2" :failed="whoWon(game) !== whoIsAuctioneer(game)">
            {{ `play.${ whoWon(game) !== whoIsAuctioneer(game) ? 'lost' : 'achieved' }` | translate }}
          </td>
          <td :bold="whoWon(game) === 0" v-if="!isCapOrGen(game)">
            {{ game.scores[0] }}
          </td>
          <td :bold="whoWon(game) === 1" v-if="!isCapOrGen(game)">
            {{ game.scores[1] }}
          </td>
          <td>
            <span v-if="[1, 3].indexOf(whoIsAuctioneer(game)) !== -1">
              <span class="price" v-if="['CAP', 'GEN'].indexOf(game.auction.price) !== -1">
                {{ `play.${game.auction.price}` | translate }}
              </span>
              <span class="price" v-else>
                {{ game.auction.price }}
              </span>
              <span class="category" v-if="['AA', 'NA'].indexOf(game.auction.category) !== -1">
                {{ `play.${game.auction.category}` | translate }}
              </span>
              <span class="category" v-else>
                <i :class="`card-icon ${game.auction.category}`"></i>
              </span>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
  import vHeader from '../utils/header.vue';
  export default {
    computed: {
      players () {
        return this.$store.getters.players;
      },
      scores () {
        return this.$store.getters.game.scores;
      },
      history () {
        return this.$store.getters.game.history;
      }
    },
    methods: {
      whoWon (game) {
        const auctioneerIndex = this.players.findIndex((p) => p.id === game.auction.id);
        if ([0, 2].indexOf(auctioneerIndex) !== -1) {
          return (game.won) ? 0 : 1;
        } else {
          return (game.won) ? 1 : 0;
        }
      },
      whoIsAuctioneer (game) {
        const auctioneerIndex = this.players.findIndex((p) => p.id === game.auction.id);
        return ([0, 2].indexOf(auctioneerIndex) !== -1) ? 0 : 1;
      },
      isCapOrGen (game) {
        return ['CAP', 'GEN'].indexOf(game.auction.price) !== -1;
      }
    },
    components: {
      vHeader
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  @import '../../scss/sizes';
  .scores {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .container {
      height: calc(100% - #{$header-height} - 45px);
      -webkit-overflow-scrolling: touch;
      margin: 15px auto 0 auto;
      overflow-y: auto;
      table {
        width: 100%;
        margin: 0 auto;
        max-width: 500px;
        td, th {
          height: 50px;
          text-align: center;
          vertical-align: middle;
          &.total {
            font-family: BoldFont;
            font-size: 20px;
          }
          &[bold] {
            font-family: BoldFont;
          }
          &.title {
            color: $lighter-text-color;
            width: 30%;
          }
          &.cap-gen {
            font-family: BoldFont;
            &[failed] {
              font-family: DefaultFont;
              text-decoration: line-through;
              color: $lighter-text-color;
            }
          }
          .category, .price {
            margin: 0 2px;
          }
        }
      }
    }
  }
</style>
