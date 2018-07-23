<template>
</template>
<script>
  export default {
    data () {
      return {};
    },
    store: global.store,
    computed: {
      endGame () {
        return this.$store.getters.game.isEnd();
      },
      interGame () {
        return this.$store.getters.game.isInter();
      },
      order () {
        return this.$store.getters.game.getOrder();
      },
      lastAuction () {
        return this.$store.getters.game.getLastAuction();
      },
      coinche () {
        if (!this.lastAuction) return null;
        const defense = this.$store.getters.game.getDefense();
        return defense.find((id) => this.$store.getters.game.getDidCoinche()[id]);
      },
      counterCoinche () {
        if (!this.lastAuction) return null;
        const offense = this.$store.getters.game.getOffense();
        return offense.find((id) => this.$store.getters.game.getDidCoinche()[id]);
      }
    },
    methods: {
      notifyInterGame () {
        if (!this.$store.getters.game.getLastAuction()) {
          this.notifyNotPlayed();
        } else {
          this.notifySessionFinished();
        }
      },
      notifyNotPlayed () {
        this.$createDialog({
          type: 'alert',
          icon: 'cubeic-alert',
          title: this.$t('play.gameCanceled'),
          content: this.$t('play.noAuctionsPhrase'),
          confirmBtn: this.$t('utils.continue'),
          onConfirm: () => {
            this.$store.dispatch('restart');
          }
        }).show();
      },
      notifySessionFinished () {
        const lastSession = this.$store.getters.game.getLastSession();
        const me = this.$store.getters.me;
        const us = [me, this.$store.getters.game.getPartner(me)];
        const won = lastSession.winners.indexOf(me) !== -1;
        const auction = lastSession.lastAuction;
        const name = this.$store.getters.players[auction.id].getName();
        const madeFailedMsg = lastSession.winners.indexOf(auction.id) !== -1 ? 'play.made' : 'play.failed';
        const title = won ? this.$t('play.wonPhrase') : this.$t('play.lostPhrase');
        const contractFate = this.$t(madeFailedMsg, { name });
        const auctionDetail = ['CAP', 'GEN'].includes(auction.price)
          ? this.$t('play.auctionAt', { auction: this.$t(`play.${auction.price}`), name })
          : this.$t('play.auctionAt', { auction: auction.price, name });
        const belote = lastSession.belote;
        const scores = ['CAP', 'GEN'].includes(auction.price) ? ''
          : this.$t('play.scoresUsThem', {
            us: us.includes(auction.id) ? lastSession.offense : lastSession.defense,
            them: us.includes(auction.id) ? lastSession.defense : lastSession.offense
          });
        const content = `
        <div class="notification contract-fate">${contractFate}</div>
        <div class="notification auction-details">
          ${auctionDetail}
          <i class="notification card-icon ${auction.category}"></i>
        </div>
        <div class="notification belote">${belote ? this.$t('play.withBelote') : ''}</div>
        <div class="notification scores">${scores}</div>
        `;
        this.$createDialog({
          type: 'alert',
          icon: won ? 'cubeic-good' : 'cubeic-bad',
          title,
          content,
          confirmBtn: this.$t('utils.continue'),
          onConfirm: () => {
            if (this.endGame) {
              setTimeout(this.notifyEnd, 200);
            } else {
              setTimeout(() => this.$store.dispatch('restart').then(), 1000);
            }
          }
        }).show();
      },
      notifyEnd () {
        const me = this.$store.getters.me;
        const game = this.$store.getters.game;
        const ourScore = game.getScores()[me];
        const them = game.getOrder().filter((id) => ![me, game.getPartner(me)].includes(id));
        const theirScore = game.getScores()[them[0]];
        const won = game.getScores()[me] >= game.getGoal();
        this.$createDialog({
          type: 'confirm',
          icon: won ? 'cubeic-vip' : 'cubeic-sad',
          title: this.$t(won ? 'play.wonGamePhrase' : 'play.lostGamePhrase'),
          content: this.$t('play.scoresUsThem', {
            us: ourScore,
            them: theirScore
          }),
          confirmBtn: this.$t('menu.quit'),
          cancelBtn: this.$t('scores.title'),
          onConfirm: () => {
            this.$router.push('/');
          },
          onCancel: () => {
            this.$router.push('/play/offline/scores');
          }
        }).show();
      }
    },
    watch: {
      interGame (isInterGame) {
        if (isInterGame) setTimeout(this.notifyInterGame, 1000);
      },
      endGame (endGame) {
        if (endGame) setTimeout(this.notifyInterGame, 1000);
      },
      coinche (id) {
        if (id) {
          const name = this.$store.getters.players[id].getName();
          this.$createToast({
            type: 'warn',
            time: 3000,
            txt: this.$t('play.playerCoinched', { player: name }),
            mask: true,
            maskClosable: true
          }).show();
          document.body.setAttribute('shake', true);
          setTimeout(() => document.body.removeAttribute('shake'), 1500);
        }
      },
      counterCoinche (id) {
        if (id) {
          const name = this.$store.getters.players[id].getName();
          this.$createToast({
            type: 'warn',
            time: 3000,
            txt: this.$t('play.playerCounterCoinched', { player: name }),
            mask: true,
            maskClosable: true
          }).show();
          document.body.setAttribute('shake', true);
          setTimeout(() => document.body.removeAttribute('shake'), 1500);
        }
      }
    },
    mounted () {
      if (this.interGame || this.endGame) this.notifyInterGame();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
  @import '../../scss/colors';
  body[shake] {
    animation: shake .8s infinite ease;
    transform-origin: 50% 50%;
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
  .notification {
    &.auction-details {
      i.card-icon:before {
        height: 20px;
        width: 20px;
      }
    }
    &.belote {
      font-size: 13px;
      color: $lighter-text-color;
      font-style: italic;
    }
    &.scores {
      color: $lighter-text-color;
      font-size: 12px;
    }
  }
</style>
