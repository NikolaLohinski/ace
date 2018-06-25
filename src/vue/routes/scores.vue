<template>
  <div class="scores">
    <v-header back-to="/play/offline">
      <i class="fa fa-trophy"></i>{{ $t('scores.title') }}
    </v-header>
    <div class="container">
      <table>
        <thead>
          <th class="index"></th>
          <th class="total">{{ scores[0] }}</th>
          <th class="coinche"></th>
          <th class="title">
            {{ 'scores.us' | translate }}
          </th>
          <th class="title">
            {{ 'scores.them' | translate }}
          </th>
          <th class="coinche"></th>
          <th class="total">{{ scores[1] }}</th>
        </thead>
        <tbody>
          <tr v-for="(game,index) in [].concat(history).reverse()">
          <td class="index">{{ history.length - index }}</td>
          <td :stroke="whoWon(game) === 1 && [0, 2].indexOf(whoIsAuctioneer(game)) !== -1">
            <span v-if="[0, 2].indexOf(whoIsAuctioneer(game)) !== -1">
              <span class="price" v-if="['CAP', 'GEN'].indexOf(game.auction.price) !== -1">
                {{ `play.${game.auction.price}` | translate }}
              </span>
              <span class="price" v-else>
                {{ game.auction.price }}
              </span>
              <span class="category">
                <i :class="`card-icon ${game.auction.category}`"></i>
                <span v-if="game.belote">B</span>
              </span>
            </span>
          </td>
          <td class="coinche">
            <i class="logo" v-if="usCoinche(game)"></i>
          </td>
          <td v-if="isCapOrGen(game)" class="cap-gen"
              colspan="2" :failed="whoWon(game) !== whoIsAuctioneer(game)">
            {{ `play.${ whoWon(game) !== whoIsAuctioneer(game) ? 'lost' : 'achieved' }` | translate }}
          </td>
          <td :bold="whoWon(game) === 0" v-if="!isCapOrGen(game)" class="score">
            {{ game.scores[0] }}
          </td>
          <td :bold="whoWon(game) === 1" v-if="!isCapOrGen(game)" class="score">
            {{ game.scores[1] }}
          </td>
          <td class="coinche">
            <i class="logo" v-if="themCoinche(game)"></i>
          </td>
          <td :stroke="whoWon(game) === 0 && [1, 3].indexOf(whoIsAuctioneer(game)) !== -1">
            <span v-if="[1, 3].indexOf(whoIsAuctioneer(game)) !== -1">
              <span class="price" v-if="['CAP', 'GEN'].indexOf(game.auction.price) !== -1">
                {{ `play.${game.auction.price}` | translate }}
              </span>
              <span class="price" v-else>
                {{ game.auction.price }}
              </span>
              <span class="category">
                <i :class="`card-icon ${game.auction.category}`"></i>
              </span>
            </span>
          </td>
        </tr>
        </tbody>
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
      },
      usCoinche (game) {
        let usCoinche = false;
        if (game.coinche || game.surCoinche) {
          const auctioneerIndex = this.players.findIndex((p) => p.id === game.auction.id);
          usCoinche = ([0, 2].indexOf(auctioneerIndex) !== -1 && game.surCoinche) ||
          ([1, 3].indexOf(auctioneerIndex) !== -1 && game.coinche);
        }
        return usCoinche;
      },
      themCoinche (game) {
        let themCoinche = false;
        if (game.coinche || game.surCoinche) {
          const auctioneerIndex = this.players.findIndex((p) => p.id === game.auction.id);
          themCoinche = ([1, 3].indexOf(auctioneerIndex) !== -1 && game.surCoinche) ||
          ([0, 2].indexOf(auctioneerIndex) !== -1 && game.coinche);
        }
        return themCoinche;
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
  $img-path: '../../img';
  @import '../../scss/images';
  .scores {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .container {
      height: calc(100% - #{$header-height} - 45px);
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      margin: 5px auto 0 auto;
      table {
        width: 100%;
        margin: 0 auto;
        max-width: $max-width-main;
        td, th {
          position: relative;
          height: 50px;
          text-align: center;
          vertical-align: middle;
          border-bottom: 1px solid $default-border-color;
          &.total {
            font-family: BoldFont;
            font-size: 35px;
            width: 35%;
            &:nth-child(2) {
              width: 32%;
            }
          }
          &.index {
            width: 3%;
            font-size: 10px;
            text-align: right;
            color: $lighter-text-color;
          }
          &[bold] {
            font-family: BoldFont;
            color: $danger-link-color;
          }
          &.title {
            color: $lighter-text-color;
            width: 10%;
            font-size: 14px;
          }
          &.score {
            font-size: 12px;
          }
          &.coinche {
            position: relative;
            width: 5%;
            .logo {
              position: absolute;
              top: 50%;
              left: 50%;
              margin: -10px 0 0 -10px;
              display: block;
              width: 20px;
              height: 20px;
              background: $ace-logo center no-repeat;
              background-size: 100%;
            }
          }
          &.cap-gen {
            font-family: BoldFont;
            &[failed] {
              font-family: DefaultFont;
              text-decoration: line-through;
              color: $lighter-text-color;
            }
          }
          .category,
          .price {
            margin: 0 2px;
          }
          .category i:before {
            width: 20px;
            height: 20px;
            margin-top: -7px;
            top: 1px;
          }
          &[stroke]:after {
            content: '';
            width: 50%;
            height: 3px;
            background-color: $default-text-color;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-20deg);
          }
        }
      }
    }
  }
</style>
