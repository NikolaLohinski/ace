<template>
  <v-touch tag="section"
           @swipeup="playCard"
           :selection="selected"
           class="cards">
    <transition-group tag="div" name="cards-turn" class="turn">
      <div v-for="(card, index) in turn_"
           v-if="card"
           :key="card"
           :index="card"
           :z-index="(4 - starter_ + index) % 4"
           :position="index"
           class="card">
      </div>
    </transition-group>
    <transition name="fast-hide-fold">
    <div class="fold" :leader="leader" v-if="hideFoldTimeout > 0">
      <div v-for="(card, index) in lastFold"
           v-if="card"
           :key="card"
           :index="card"
           :z-index="(4 - starter_ + index) % 4"
           :position="index"
           class="card">
      </div>
    </div>
    </transition>
    <transition-group tag="div"
                      name="cards-hand"
                      class="hand"
                      :move-up="moveUp">
      <v-touch tag="div"
               v-for="(card, index) in hand_"
               class="card"
               :forbidden="forbidden.indexOf(card) !== -1"
               :selected="card === selected"
               :key="card"
               :index="card"
               :leader="leader"
               @tap="selected = (selected === card || forbidden.indexOf(card) !== -1) ? null : card">
      </v-touch>
    </transition-group>
  </v-touch>
</template>
<script>
  import saveState from 'vue-save-state';
  export default {
    data () {
      return {
        selected: null,
        hand_: this.hand,
        lastFold: [null, null, null, null],
        hideFoldTimeout: 0,
        timeoutIndex: -1,
        turn_: [null, null, null, null],
        starter_: this.starter
      };
    },
    props: {
      hand: {
        type: Array,
        required: true
      },
      forbidden: {
        type: Array,
        required: true
      },
      moveUp: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: true
      },
      starter: {
        type: Number,
        default: 0
      },
      turn: {
        type: Array,
        required: true,
        validator (turn) {
          return turn.length <= 4 && turn.length >= 0;
        }
      },
      leader: {
        type: Number,
        required: true,
        validator (leader) {
          return leader <= 4 && leader >= -1;
        }
      }
    },
    mixins: [saveState],
    methods: {
      playCard ($event) {
        if (this.selected !== null && !this.disabled) {
          const index = this.hand_.indexOf(this.selected);
          this.$emit('played', { card: this.hand[index] });
          this.hand_ = this.hand.slice(0, index).concat(this.hand.slice(index + 1));
          this.selected = null;
        }
        $event.preventDefault();
      },
      getSaveStateConfig () {
        return {
          cacheKey: 'cards',
          saveProperties: ['lastFold']
        };
      }
    },
    watch: {
      hand: {
        deep: true,
        handler (hand) {
          this.hand_ = JSON.parse(JSON.stringify(hand));
        }
      },
      moveUp (moveUp) {
        if (moveUp) {
          this.selected = null;
        }
      },
      turn: {
        deep: true,
        handler (turn) {
          const self = this;
          self.hideFoldTimeout = 0;
          if (turn.indexOf(null) === -1) {
            if (JSON.stringify(self.lastFold) !== JSON.stringify(turn)) {
              setTimeout(() => {
                self.lastFold = turn;
                self.turn_ = [null, null, null, null];
                self.starter_ = self.starter;
                self.hideFoldTimeout = 2000;
              }, 500);
            }
          } else {
            self.turn_ = turn;
          }
        }
      },
      hideFoldTimeout (value) {
        const self = this;
        clearTimeout(self.timeoutIndex);
        if (value > 1000) {
          self.timeoutIndex = setTimeout(() => {
            self.hideFoldTimeout = value - 1000;
          }, value - 1000);
        } else {
          self.hideFoldTimeout = 0;
        }
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-cards-path: '../../img/cards';
  @import '../../scss/cards';
  @import '../../scss/colors';
  @import '../../scss/sizes';
  $margin-turn-card: 30px;
  $play-card-transition-duration: .5s;
  .cards {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
    z-index: 100;
    &[selection] {
      pointer-events: auto;
    }
    .card {
      background-color: $cards-background-color;
      @each $card-name, $card-url in $all-cards {
        &[index='#{$card-name}'] {
          background: $card-url center;
          background-size: 100% 100%;
        }
      }
      @each $z-index in (0, 1, 2, 3) {
        &[z-index='#{$z-index}'] {
          z-index: 100 + $z-index;
        }
      }
      width: 12.5vw;
      max-width: 80px;
      min-width: 60px;
      height: 18.75vw;
      max-height: 120px;
      min-height: 90px;
      display: inline-block;
      overflow: hidden;
      border: 1px solid $cards-border-color;
      box-shadow: $cards-box-shadow;
      border-radius: 5px;
      position: relative;
      cursor: pointer;
    }
    .hand {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      transition: bottom 200ms;
      text-align: center;
      white-space: nowrap;
      pointer-events: auto;
      &[move-up] {
        bottom: 65px;
        pointer-events: none;
      }
      @include answer-to-height ('m') {
        margin-bottom: -30px;
      }
      @include answer-to-height ('s') {
        margin-bottom: -50px;
      }
      .card {
        display: inline-block;
        &:first-child {
          margin-left: auto !important;
        }
        @include answer-to-width ('m') {
          margin-left: -10px;
        }
        @include answer-to-width ('s') {
          margin-left: -25px;
        }
        @include answer-to-width ('xs') {
          margin-left: -30px;
        }
        @each $index in (1, 2, 3, 4, 5, 6, 7, 8) {
          &:nth-child(#{$index}) {
            z-index: $index + 100;
          }
        }
        &[selected] {
          margin-bottom: 50px;
        }
        &[forbidden] {
          margin-bottom: -15px;
          filter: brightness(0.5);
        }
        transition: all .2s;
      }
      .cards-hand-enter {
        transform: translateY(200%);
      }
      .cards-hand-leave-to {
        opacity: 0;
      }
      .cards-hand-enter-active {
        @each $index in (1, 2, 3, 4, 5, 6, 7, 8) {
          &:nth-child(#{$index}) {
            transition: transform 200ms $index*100+200ms;
          }
        }
      }
    }
    .fast-hide-fold-leave-to {
      opacity: 0;
    }
    .fast-hide-fold-leave-active {
      transition: all 0.5s;
      transition-delay: 0s !important;
    }
    .turn, .fold {
      pointer-events: none;
      .card {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        &[position='0'] {
          margin-top: $margin-turn-card;
        }
        &[position='1'] {
          margin-left: $margin-turn-card;
        }
        &[position='2'] {
          margin-top: -$margin-turn-card;
        }
        &[position='3'] {
          margin-left: -$margin-turn-card;
        }
      }
    }
    .turn {
      .cards-turn-enter {
        &[position='0'] {
          opacity: 0;
          // top: 100%;
          // left: 50%;
          // transform: translate(-50%, 100%);
        }
        &[position='1'] {
          top: 50%;
          left: 100%;
          transform: translate(100%, -50%);
        }
        &[position='2'] {
          top: 0;
          left: 50%;
          transform: translate(-50%, -200%);
        }
        &[position='3'] {
          top: 50%;
          left: 0;
          transform: translate(-200%, -50%);
        }
      }
      .cards-turn-enter-active {
        transition: all $play-card-transition-duration 200ms;
      }
    }
    .fold {
      .card {
        transition: left 1.2s 1s, top 1.2s 1s, transform 1.2s 1s, margin 0.5s 1s;
      }
      $fold-leave-duration: 0.75s;
      $fold-leave-delay: 1s;
      $fold-leave-type: ease-in-out;
      &[leader='0'] .card {
        animation: leave-0 $fold-leave-duration $fold-leave-delay $fold-leave-type forwards;
        @keyframes leave-0 {
          50% {
            margin: 0;
          }
          100% {
            left: 50%;
            top: 100%;
            margin: 0;
            transform: translate(-50%, 50%);
          }
        }
      }
      &[leader='1'] .card {
        animation: leave-1 $fold-leave-duration $fold-leave-delay $fold-leave-type forwards;
        @keyframes leave-1 {
          50% {
            margin: 0;
          }
          100% {
            left: 100%;
            top: 50%;
            margin: 0;
            transform: translate(50%, -50%);
          }
        }
      }
      &[leader='2'] .card {
        animation: leave-2 $fold-leave-duration $fold-leave-delay $fold-leave-type forwards;
        @keyframes leave-2 {
          50% {
            margin: 0;
          }
          100% {
            left: 50%;
            top: 0;
            margin: 0;
            transform: translate(-50%, -150%);
          }
        }
      }
      &[leader='3'] .card {
        animation: leave-3 $fold-leave-duration $fold-leave-delay $fold-leave-type forwards;
        @keyframes leave-3 {
          50% {
            margin: 0;
          }
          100% {
            left: 0;
            top: 50%;
            margin: 0;
            transform: translate(-150%, -50%);
          }
        }
      }
    }
  }
</style>
