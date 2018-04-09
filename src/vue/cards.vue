<template>
  <div class="cards">
    <div class="own" :auction="auction" :moveup="moveup" :turn="turn && !block">
      <transition-group tag="div"
                        class="line bot-line"
                        :reup="hand.length < 5"
                        name="play-card">
        <div v-for="(c, i) in hand" :disabled="!isPossible(c)"
              class="box"
              v-if="c && i < 4" :key="c.value + c.family">
          <card
                :card="c"
                @tap="chooseCard(c)">
          </card>
        </div>
      </transition-group>
      <transition-group tag="div"
                        class="line top-line"
                        name="play-card">
        <div v-for="(c, i) in hand" :disabled="!isPossible(c)"
             class="box"
              v-if="c && i > 3" :key="c.value + c.family">
          <card :card="c"
                @tap="chooseCard(c)">
          </card>
        </div>
      </transition-group>
    </div>
    <transition name="left" :leave-to-class="winTransition">
      <div class="played left" v-if="left">
        <card :card="left">
        </card>
      </div>
    </transition>
    <transition name="up" :leave-to-class="winTransition">
      <div class="played top" v-if="up">
        <card :card="up">
        </card>
      </div>
    </transition>
    <transition name="mine" :leave-to-class="winTransition">
      <div class="played me" v-if="mine">
        <card :card="mine">
        </card>
      </div>
    </transition>
    <transition name="right" :leave-to-class="winTransition">
      <div class="played right" v-if="right">
        <card :card="right">
        </card>
      </div>
    </transition>
  </div>
</template>
<script>
  import Card from './card.vue';
  export default {
    data () {
      return {
        up: null,
        right: null,
        mine: null,
        left: null,
        winTransition: '',
        block: false
      };
    },
    props: {
      players: {
        type: Array,
        default () {
          return [];
        }
      },
      turn: {
        type: Boolean,
        default: false
      },
      moveup: {
        type: Boolean,
        default: false
      },
      auction: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      upCard () {
        return (this.players) ? this.players[2].played : null;
      },
      leftCard () {
        return (this.players) ? this.players[3].played : null;
      },
      rightCard () {
        return (this.players) ? this.players[1].played : null;
      },
      mineCard () {
        return (this.players) ? this.players[0].played : null;
      },
      allPlayed () {
        return this.upCard && this.leftCard && this.rightCard && this.mineCard;
      },
      forbidden () {
        return (this.players) ? this.players[0]['forbidden_cards'] : [];
      },
      hand () {
        return (this.players) ? this.players[0]['hand'] : [];
      },
      whoWins () {
        return (this.players) ? this.players.indexOf(
          this.players.filter((p) => p.turn).pop()
        ) : null;
      }
    },
    watch: {
      upCard (up) {
        this.up = up;
      },
      leftCard (left) {
        this.left = left;
      },
      rightCard (right) {
        this.right = right;
      },
      mineCard (mine) {
        this.mine = mine;
      },
      allPlayed (allPlayed) {
        if (allPlayed) {
          const names = ['win-mine', 'win-right', 'win-up', 'win-left'];
          this.winTransition = names[this.whoWins];
          this.block = true;
          setTimeout(() => {
            this.block = false;
            this.up = this.left = this.right = this.mine = null;
          }, 2000);
        }
      }
    },
    methods: {
      chooseCard (c) {
        this.$emit('card', c);
      },
      isPossible (c) {
        return !this.forbidden.filter((e) => e.family === c.family && e.value === c.value).pop();
      }
    },
    components: {
      Card
    },
    mounted () {
      this.mine = this.mineCard;
      this.up = this.upCard;
      this.left = this.leftCard;
      this.right = this.rightCard;
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import "../scss/general";
  .cards {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    .own {
      pointer-events: none;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      transition: all 200ms;
      z-index: 1;
      &[auction] {
        bottom: 80px;
        pointer-events: none !important;
        &[moveup] {
          bottom: calc(100vh - 170px);
        }
      }
      &[turn] {
        pointer-events: auto;
        .line .box > {
          animation: anim 1s ease infinite alternate;
          @keyframes anim {
            to {
              border-color: red;
            }
          }
        }
      }
      .line {
        position: relative;
        display: inline-block;
        margin: -2px;
        transform: translateY(5px);
        .box {
          display: inline-block;
          transition: all .5s;
          &[disabled] {
            pointer-events: none;
            filter: brightness(0.4);
            position: relative;
            top: 5px;
          }
        }
        &.top-line {
          z-index: 1;
        }
        &.bot-line {
          z-index: 2;
        }
      }
    }
    .played {
      position: absolute;
      pointer-events: none;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      &.me {
        margin-top: 25vh;
      }
      &.left {
        margin-left: -15vw;
      }
      &.right {
        margin-left: 15vw;
      }
      &.top {
        margin-top: -30vh;
      }
    }
    @media (orientation: landscape) and (max-device-height: 400px),
    (orientation: landscape) and (max-height: 400px){
      .own {
        transform: translateY(40%);
        &[auction] {
          &[moveup] {
            bottom: calc(100vh - 70px);
          }
        }
      }
    }
    @media screen and (max-device-width: $max-s-width),
      screen and (max-width: $max-s-width) {
      .own .line {
        transform: translateY(10px);
        > .box > {
          transform: scale(0.7);
          margin: -13px;
        }
      }
      .played {
        > * {
          transform: scale(0.7);
        }
        &.left {
          margin-left: -20vw;
        }
        &.right {
          margin-left: 20vw;
        }
        &.top {
          margin-top: -23vh;
        }
        &.me {
          margin-top: 25vh;
        }
      }
      @media (orientation: portrait) {
        @media screen and (max-device-width: $max-xxs-width),
        screen and (max-width: $max-xxs-width) {
          .own {
            transform: translateY(20%);
            &[auction] {
              transform: translateY(-4px);
            }
            .line {
              display: block;
              width: 100%;
              &.top-line {
                transform: translateY(-20%);
              }
              &.bot-line {
                transform: translateY(110%);
                &[reup] {
                  transform: translateY(33%);
                }
              }
            }
          }
        }
        .played {
          &.left {
            left: 0;
            margin-left: 0;
            transform: translateY(-50%);
          }
          &.right {
            left: 100vw;
            margin-left: -15px;
            transform: translate(-100%,-50%);
          }
        }
      }
    }
    .up-enter-active,
    .up-leave-active,
    .left-enter-active,
    .left-leave-active,
    .right-enter-active,
    .right-leave-active,
    .mine-enter-active,
    .mine-leave-active,
    .play-card-move {
      transition: all .5s ease;
    }
    .up-enter {
      top: -100px;
    }
    .right-enter {
      left: 100vw;
    }
    .left-enter {
      left: -100px;
    }
    .mine-enter {
      top: 100vh;
    }
    .win-left {
      left: -200px !important;
      top: 50% !important;
      margin: 0 !important;
    }
    .win-up {
      top: -200px !important;
      left: 50% !important;
      margin: 0 !important;
    }
    .win-right {
      left: 125vw !important;
      top: 50% !important;
      margin: 0 !important;
    }
    .win-mine {
      left: 50% !important;
      top: 100vh !important;
      margin: 0 !important;
    }
    .play-card-enter-active,
    .play-card-leave-active {
      position: absolute;
      transition: all .5s;
    }
    .play-card-enter,
    .play-card-leave-to {
      bottom: -200px;
      left: 50%;
    }
  }
</style>
