<template>
  <transition name="fade">
  <div class="belote" v-if="enable && display">
    <blockquote class="bubble" :position="where(position)">
      <div class="text">
        {{ message }}
      </div>
    </blockquote>
  </div>
  </transition>
</template>
<script>
  import saveState from 'vue-save-state';
  const TIMEOUTBUBBLE = 4000;
  export default {
    data () {
      return {
        message: null,
        display: false
      };
    },
    mixins: [saveState],
    store: global.store,
    computed: {
      enable () {
        if (!this.game.isPlay() || !this.game.getLastAuction()) return false;
        const lastAuction = this.game.getLastAuction();
        return !['AA', 'NA'].includes(lastAuction.category);
      },
      where () {
        return this.$store.getters.position;
      },
      who () {
        if (!this.enable) return null;
        let who = null;
        const category = this.game.getLastAuction().category;
        Object.values(this.$store.getters.players).forEach((player) => {
          const hand = [].concat(player.getHand());
          if (player.getPlayed()) {
            hand.push(player.getPlayed());
          }
          const cards = this.game.getFolds().reduce((all, fold) => {
            return all.concat(fold[player.getId()]);
          }, hand);
          if (cards.includes(`k${category}`) && cards.includes(`q${category}`)) {
            who = player.getId();
          }
        });
        return who;
      },
      game () {
        return this.$store.getters.game;
      },
      card () {
        if (!this.who) {
          return null;
        } else if (this.game.getFold()[this.who]) {
          return this.game.getFold()[this.who];
        } else if (this.game.getLastFold()) {
          return this.game.getLastFold()[this.who];
        }
        return null;
      },
      position () {
        return this.who ? this.$store.getters.players[this.who].getPosition() : null;
      }
    },
    methods: {
      show () {
        if (this.game.getLastAuction()) {
          const card = this.card;
          const category = this.game.getLastAuction().category;
          if ([`k${category}`, `q${category}`].includes(card)) {
            if (this.message === null) {
              this.message = this.$t('play.belote');
            } else {
              this.message = this.$t('play.rebelote');
            }
            this.display = true;
            setTimeout(() => {
              this.display = false;
            }, TIMEOUTBUBBLE);
          }
        }
      },
      getSaveStateConfig () {
        return {
          cacheKey: 'belote',
          saveProperties: ['message']
        };
      }
    },
    watch: {
      card (card) {
        if (card) {
          this.show();
        }
      },
      enable (enable) {
        if (!enable) this.message = null;
      }
    },
    mounted () {
      if (!this.enable) this.message = null;
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  @import '../../scss/sizes';
  .belote {
    .bubble {
      position: fixed;
      width: 80px;
      height: 40px;
      font-size: 13px;
      font-style: italic;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
      $tail: 15px;
      &:before {
        z-index: -1;
        content: '';
        position: absolute;
        height: $tail;
        background: $lighter-background;
      }
      &:after {
        z-index: -1;
        content: '';
        position: absolute;
        height: $tail;
        width: 2*$tail;
        background: $general-background;
      }
      .text {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: $lighter-background;
      }
      &[position='3'] {
        top: 50%; left: 30px; transform: translate(0, 15px);
        &:before {
          border-right: 20px solid $lighter-background;
          border-top-right-radius: 40px;
          top: -10px;
          right: 50px;
        }
        &:after {
          top: -11px;
          border-top-right-radius: 40px;
          right: 61px;
          transform: rotate(15deg);
        }
      }
      &[position='2'] {
        top: 45px; left: 50%; transform: translate(-100px, 0);
        &:before {
          border-left: 20px solid $lighter-background;
          border-top-left-radius: 40px;
          top: -10px;
          left: 50px;
        }
        &:after {
          top: -11px;
          border-top-left-radius: 40px;
          left: 61px;
          transform: rotate(-15deg);
        }
      }
      &[position='1'] {
        top: 50%; right: 30px; transform: translate(0, 15px);
        &:before {
          border-left: 20px solid $lighter-background;
          border-top-left-radius: 40px;
          top: -10px;
          left: 50px;
        }
        &:after {
          top: -11px;
          border-top-left-radius: 40px;
          left: 61px;
          transform: rotate(-15deg);
        }
      }
      &[position='0'] {
        top: 100%; left: 50%; margin-top: -175px; transform: translate(50px, 0);
        @include answer-to-height('m') {
          margin-top: -130px;
        }
        @include answer-to-height('s') {
          margin-top: -105px;
        }
        &:before {
          border-right: 20px solid $lighter-background;
          border-bottom-right-radius: 40px;
          bottom: -10px;
          right: 50px;
          box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        }
        &:after {
          bottom: -8px;
          border-bottom-right-radius: 40px;
          right: 61px;
          transform: rotate(15deg);
        }
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
