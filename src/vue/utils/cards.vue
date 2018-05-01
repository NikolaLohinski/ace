<template>
  <v-touch tag="section"
           @swipeup="playCard"
           :selection="selected"
           class="cards">
    <transition-group tag="div" name="cards-turn" class="turn" :leader="leader">
      <div v-for="cardData in turn"
           :key="cardData['index']"
           :index="cardData['index']"
           :position="cardData['position']"
           class="card">
      </div>
    </transition-group>
    <transition-group tag="div"
                      name="cards-hand"
                      class="hand"
                      :auctions="auctions"
                      :block-cards="blockCards">
      <v-touch tag="div"
               v-for="(card, index) in hand"
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
  // import saveState from 'vue-save-state';
  export default {
    data () {
      return {
        hand: ['7s', '8h', '9c', '10d', 'js', 'qh', 'kc', 'ad'],
        forbidden: ['js', 'qh'],
        selected: null,
        turn: [
          // { index: 'ac', position: 1 },
          // { index: '8s', position: 2 },
          // { index: 'ah', position: 3 }
        ],
        leader: 1,
        blockCards: false,
        auctions: false
      };
    },
    // mixins: [saveState],
    methods: {
      // getSaveStateConfig () {
      //   return {
      //     'cacheKey': 'cards'
      //   };
      // },
      playCard ($event) {
        if (this.selected !== null) {
          const card = this.hand.splice(this.selected, 1);
          this.turn.push({
            index: card[0],
            position: 0
          });
          this.selected = null;
        }
        $event.preventDefault();
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
  $play-card-transition-duration: 1s;
  .cards {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
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
      transition: all $play-card-transition-duration;
      text-align: center;
      white-space: nowrap;
      pointer-events: auto;
      &[block-cards] {
        pointer-events: none;
      }
      &[auctions] {
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
            z-index: $index + 10;
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
      .cards-hand-move {
        transition: all $play-card-transition-duration !important;
      }
      .cards-hand-leave {
        bottom: 0;
        left: 0;
      }
      .cards-hand-leave-to {
        bottom: 50vh !important;
        left: 50% !important;
        transform: translate(-50%, 50%) !important;
        margin-top: 0 !important;
        margin-left: 0 !important;
        margin-bottom: -$margin-turn-card !important;
      }
      .cards-hand-leave-active {
        position: fixed !important;
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
        transition: opacity 0s $play-card-transition-duration;
        z-index: 20;
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
