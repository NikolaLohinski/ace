<template>
  <section class="offline" :vibrate="vibrate">
    <nav>
      <v-link to="offline/scores" class="menu-btn right"><i class="fa fa-trophy"></i></v-link>
      <v-link to="offline/menu" class="menu-btn left"><i class="fa fa-bars"></i></v-link>
    </nav>
    <other-player v-for="(p, i) in otherPlayers"
                  :key="p.name"
                  :name="p.name"
                  :status="p.status"
                  :playing="p.turn"
                  :position="i + 1">
    </other-player>
    <dealer-coin :position="dealer"></dealer-coin>
    <auctions :auctions="auctions"
              :forbidden-prices="forbiddenPrices"
              :show-selector="showBetSelector"
              @bet="bet">
    </auctions>
    <cards :forbidden="forbiddenCards"
           :hand="hand"
           :turn="turn"
           :starter="game.starter || game.leader"
           :move-up="showBetSelector"
           :disabled="disableCards"
           :leader="leader"
           @played="play">
    </cards>
    <buzzer :auction="game.auction"
            :show-buzzer="[constants.__GAME_STATE_BETS__, constants.__GAME_STATE_WAIT__].indexOf(game.state) !== -1"
            :disabled="!me.canCoinche"
            @hit="coinche">
    </buzzer>
  </section>
</template>
<script>
  import _consts_ from '../../json/constants.json';

  import vLink from '../utils/link.vue';
  import otherPlayer from '../utils/other-player.vue';
  import dealerCoin from '../utils/dealer-coin.vue';
  import Cards from '../utils/cards.vue';
  import Auctions from '../utils/auctions.vue';
  import Buzzer from '../utils/buzzer.vue';

  export default {
    data () {
      return {
        playerCoinche: null,
        playerSurCoinche: null,
        vibrate: false,
        timeout: -1
      };
    },
    store: global.store,
    computed: {
      constants () {
        return _consts_;
      },
      leader () {
        const leader = this.$store.getters.findLeader;
        return (leader === -1) ? this.dealer : leader;
      },
      game () {
        return this.$store.getters.game;
      },
      players () {
        return this.$store.getters.players;
      },
      me () {
        return this.players[0] || {};
      },
      hand () {
        if (!this.config.sortCards) {
          return this.me.hand;
        }
        const category = this.game.auction ? this.game.auction.category : null;
        return this.$store.getters.sortCards(this.me.hand, category);
      },
      otherPlayers () {
        return this.players.slice(1);
      },
      auctions () {
        const auctions = [];
        if ([
          this.constants.__GAME_STATE_BETS__,
          this.constants.__GAME_STATE_WAIT__
        ].indexOf(this.game.state) !== -1) {
          for (let p = 0; p < this.players.length; p++) {
            const player = this.players[p];
            if (player.auctions && p !== this.players.findIndex((e) => e.turn)) {
              auctions.push(player.auctions[player.auctions.length - 1]);
            } else {
              auctions.push(null);
            }
          }
        }
        return auctions;
      },
      showBetSelector () {
        return this.me.turn === true && this.game.state === this.constants.__GAME_STATE_BETS__;
      },
      disableCards () {
        return !(this.me.turn && this.game.state === this.constants.__GAME_STATE_PLAY__);
      },
      forbiddenCards () {
        return this.me.forbiddenCards || [];
      },
      forbiddenPrices () {
        return [].concat(this.me.forbiddenPrices) || [];
      },
      turn () {
        return this.game.turn || [null, null, null, null];
      },
      dealer () {
        return this.players.findIndex((p) => p.dealer);
      },
      config () {
        return this.$store.getters.config;
      },
      interPause () {
        return (this.game.state === this.constants.__GAME_STATE_INTER__ ||
          this.game.state === this.constants.__GAME_STATE_END__) &&
          this.me.status === this.constants.__PLAYER_STATUS_INACTIVE__;
      },
      endGame () {
        return this.game.state === this.constants.__GAME_STATE_END__;
      }
    },
    components: {
      vLink,
      otherPlayer,
      dealerCoin,
      Cards,
      Auctions,
      Buzzer
    },
    methods: {
      play (card) {
        this.$store.dispatch('act', {
          action: 'play',
          arg: card,
          token: this.game.token,
          id: this.me.id
        }).then();
      },
      bet (bet) {
        this.$store.dispatch('act', {
          action: 'bet',
          arg: bet,
          token: this.game.token,
          id: this.me.id
        }).then();
      },
      coinche (coinche) {
        this.$store.dispatch('act', {
          action: 'bet',
          arg: coinche,
          token: this.game.token,
          id: this.me.id
        }).then();
      },
      showInterGame () {
        const self = this;
        const lastGameData = self.game.history[self.game.history.length - 1];
        const myTeamIds = [this.me.id, this.players[2].id];
        let won = lastGameData['won'] && myTeamIds.indexOf(lastGameData['auction'].id) !== -1;
        won = won || !lastGameData['won'] && myTeamIds.indexOf(lastGameData['auction'].id) === -1;
        let content = '';
        if (['CAP', 'GEN'].indexOf(self.game.auction.price) !== -1) {
          const args = { auction: self.$t(`play.${self.game.auction.price}`) };
          content = won ? self.$t('play.made', args) : self.$t('play.failed', args);
        } else {
          content = self.$t('play.scoresUsThem', {
            us: lastGameData['scores'][0],
            them: lastGameData['scores'][1]
          });
          if (self.game.history[self.game.history.length - 1].belote) {
            content += `<br>${self.$t('play.withBelote')}`;
          }
        }
        self.$createDialog({
          type: 'alert',
          icon: won ? 'cubeic-good' : 'cubeic-bad',
          title: self.$t(won ? 'play.wonPhrase' : 'play.lostPhrase'),
          content: content,
          confirmBtn: self.$t('utils.continue'),
          onConfirm: () => {
            if (self.endGame) {
              self.showEndGame();
            } else {
              self.$store.dispatch('continueGame').then();
            }
          }
        }).show();
      },
      showEndGame () {
        const self = this;
        const won = self.game.scores[0] >= self.game.goal;
        setTimeout(() => {
          self.$createDialog({
            type: 'confirm',
            icon: won ? 'cubeic-vip' : 'cubeic-sad',
            title: self.$t(won ? 'play.wonGamePhrase' : 'play.lostGamePhrase'),
            content: self.$t('play.scoresUsThem', {
              us: self.game.scores[0],
              them: self.game.scores[1]
            }),
            confirmBtn: self.$t('menu.quit'),
            cancelBtn: self.$t('scores.title'),
            onConfirm () {
              self.$router.push('/');
            },
            onCancel () {
              self.$router.push('/play/offline/scores');
            }
          }).show();
        }, 200);
      }
    },
    watch: {
      interPause (interPause) {
        if (interPause) {
          this.showInterGame();
          this.playerCoinche = null;
          this.playerSurCoinche = null;
        }
      },
      players: {
        deep: true,
        handler (newPlayers) {
          if ([this.constants.__GAME_STATE_WAIT__, this.constants.__GAME_STATE_BETS__].indexOf(this.game.state) !== -1) {
            if (!this.playerCoinche) {
              const coincheIndex = newPlayers.findIndex((p) => p.coinche);
              if (coincheIndex !== -1) this.playerCoinche = newPlayers[coincheIndex];
            }
            if (!this.playerSurCoinche && this.playerCoinche) {
              const surCoincheIndex = newPlayers.findIndex((p) => p.coinche && p.id !== this.playerCoinche.id);
              if (surCoincheIndex !== -1) this.playerSurCoinche = newPlayers[surCoincheIndex];
            }
          }
        }
      },
      playerCoinche (player) {
        const self = this;
        if (player) {
          self.$createToast({
            type: 'warn',
            time: 3000,
            txt: self.$t('play.playerCoinched', { player: player.name }),
            mask: true,
            maskClosable: true
          }).show();
          this.vibrate = 1;
        }
      },
      playerSurCoinche (player) {
        const self = this;
        if (player) {
          self.$createToast({
            type: 'warn',
            time: 3000,
            txt: self.$t('play.playerSurCoinched', { player: player.name }),
            mask: true,
            maskClosable: true
          }).show();
          this.vibrate = true;
        }
      },
      vibrate (vibrate) {
        if (vibrate) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.vibrate = false;
            this.timeout = -1;
          }, 1000);
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      const self = this;
      if (to.path.indexOf('/offline') === -1) {
        if (self.game.state === self.constants.__GAME_STATE_END__) {
          self.$store.dispatch('clearGame').then(next);
        } else {
          self.$createDialog({
            type: 'confirm',
            icon: 'cubeic-danger',
            title: self.$t('utils.warning'),
            content: self.$t('menu.youWillLoseYourCurrentProgress'),
            confirmBtn: self.$t('menu.quit'),
            cancelBtn: self.$t('utils.cancel'),
            onConfirm: () => {
              this.$store.dispatch('clearGame').then(next);
            }
          }).show();
        }
      } else {
        this.$store.dispatch('afk', true).then(next);
      }
    },
    mounted () {
      const self = this;
      self.$store.dispatch('initGame').then();
      setTimeout(() => {
        if (self.interPause) self.showInterGame();
      }, 200);
      if (this.config.sortCards === undefined) {
        this.$store.commit('setConfig', {
          key: 'sortCards',
          value: true
        });
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/colors';
  .offline {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $center-logo center no-repeat;
    background-size: $size-center-logo $size-center-logo;
    &[vibrate] {
      animation-name: shake;
      animation-duration: 1s;
      transform-origin:50% 50%;
      animation-timing-function: linear;
    }
    nav {
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      padding: 15px 0;
      .menu-btn {
        position: absolute;
        min-width: 50px;
        text-align: center;
        display: inline-block;
        font-size: 30px;
        pointer-events: auto;
        text-shadow: 1px 1px 2px $default-text-color;
        &.right {
          right: 5px;
        }
        &.left {
          left: 5px;
        }
      }
    }
    @keyframes shake {
      0% { -webkit-transform: translate(2px, 1px) rotate(0deg); }
      10% { -webkit-transform: translate(-1px, -2px) rotate(-1deg); }
      20% { -webkit-transform: translate(-3px, 0px) rotate(1deg); }
      30% { -webkit-transform: translate(0px, 2px) rotate(0deg); }
      40% { -webkit-transform: translate(1px, -1px) rotate(1deg); }
      50% { -webkit-transform: translate(-1px, 2px) rotate(-1deg); }
      60% { -webkit-transform: translate(-3px, 1px) rotate(0deg); }
      70% { -webkit-transform: translate(2px, 1px) rotate(-1deg); }
      80% { -webkit-transform: translate(-1px, -1px) rotate(1deg); }
      90% { -webkit-transform: translate(2px, 2px) rotate(0deg); }
      100% { -webkit-transform: translate(1px, -2px) rotate(-1deg); }
    }
  }
</style>
