<template>
  <div class="cards" :disabled="disabled">
    <div id="fold">
    </div>
    <div id="hand" :higher="higher">
    </div>
  </div>
</template>
<script>
  let __zIndex = 1;
  const __namespace = 'browser-store__cards';
  const __suitMapping = { 0: 's', 1: 'h', 2: 'c', 3: 'd' };
  const __nameMapping = { 1: 'a', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'j', 12: 'q', 13: 'k' };
  import InteractJS from 'interactjs';
  import Deck from 'deck-of-cards';
  const __Deck = Deck(false).cards.filter((c) => {
    return c['rank'] > 6 || c['rank'] === 1;
  }).reduce((deck, c) => {
    deck[__nameMapping[c['rank']] + __suitMapping[c['suit']]] = c;
    return deck;
  }, {});
  export default {
    data () {
      return {
        hand_: [],
        fold_: null,
        foldCards: this.$load('foldCards') || {},
        lastFold: this.$load('lastFold') || {}
      };
    },
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
      higher () {
        return this.$store.getters.game.isBets() && this.$store.getters.game.getWhosTurn() === this.$store.getters.me;
      },
      disabled () {
        const game = this.$store.getters.game;
        return !game.isPlay() || (game.isPlay() && game.getWhosTurn() !== this.me.getId());
      }
    },
    methods: {
      mount (hand) {
        for (const name of this.$store.getters.sort(hand)) {
          if (this.hand_.findIndex((c) => this.getCardName(c.$deckCard) === name) === -1) {
            const deckCard = __Deck[name];
            deckCard.setSide('front');
            deckCard.mount(document.getElementById('hand'));
            const card = this.build(deckCard);
            card.$deckCard = deckCard;
            this.hand_.push(card);
          }
        }
        for (let index = 0; index < this.hand_.length; index++) {
          const card = this.hand_[index];
          if (hand.findIndex((c) => this.getCardName(card.$deckCard) === c) === -1) {
            card.unset();
            card.$deckCard.unmount();
            this.hand_.splice(index, 1);
          }
        }
        this.refresh();
      },
      reference (HTMLCard, index) {
        const hand = document.getElementById('hand');
        const D = parseFloat(hand.clientWidth);
        const c = parseFloat(HTMLCard.clientWidth);
        const i = parseFloat(index);
        const n = parseFloat(this.hand.length);
        const cMin = Math.min(c, D / n);
        const delta = (D + (2 * i - n) * cMin) / 2;
        return {
          x: (i === 0) ? delta : delta - (c - cMin) / (n - 1),
          y: hand.clientHeight - HTMLCard.clientHeight
        };
      },
      build (deckCard) {
        const card = deckCard.$el;
        const interactable = InteractJS(card)
          .on('dragstart', (event) => {
            __zIndex++;
            event.target.style.zIndex = __zIndex;
          })
          .on('dragend', (event) => {
            if (this.me.getPlayed() !== this.getCardName(deckCard)) {
              __zIndex--;
              event.target.style.zIndex = __zIndex;
            }
          })
          .on('dragmove', (event) => this.place(event.target, event));
        interactable.target.style.zIndex = __zIndex;
        return interactable;
      },
      place (HTMLCard, $event, initialize) {
        let x, y;
        if (initialize) x = y = 0;
        else {
          x = parseFloat(HTMLCard.getAttribute('data-x') || 0);
          y = parseFloat(HTMLCard.getAttribute('data-y') || 0);
        }
        if ($event) x += $event.dx;
        if ($event) y += $event.dy;
        HTMLCard.style.webkitTransform = `translate(${x}px, ${y}px)`;
        HTMLCard.style.transform = `translate(${x}px, ${y}px)`;
        HTMLCard.setAttribute('data-x', x);
        HTMLCard.setAttribute('data-y', y);
      },
      refresh () {
        this.hand_.forEach((card, index) => {
          const reference = this.reference(card.target, index);
          card.draggable({
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
                    x: fold.offsetLeft - card.target.clientWidth / 2,
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
          this.place(card.target, {
            dx: reference.x + card.target.clientWidth / 2,
            dy: reference.y + card.target.clientHeight / 2
          }, true);
        });
      },
      getCardName (deckCard) {
        return __nameMapping[deckCard['rank']] + __suitMapping[deckCard['suit']];
      },
      setDropZone () {
        const self = this;
        self.fold_ = InteractJS('#fold').dropzone({
          overlap: 0.000001,
          ondrop (event) {
            const name = self.getCardName(event.draggable.$deckCard);
            event.relatedTarget.setAttribute('played', true);
            self.$store.commit('play', name);
            self.refresh();
          }
        });
      },
      otherPlayCard (id, name) {
        const deckCard = __Deck[name];
        deckCard.setSide('front');
        deckCard.mount(document.getElementById('fold'));
        deckCard.$el.setAttribute('position', this.$store.getters.players[id].getPosition());
        deckCard.$el.style.transform = `translate(-50%, -50%)`;
        __zIndex++;
        deckCard.$el.style.zIndex = __zIndex;
        if (!this.foldCards[id] || this.getCardName(this.foldCards[id]) !== name) {
          deckCard.$el.className += ' enter';
        }
        this.$set(this.foldCards, id, deckCard);
      },
      closeFold () {
        this.lastFold = this.foldCards;
        this.foldCards = {};
        for (const id in this.lastFold) {
          if (this.lastFold.hasOwnProperty(id)) {
          }
        }
      },
      $load (property) {
        const item = this.$browserStore.getLocal(`${__namespace}.${property}`);
        return item ? JSON.parse(item) : null;
      },
      $save (property, value) {
        this.$browserStore.setLocal(`${__namespace}.${property}`, JSON.stringify(value));
      }
    },
    watch: {
      hand: {
        deep: true,
        handler (hand) {
          this.mount(hand);
        }
      },
      foldCards: {
        deep: true,
        handler (foldCards) {
          this.$save('foldCards', foldCards);
        }
      },
      fold: {
        deep: true,
        handler (fold) {
          const starter = this.$store.getters.game.getStarter();
          const order = this.$store.getters.game.getOrder();
          let nb = 0;
          for (let k = 0; k < order.length; k++) {
            const id = order[(order.indexOf(starter) + k) % 4];
            if (fold.hasOwnProperty(id)) {
              if (fold[id]) {
                this.otherPlayCard(id, fold[id]);
                nb++;
              } else {
                delete this.foldCards[id];
              }
            }
          }
          if (nb === order.length) {
            this.closeFold();
          }
        }
      }
    },
    mounted () {
      window.addEventListener('orientationchange', this.refresh);
      window.addEventListener('resize', this.refresh);
      this.mount(this.hand);
      this.setDropZone();
    },
    beforeDestroy () {
      window.removeEventListener('orientationchange', this.refresh);
      window.removeEventListener('resize', this.refresh);
      for (const id in this.foldCards) {
        if (this.foldCards.hasOwnProperty(id)) {
          if (!this.fold || this.fold[id] !== this.foldCards[id].name) {
            delete this.foldCards[id];
          }
        }
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
  @import '../../../node_modules/deck-of-cards/example/example.css';
  @import '../../scss/colors';
  @import '../../scss/sizes';
  $play-animation-duration: 1s;
  .cards {
    #hand {
      position: fixed;
      height: 100px;
      bottom: 0; left: 0; right: 0;
      pointer-events: auto;
      .card {
        box-shadow: $cards-box-shadow;
        border: 1px solid $cards-border-color;
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
    }
    &[moveup] #hand {
      bottom: 273px !important;
    }
    #fold {
      position: fixed;
      pointer-events: auto;
      width: 100px; height: 100px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: 0;
      .card[position='3'] {
        top: 50%; left: 0;
        &.enter { animation: $play-animation-duration from-left ease; }
        @keyframes from-left { from { left: -100vw } }
      }
      .card[position='2'] {
        top: 0; left: 50%;
        &.enter { animation: $play-animation-duration from-top ease; }
        @keyframes from-top { from { top: -100vh } }
      }
      .card[position='1'] {
        top: 50%; left: 100%;
        &.enter { animation: $play-animation-duration from-right ease; }
        @keyframes from-right { from { left: 100vw } }
      }
    }
    &[disabled] * {
      pointer-events: none !important;
    }
  }
</style>
