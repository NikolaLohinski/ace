<template>
  <v-touch tag="div" class="auctions" :show="show" @swipedown="showBets = false">
    <v-touch tag="div" class="show-cards" v-if="showBets" @tap="showBets = false">
    </v-touch>
    <v-touch tag="div" class="container" :moveup="showBets" @swipeup="showBets = true">
      <div class="actions">
        <v-touch tag="div" class="bid action" @tap="clickButtonOne">
          {{ (family) ? $t('game.change') : (showBets) ? $t('back') : $t('game.bet') }}
          <div class="show-family" :family="family" v-if="family"></div>
        </v-touch>
        <v-touch tag="div" class="pass action" @tap="pass">
          {{ $t('game.toPass') }}
        </v-touch>
      </div>
      <div class="bidding" :hide="!showBets">
        <transition name="fade" mode="out-in">
          <div class="families" v-if="!family" key="families">
            <v-touch tag="div" :key="f" v-for="f in families" class="family" :family="f" @tap="family = f">
            </v-touch>
          </div>
        <div v-else>
          <div class="prices" key="prices">
            <div class="show-family" :family="family"></div>
            <ul class="list-of-prices">
              <li v-for="p in prices" :key="p">
                <v-touch :disabled="forbiddenPrices.indexOf(p) !== -1"
                        tag="div" class="price value" @tap="price = p">
                  {{ p }}
                </v-touch>
              </li>
            </ul>
          </div>
          <div class="special-prices">
              <v-touch tag="div" :disabled="forbiddenPrices.indexOf('gen') !== -1"
                       @tap="price = 'gen'" class="special-price value left">
                {{ $t('game.gen')}}
              </v-touch>
              <v-touch tag="div" :disabled="forbiddenPrices.indexOf('cap') !== -1"
                       @tap="price = 'cap'" class="special-price value right">
                {{ $t('game.cap')}}
              </v-touch>
           </div>
          </div>
        </transition>
      </div>
    </v-touch>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        showBets: false,
        family: null,
        price: null,
        time: null,
        timeout: null,
        families: ['h', 's', 'd', 'c', 'SA', 'TA'],
        prices: ['80', '90', '100', '110', '120', '130', '140', '150',
          '160', '170', '180'] // DON'T FORGET SPECIAL PRICES CAP AND GEN
      };
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      forbiddenPrices: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    watch: {
      showBets (bidding) {
        this.$emit('bidding', bidding);
      },
      price (p) {
        const self = this;
        self.showBets = false;
        self.$store.commit('setNotification', {
          body: `
            ${self.$t('game.confirmBet')}
            <br/>
            ${(['cap', 'gen'].indexOf(self.price) !== -1) ? self.$t('game.' + self.price) : self.price}
            <div family="${self.family}">
            </div>
          `,
          timer: {
            timeout: 5,
            value: true
          },
          callback (value) {
            if (!value) {
              self.showBets = true;
            } else {
              self.$emit('bid', {
                price: self.price,
                family: self.family
              });
            }
          }
        });
      }
    },
    methods: {
      clickButtonOne () {
        if (this.family) {
          if (this.showBets) {
            this.family = null;
          } else {
            this.showBets = true;
          }
        } else {
          this.showBets = !this.showBets;
        }
      },
      pass () {
        this.$emit('bid', null);
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .auctions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms;
    z-index: 5;
    &[show] {
      opacity: 1;
      .container {
        pointer-events: auto;
      }
    }
    .show-cards {
      position: absolute;
      top: 0;
      width: 100vw;
      height: 170px;
      pointer-events: auto;
    }
    .container {
      position: absolute;
      top: calc(100vh - 80px);
      left: 0;
      width: 100vw;
      height: calc(100vh - 170px);
      background-color: $notification-background;
      transition: top 200ms, height 200ms;
      pointer-events: none;
      &[moveup] {
        top: 170px;
      }
      .actions {
        text-align: center;
        display: block;
        width: 100%;
        .action {
          cursor: pointer;
          font-size: 20px;
          width: calc(50% - 50px);
          margin: 15px 5px;
          border-radius: 5px;
          display: inline-block;
          padding: 10px 15px;
          max-width: 250px;
          color: $lighter-text-color;
          border: 1px solid $lighter-text-color;
          white-space: nowrap;
          &:active {
            background-color: $default-text-color;
            color: #ddd;
          }
          .show-family {
            display: inline-block;
            width: 20px;
            height: 20px;
            position: relative;
            top: 3px;
          }
        }
      }
      .bidding {
        transition: opacity 200ms;
        &[hide] {
          opacity: 0;
          pointer-events: none;
        }
        .families {
          position: absolute;
          margin-top: 35px;
          top: 50%;
          left: 50%;
          width: 100%;
          height: calc(100% - 90px);
          max-height: 250px;
          max-width: 400px;
          transform: translate(-50%, -50%);
          .family {
            position: absolute;
            width: 15vh;
            height: 15vh;
            max-width: 80px;
            max-height: 80px;
            transform: translate(-50%, -50%);
            transition: transform 50ms;
            &:active {
              transform: translate(-50%, -50%) scale(1.2);
            }
            &[family='h'] {
              top: 30px;
              left: 37%;
            }
            &[family='c'] {
              top: 30px;
              left: 63%;
            }
            &[family='s'] {
              top: 50%;
              left: 20%;
            }
            &[family='TA'] {
              top: 50%;
              left: 80%;
            }
            &[family='SA'] {
              top: 100%;
              left: 63%;
              transform: translate(-50%, -100%);
              &:active {
                transform: translate(-50%, -100%) scale(1.2);
              }
            }
            &[family='d'] {
              top: 100%;
              left: 37%;
              transform: translate(-50%, -100%);
              &:active {
                transform: translate(-50%, -100%) scale(1.2);
              }
            }
          }
        }
        .special-prices {
          position: absolute;
          bottom: 0;
          width: 100%;
          .special-price {
            position: absolute;
            bottom: 0;
            &.left {
              left: 15px;
            }
            &.right {
              right: 15px;
            }
          }
        }
        .prices {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: calc(100% - 90px);
          max-height: 250px;
          max-width: 400px;
          transform: translate(-50%, -50%);
          margin-top: 25px;
          .show-family {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 15vh;
            height: 15vh;
            max-width: 80px;
            max-height: 80px;
          }
          .list-of-prices {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            @include distribute-on-circle(11, 220px, 55px);
          }
        }
        .value {
          text-align: center;
          transition: transform 50ms;
          cursor: pointer;
          font-size: 23px;
          border-radius: 50%;
          width: 55px;
          height: 55px;
          line-height: 55px;
          color: $notification-text-color;
          &:active {
            color: white;
            transform: scale(1.2);
          }
          &[disabled] {
            pointer-events: none;
            opacity: 0.25;
          }
        }
      }
    }
    @media (orientation: landscape) and (max-device-height: 400px),
      (orientation: landscape) and (max-height: 400px){
      .container[moveup] {
        top: 70px;
        height: calc(100vh - 70px);
      }
      .show-cards {
        height: 70px;
      }
    }
    @media screen and (max-device-height: 490px),
      screen and (max-height: 490px){
      .container[moveup] {
        .bidding .prices {
          margin-top: 0;
          transform: translate(-50%, 0);
          top: auto;
          .list-of-prices {
            @include distribute-on-circle(11, 140px, 35px);
          }
        }
        .value {
          font-size: 15px;
          width: 35px;
          height: 35px;
          line-height: 35px;
        }
      }
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .1s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
