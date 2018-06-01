<template>
  <v-touch tag="section"
           @swipeup="playCard"
           :selection="selected"
           class="cards">
    <transition-group tag="div" name="cards-turn" class="turn" :leader="leader">
      <div v-for="(card, index) in turn_"
           v-if="card"
           :key="card"
           :index="card"
           :z-index="(4 - starter_ + index) % 4"
           :position="index"
           class="card">
      </div>
    </transition-group>
    <transition-group tag="div"
                      name="cards-hand"
                      class="hand"
                      :move-up="moveUp"
                      :disabled="disabled">
      <v-touch tag="div"
               v-for="(card, index) in hand_"
               class="card"
               :forbidden="forbidden.indexOf(card) !== -1"
               :selected="index === selected"
               :key="card"
               :index="card"
               :leader="leader"
               @tap="selected = (selected === index || forbidden.indexOf(card) !== -1) ? null : index">
      </v-touch>
    </transition-group>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        selected: null,
        hand_: this.hand,
        turn_: this.turn,
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
    methods: {
      playCard ($event) {
        if (this.selected !== null) {
          const card = this.hand[this.selected];
          this.hand_.splice(this.selected, 1);
          this.$emit('played', { card: card });
          this.selected = null;
        }
        $event.preventDefault();
      }
    },
    watch: {
      hand: {
        deep: true,
        handler (hand) {
          this.hand_ = hand;
        }
      },
      turn: {
        deep: true,
        handler (turn) {
          const self = this;
          self.turn_ = turn;
          if (turn.indexOf(null) === -1) {
            setTimeout(() => {
              self.turn_ = [null, null, null, null];
              self.starter_ = self.starter;
            }, 1000);
          }
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
  $play-card-transition-duration: .2s;
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
      &[disabled] {
        pointer-events: none;
      }
      &[move-up] {
        bottom: 65px;
      }
      @include answer-to-height ('m') {
        margin-bottom: -30px;
      }
      @include answer-to-height ('s') {
        margin-bottom: -50px;
      }
      .card {
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
            transition: transform 200ms $index*100+200ms;
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
        transform: translateY(100%);
      }
      .cards-hand-leave-to {
        opacity: 0;
      }
    }
    .turn {
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
      .cards-turn-enter-active {
        transition: opacity $play-card-transition-duration;
        z-index: 120;
      }
      .cards-turn-enter {
        opacity: 0;
      }
      .cards-turn-leave-active {
        transition: left 1.2s, top 1.2s, transform 1.2s, margin 0.5s;
      }
      &[leader='0'] .cards-turn-leave-to {
        left: 50%;
        top: 100%;
        margin: 0;
        transform: translate(-50%, 0);
      }
      &[leader='1'] .cards-turn-leave-to {
        left: 100%;
        top: 50%;
        margin: 0;
        transform: translate(0, -50%);
      }
      &[leader='2'] .cards-turn-leave-to {
        left: 50%;
        top: 0;
        margin: 0;
        transform: translate(-50%, -100%);
      }
      &[leader='3'] .cards-turn-leave-to {
        left: 0;
        top: 50%;
        margin: 0;
        transform: translate(-100%, -50%);
      }
    }
  }
</style>
