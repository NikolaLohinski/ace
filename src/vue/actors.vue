<template>
  <div class="actors">
    <div class="other-player" :pos="i" v-for="(p, i) in players.slice(1)">
      <span class="state" :status="p.state" :playing="p.turn"></span>
      <span class="name">{{ p.name }}</span>
      <div class="bet" :overpassed="!isLeading(p) && betFamily(p)" v-if="p.bets.length > 0 && !p.turn && bets">
        {{
           (betPrice(p) === 0) ? $t('game.pass') :
           (['cap', 'gen'].indexOf(betPrice(p)) !== -1) ? $t(`game.${betPrice(p)}`) :
           betPrice(p)
        }}
        <div :family="betFamily(p)" class="family" v-if="betFamily(p)"></div>
      </div>
    </div>
    <div class="my-bet bet" v-if="bets && me.bets.length > 0 && !me.turn" :overpassed="!isLeading(me) && betFamily(me)">
      {{
         (betPrice(me) === 0) ? $t('game.pass') :
         (['cap', 'gen'].indexOf(betPrice(me)) !== -1) ? $t(`game.${betPrice(me)}`) :
         betPrice(me)
      }}
      <div :family="betFamily(me)" class="family" v-if="betFamily(me)"></div>
    </div>
    <div class="dealer-coin" :pos="dealerCoinPosition"></div>
  </div>
</template>
<script>
  export default {
    props: {
      players: {
        type: Array
      },
      bets: {
        type: Boolean
      }
    },
    computed: {
      dealerCoinPosition () {
        return this.players.indexOf(this.players.filter((p) => {
          return p.dealer;
        }).pop());
      },
      me () {
        return this.players[0];
      }
    },
    methods: {
      isLeading (ply) {
        return this.players.every((p) => {
          if (p === ply) {
            return true;
          } else {
            const pricePly = this.betPrice(ply);
            const priceP = this.betPrice(p);
            if (['cap', 'gen'].indexOf(pricePly) !== -1) {
              return priceP !== 'gen';
            } else if (['cap', 'gen'].indexOf(priceP) !== -1) {
              return pricePly === 'gen';
            } else {
              return parseInt(pricePly) > parseInt(priceP);
            }
          }
        });
      },
      betPrice (ply) {
        return (ply.bets.slice(-1)[0]) ? ply.bets.slice(-1)[0].price : 0;
      },
      betFamily (ply) {
        return (ply.bets.slice(-1)[0]) ? ply.bets.slice(-1)[0].family : null;
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .actors {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: -1;
    .dealer-coin {
      width: 50px;
      height: 50px;
      position: absolute;
      top: auto;
      left: auto;
      right: auto;
      bottom: auto;
      transform: translate(0, 0);
      background: $dealer-coin;
      background-size: 100%;
      transition: all 400ms;
      &[pos='0'] {
        bottom: 5px;
        left: 5px;
      }
      &[pos='1'] {
        top: 40%;
        right: 20px;
        transform: translate(0%, -50%);
      }
      &[pos='2'] {
        top: 20px;
        left: 40%;
        transform: translate(-50%, 0%);
      }
      &[pos='3'] {
        top: 40%;
        left: 20px;
        transform: translate(0, -50%);
      }
    }
    .bet {
      color: $lighter-text-color;
      font-style: italic;
      position: relative;
      &[overpassed]:after {
        content: '';
        width: 100%;
        height: 2px;
        background-color: $default-text-color;
        transform: translate(-50%, -50%) rotate(-20deg);
        position: absolute;
        top: 50%;
        left: 50%;
      }
      .family {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin: 0 2px;
        position: relative;
        top: 1px;
      }
    }
    .other-player {
      position: absolute;
      .name {
        color: $lighter-text-color;
        text-shadow: 1px 0 1px rgba(0, 0, 0, 0.3);
        font-size: 15px;
      }
      .state {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        transition: background-color 200ms;
        background-color: red;
        display: inline-block;
        position: relative;
        margin: 0 2px;
        box-shadow: inset -1px 1px 2px rgba(0,0,0,0.2);
        &[status='0'] {
          background-color: #ffff00;
        }
        &[status='1'] {
          background-color: #00d516;
        }
        &[playing] {
          margin-right: 6px;
          &:after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid $default-text-color;
            border-right-color: transparent;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2px;
          }
          &:before {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-right-color: $default-text-color;
            animation: playing 1s infinite ease;
            top: 50%;
            left: 50%;
            padding: 2px;
            @keyframes playing {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%);
              }
              20% {
                opacity: 1;
                transform: translate(-50%, -50%);
              }
              80% {
                opacity: 1;
                transform: translate(-25%, -50%);
              }
              100% {
                opacity: 0;
                transform: translate(-25%, -50%);
              }
            }
          }
        }
      }
      &[pos='0'] {
        top: 50%;
        right: 30px;
        transform: translate(0, -50%);
        .bet {
          float: left;
          margin: 0 10px;
          display: inline-block;
        }
      }
      &[pos='1'] {
        top: 30px;
        left: 50%;
        transform: translate(-50%, 0);
        text-align: center;
      }
      &[pos='2'] {
        top: 50%;
        left: 30px;
        transform: translate(0, -50%);
        .bet {
          float: right;
          margin: 0 10px;
          display: inline-block;
        }
      }
    }
    .my-bet {
      position: absolute;
      bottom: 130px;
      left: 50%;
      transform: translateX(-50%);
      @media (orientation: landscape) and (max-device-height: 400px),
      (orientation: landscape) and (max-height: 400px){
        margin-bottom: -35px;
      }
      @media screen and (max-device-width: $max-s-width),
        screen and (max-width: $max-s-width) {
        bottom: 90px;
        @media (orientation: portrait) {
          @media screen and (max-device-width: $max-xxs-width),
          screen and (max-width: $max-xxs-width) {
            bottom: 80px;
          }
        }
      }
    }
    @media screen and (max-device-width: $max-s-width),
      screen and (max-width: $max-s-width) {
      .other-player {
        &[pos='0'] {
          right: 5px;
        }
        &[pos='1'] {
          top: 10px;
        }
        &[pos='2'] {
          left: 5px;
        }
      }
      @media (orientation: portrait) {
        @media screen and (max-device-width: $max-xxs-width),
        screen and (max-width: $max-xxs-width) {
          .name {
            display: none;
          }
          .state[playing] {
            margin-right: 2px;
          }
          .other-player[pos='0'] .state[playing] {
            &:after {
              border-right-color: $default-text-color;
              border-left-color: transparent;
            }
            &:before {
              border-right-color: transparent;
              border-left-color: $default-text-color;
              animation: playingright 1s infinite ease;
              @keyframes playingright {
                0% {
                  opacity: 0;
                  transform: translate(-50%, -50%);
                }
                20% {
                  opacity: 1;
                  transform: translate(-50%, -50%);
                }
                80% {
                  opacity: 1;
                  transform: translate(-75%, -50%);
                }
                100% {
                  opacity: 0;
                  transform: translate(-75%, -50%);
                }
              }
            }
          }
          .other-player[pos='1'] .state[playing] {
            &:after {
              border-right-color: $default-text-color;
              border-bottom-color: transparent;
            }
            &:before {
              border-right-color: transparent;
              border-bottom-color: $default-text-color;
              animation: playingdown 1s infinite ease;
              @keyframes playingdown {
                0% {
                  opacity: 0;
                  transform: translate(-50%, -50%);
                }
                20% {
                  opacity: 1;
                  transform: translate(-50%, -50%);
                }
                80% {
                  opacity: 1;
                  transform: translate(-50%, -25%);
                }
                100% {
                  opacity: 0;
                  transform: translate(-50%, -25%);
                }
              }
            }
          }
        }
      }
    }
    [family='s'] {
      background: $spades;
      background-size: 100%;
    }
    [family='SA'] {
      background: $SA;
      background-size: 100%;
    }
    [family='TA'] {
      background: $TA;
      background-size: 100%;
    }
    [family='c'] {
      background: $clubs;
      background-size: 100%;
    }
    [family='d'] {
      background: $diamonds;
      background-size: 100%;
    }
    [family='h'] {
      background: $hearths;
      background-size: 100%;
    }
  }
</style>
