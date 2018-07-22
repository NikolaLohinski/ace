<template>
  <div class="cards" :disabled="disabled">
    <transition name="fade-delayed-enter">
    <v-touch tag="div" id="show-last-fold" v-if="allowLastFold" @tap.prevent="showLastFold(true)">
    </v-touch>
    </transition>
    <v-touch tag="div" @tap.prevent="expand" id="fold" :expanded="expanded">
    </v-touch>
    <div id="hand" :higher="higher">
    </div>
    <transition name="fade">
    <v-touch tag="div" @tap.prevent="showLastFold(false)"
             class="veil" v-if="displayLastFold"></v-touch>
    </transition>
    <transition name="fade">
    <div id="last-fold" v-if="displayLastFold">
    </div>
    </transition>
  </div>
</template>
<script>
  import Deck from 'deck-of-cards';
  import InteractJS from 'interactjs';
  import saveState from 'vue-save-state';
  global.__zIndex = global.__zIndex || 0;
  const __suitMapping = { 0: 's', 1: 'h', 2: 'c', 3: 'd' };
  const __nameMapping = { 1: 'a', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'j', 12: 'q', 13: 'k' };
  const __Deck = Deck(false).cards.filter((c) => {
    return c['rank'] > 6 || c['rank'] === 1;
  }).reduce((deck, c) => {
    deck[__nameMapping[c['rank']] + __suitMapping[c['suit']]] = c;
    return deck;
  }, {});
  export default {
    data () {
      return {
        handCards: [],
        foldCards: {},
        expanded: false,
        displayLastFold: false
      };
    },
    mixins: [saveState],
    store: global.store,
    computed: {
      me () {
        return this.$store.getters.players[this.$store.getters.me];
      },
      hand () {
        return this.me.getHand() || [];
      },
      fold () {
        return this.$store.getters.game.getFold();
      },
      lastFold () {
        return this.$store.getters.game.getLastFold() || {};
      },
      sortedCards () {
        return this.$store.getters.sort(this.handCards);
      },
      higher () {
        return this.$store.getters.game.isBets() && this.$store.getters.game.getWhosTurn() === this.$store.getters.me;
      },
      disabled () {
        const game = this.$store.getters.game;
        return !game.isPlay() || (game.isPlay() && game.getWhosTurn() !== this.me.getId());
      },
      where () {
        return this.$store.getters.position;
      },
      allowLastFold () {
        return !this.disabled && this.$store.getters.game.getLastFold();
      }
    },
    methods: {
      mountHand (hand) {
        for (const name of hand) {
          __Deck[name].setSide('front');
          __Deck[name].mount(document.getElementById('hand'));
          this.setEventsCard(__Deck[name]);
          if (this.handCards.indexOf(name) === -1) this.handCards.push(name);
        }
        this.handCards = this.handCards.reduce((cards, name) => {
          if (hand.indexOf(name) === -1) {
            if (__Deck[name].$move) __Deck[name].$move.unset();
            __Deck[name].unmount();
            return cards;
          }
          return cards.concat(name);
        }, []);
        this.refresh();
      },
      setEventsCard (card) {
        if (!card.$move) {
          card.$move = InteractJS(card.$el)
          .on('dragstart', (event) => {
            global.__zIndex++;
            global.__zIndexFloating = event.target.style.zIndex;
            event.target.style.zIndex = global.__zIndex;
            event.target.style.transition = 'none';
          })
          .on('dragend', (event) => {
            if (this.me.getPlayed() !== this.getCardName(card)) {
              global.__zIndex--;
              event.target.style.zIndex = global.__zIndexFloating;
              event.target.style.transition = '';
            }
          })
          .on('dragmove', (event) => this.place(event.target, event));
        }
      },
      reference (element, index) {
        const hand = document.getElementById('hand');
        const D = parseFloat(hand.clientWidth);
        const c = parseFloat(element.clientWidth);
        const i = parseFloat(index);
        const n = parseFloat(this.hand.length);
        const cMin = Math.min(c, D / n);
        const delta = (D + (2 * i - n) * cMin) / 2;
        return {
          x: (i === 0) ? delta : delta - (c - cMin) / (n - 1),
          y: hand.clientHeight - element.clientHeight
        };
      },
      place (element, motion, fromOrigin = false) {
        let x, y;
        if (fromOrigin) {
          x = y = 0;
        } else {
          x = parseFloat(element.getAttribute('data-x') || 0);
          y = parseFloat(element.getAttribute('data-y') || 0);
        }
        if (motion) {
          x += motion.dx;
          y += motion.dy;
        }
        element.style.webkitTransform = `translate(${x}px, ${y}px)`;
        element.style.transform = `translate(${x}px, ${y}px)`;
        element.setAttribute('data-x', x);
        element.setAttribute('data-y', y);
      },
      refresh () {
        const forbiddenCards = this.$store.getters.whatForbiddenCards(this.$store.getters.me);
        this.sortedCards.forEach((name, index) => {
          if (forbiddenCards.indexOf(name) !== -1) {
            __Deck[name].$el.setAttribute('forbidden', true);
          } else {
            __Deck[name].$el.removeAttribute('forbidden');
          }
          const reference = this.reference(__Deck[name].$el, index);
          __Deck[name].$move.draggable({
            snap: {
              targets: [
                () => {
                  const hand = document.getElementById('hand');
                  return {
                    x: reference.x,
                    y: reference.y + hand.offsetTop
                  };
                },
                () => {
                  const fold = document.getElementById('fold');
                  return {
                    x: fold.offsetLeft - __Deck[name].$el.clientWidth / 2,
                    y: fold.offsetTop
                  };
                }
              ],
              range: Infinity,
              relativePoints: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
              endOnly: true
            },
            restrict: {
              restriction: document.body
            },
            inertia: {
              resistance: 20
            }
          });
          this.place(__Deck[name].$el, {
            dx: reference.x + __Deck[name].$el.clientWidth / 2,
            dy: reference.y + __Deck[name].$el.clientHeight / 2
          }, true);
          __Deck[name].$move.$card = __Deck[name];
          global.__zIndex += index;
          __Deck[name].$el.style.zIndex = global.__zIndex;
        });
      },
      setDropZone () {
        const self = this;
        self.fold_ = InteractJS('#fold').dropzone({
          overlap: 0.000001,
          ondrop (event) {
            const name = self.getCardName(event.draggable.$card);
            __Deck[name].$el.setAttribute('played', true);
            self.$store.dispatch('play', {
              token: self.$store.getters.token,
              args: {
                card: name,
                id: self.$store.getters.me
              }
            });
            self.refresh();
          }
        });
      },
      playCard (id, name) {
        const position = this.$store.getters.players[id].getPosition();
        __Deck[name].setSide('front');
        __Deck[name].mount(document.getElementById('fold'));
        __Deck[name].$el.style.transform = `translate(-50%, -50%)`;
        global.__zIndex++;
        __Deck[name].$el.style.zIndex = global.__zIndex;
        if (!this.foldCards[name] && this.foldCards[id] !== name) {
          __Deck[name].$el.setAttribute('side', this.where(position));
          setTimeout(() => {
            __Deck[name].$el.setAttribute('enter', this.where(position));
          }, 0);
        } else {
          __Deck[name].$el.setAttribute('enter', this.where(position));
        }
        this.$set(this.foldCards, id, name);
      },
      finishFold () {
        const order = this.$store.getters.game.getOrder();
        if (order) {
          const lastPlayerId = order.find((id) => this.foldCards[id] !== this.lastFold[id]);
          if (lastPlayerId) {
            this.playCard(lastPlayerId, this.lastFold[lastPlayerId]);
            setTimeout(this.closeFold, 1250, this.$store.getters.players[this.lastFold.winner].getPosition());
          }
        }
      },
      closeFold (position) {
        const self = this;
        const couples = Object.keys(self.foldCards).map((key) => [key, this.lastFold[key]]);
        couples.forEach(([id, name]) => {
          const clearCard = () => {
            __Deck[name].unmount();
            ['leave', 'enter', 'forbidden', 'side', 'played'].forEach((attr) => {
              __Deck[name].$el.removeAttribute(attr);
            });
            __Deck[name].$el.removeEventListener('transitionend', clearCard);
          };
          __Deck[name].$el.addEventListener('transitionend', clearCard);
          __Deck[name].$el.setAttribute('leave', this.where(position));
        });
        self.foldCards = {};
      },
      getCardName (c) {
        return __nameMapping[c['rank']] + __suitMapping[c['suit']];
      },
      getSaveStateConfig () {
        return {
          cacheKey: 'cards',
          saveProperties: ['handCards', 'foldCards']
        };
      },
      expand () {
        this.expanded = !this.expanded;
        setTimeout(() => {
          this.expanded = false;
        }, 1500);
      },
      showLastFold (show) {
        this.displayLastFold = show;
        if (show) {
          setTimeout(() => {
            const order = this.$store.getters.game.getOrder();
            const starter = order.indexOf(this.lastFold.starter);
            for (let k = 0; k < order.length; k++) {
              const id = order[(k + starter) % 4];
              const name = this.lastFold[id];
              const position = this.$store.getters.players[id].getPosition();
              __Deck[name].setSide('front');
              __Deck[name].mount(document.getElementById('last-fold'));
              __Deck[name].$el.style.transform = `translate(-50%, -50%)`;
              global.__zIndex++;
              __Deck[name].$el.style.zIndex = global.__zIndex;
              __Deck[name].$el.setAttribute('side', this.where(position));
              __Deck[name].$el.setAttribute('enter', this.where(position));
            }
          }, 0);
        } else {
          const order = this.$store.getters.game.getOrder();
          const starter = order.indexOf(this.lastFold.starter);
          for (let k = 0; k < order.length; k++) {
            const id = order[(k + starter) % 4];
            const name = this.lastFold[id];
            setTimeout(() => {
              __Deck[name].unmount();
              ['leave', 'enter', 'forbidden', 'side', 'played'].forEach((attr) => {
                __Deck[name].$el.removeAttribute(attr);
              });
            }, 250);
          }
        }
      }
    },
    watch: {
      hand: {
        deep: true,
        handler (hand) {
          this.mountHand(hand);
        }
      },
      fold: {
        deep: true,
        handler (fold) {
          const starter = this.$store.getters.game.getStarter();
          const order = this.$store.getters.game.getOrder();
          for (let k = 0; k < order.length; k++) {
            const id = order[(order.indexOf(starter) + k) % 4];
            if (fold.hasOwnProperty(id)) {
              if (fold[id]) {
                this.playCard(id, fold[id]);
              }
            }
          }
          if (Object.values(fold).every((card) => card === null)) {
            this.finishFold();
          }
          this.refresh();
        }
      }
    },
    mounted () {
      window.addEventListener('orientationchange', this.refresh);
      window.addEventListener('resize', this.refresh);
      this.mountHand(this.hand);
      this.setDropZone();
    },
    beforeDestroy () {
      window.removeEventListener('orientationchange', this.refresh);
      window.removeEventListener('resize', this.refresh);
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
  @import '../../scss/variables';
  @import '../../../node_modules/deck-of-cards/example/example.css';
  @import '../../scss/colors';
  @import '../../scss/sizes';
  $img-path: '../../img';
  @import '../../scss/images';
  $card-animation-duration: 1s;
  .cards {
    #hand {
      position: fixed;
      height: 100px;
      bottom: 0; left: 0; right: 0;
      pointer-events: auto;
      .card {
        box-shadow: $cards-box-shadow;
        border: 1px solid $cards-border-color;
        transition: filter 200ms ease, margin-top 200ms ease, transform 200ms;
        &[played] {
          pointer-events: none;
        }
      }
      transition: bottom 500ms ease;
      @include answer-to-height('m') { bottom: -50px; }
      &[higher] {
        bottom: 70px;
        @include answer-to-height('m') { bottom: 20px }
      }
      .card[forbidden] {
        filter: brightness(0.6);
        margin-top: 15px;
        pointer-events: none !important;
      }
    }
    &[moveup] #hand {
      bottom: 273px !important;
    }
    #fold, #last-fold {
      position: fixed;
      pointer-events: auto;
      width: 100px; height: 100px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
      .card {
        transition: top $card-animation-duration ease,
                    left $card-animation-duration ease,
                    margin-top 200ms ease,
                    margin-left 200ms ease;
        &[side='1'] { top: 50% ; left: 100vw; }
        &[side='2'] { top: -100vh ; left: 50%; }
        &[side='3'] { top: 50% ; left: -100vw; }
        &[enter='1'] { top: 50% ; left: 100%; }
        &[enter='2'] { top: 0 ; left: 50%; }
        &[enter='3'] { top: 50% ; left: 0; }
        &[enter='0'], &[side='0'] { top: 100%; left: 50%; }
        &[leave='0'] { top: 100vh ; left: 50% ; }
        &[leave='1'] { top: 50% ; left: 100vw ; }
        &[leave='2'] { top: -100vh ; left: 50% ; }
        &[leave='3'] { top: 50% ; left: -100vw ; }
        &[leave] { margin: 0 !important;}
      }
      &[expanded] .card {
        $expand: $size-center-logo / 2;
        &[enter='1'] { margin-left: $expand - 20px}
        &[enter='2'] { margin-top: -$expand - 10px }
        &[enter='3'] { margin-left: -$expand + 20px}
        &[enter='0'] { margin-top: $expand + 10px}
      }
    }
    &[disabled] * {
      pointer-events: none !important;
    }
    #last-fold {
      pointer-events: none !important;
      transition: opacity .25s ease;
      opacity: 1;
      &.fade-enter, &.fade-leave-to {
        opacity: 0;
      }
    }
    .veil {
      pointer-events: auto;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background-color: $general-background-opaque;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    #show-last-fold {
      pointer-events: auto;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: $size-center-logo / 2 + 15px;
      width: 60px;
      height: 60px;
      opacity: 0.9;
      background: $last-fold-icon center no-repeat;
      background-size: 75%;
      &:active {
        background: $last-fold-icon-active center no-repeat;
        background-size: 75%;
      }
      cursor: pointer;
      @include answer-to-height('m') {
        background-size: 50%;
        margin-top: $size-center-logo / 2 + 5px;
        &:active {
          background: $last-fold-icon-active center no-repeat;
          background-size: 50%;
        }
      }
      @include answer-to-height('s') {
        margin-top: $size-center-logo / 2 - 5px;
      }
      &.fade-delayed-enter-enter, &.fade-delayed-enter-leave-to {
        opacity: 0;
        pointer-events: none;
      }
      &.fade-delayed-enter-enter-active {
        transition: opacity .25s .5s ease;
      }
      &.fade-delayed-enter-leave-active {
        transition: opacity .25s ease;
      }
    }
  }
</style>
