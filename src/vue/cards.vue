<template>
  <div class="cards">
    <div class="own" :auction="auction" :moveup="moveup">
      <div class="line bot-line" :reup="hand.length < 5">
        <card v-for="(c, i) in hand"
              :card="c" v-if="c && i < 4" :key="c.value + c.family"
              @tap="chooseCard(c)">
        </card>
      </div>
      <div class="line top-line">
        <card v-for="(c, i) in hand"
              :card="c" v-if="c && i > 3" :key="c.value + c.family"
              @tap="chooseCard(c)">
        </card>
      </div>
    </div>
    <div class="played left">
      <card v-if="left" :card="left">
      </card>
    </div>
    <div class="played top">
      <card v-if="top" :card="top">
      </card>
    </div>
    <div class="played me">
      <card v-if="me" :card="me">
      </card>
    </div>
    <div class="played right">
      <card v-if="right" :card="right">
      </card>
    </div>
  </div>
</template>
<script>
  import Card from './card.vue';
  export default {
    data () {
      return {
        me: null,
        left: null,
        top: null,
        right: null
      };
    },
    props: {
      hand: {
        type: Array,
        default () {
          return [];
        }
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
    methods: {
      chooseCard (card) {
        console.log(this.hand.indexOf(card), card);
      }
    },
    components: {
      Card
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
      pointer-events: auto;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      transition: all 200ms;
      &[auction] {
        bottom: 80px;
        &[moveup] {
          bottom: calc(100vh - 170px);
        }
      }
      .line {
        position: relative;
        display: inline-block;
        margin: -2px;
        transform: translateY(5px);
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
      pointer-events: auto;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      &.me {
        margin-top: 30vh;
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
        > * {
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
            left: initial;
            right: 0;
            margin-left: -15px;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
</style>
