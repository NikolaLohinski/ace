<template>
  <div class="actors">
    <div class="other-player" :pos="i" v-for="(p, i) in players.slice(1)">
      <span class="state" :status="p.state"></span>
      <span class="name">{{ p.name }}</span>
    </div>
    <div class="dealer-coin" :pos="dealerCoinPosition"></div>
  </div>
</template>
<script>
  export default {
    props: {
      players: {
        type: Array
      }
    },
    computed: {
      dealerCoinPosition () {
        return this.players.findIndex((p) => {
          return p.dealer;
        });
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
        bottom: 125px;
        left: 50%;
        transform: translate(100px, 0);
      }
      &[pos='1'] {
        top: 40%;
        right: 45px;
        transform: translate(0%, -50%);
      }
      &[pos='2'] {
        top: 45px;
        left: 30%;
        transform: translate(-50%, 0%);
      }
      &[pos='3'] {
        top: 60%;
        left: 35px;
        transform: translate(0, -50%);
      }
    }
    .other-player {
      position: absolute;
      &[pos='0'] {
        top: 50%;
        right: 30px;
        transform: translate(0, -50%);
      }
      &[pos='1'] {
        top: 30px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &[pos='2'] {
        top: 50%;
        left: 30px;
        transform: translate(0, -50%);
      }
      .name {
        color: $lighter-text-color;
        text-shadow: 1px 0 1px rgba(0, 0, 0, 0.3);
        font-size: 15px;
      }
      .state {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: red;
        display: inline-block;
        box-shadow: inset -1px 1px 2px rgba(0,0,0,0.2);
        &[status='0'] {
          background-color: #ffff00;
        }
        &[status='1'] {
          background-color: #00d516;
        }
      }
    }
    @media screen and (max-device-width: $max-s-width),
      screen and (max-width: $max-s-width) {
      .dealer-coin {
        &[pos='0'] {
          bottom: 85px;
          transform: translate(80px, 0);
        }
        &[pos='1'] {
          top: 35%;
        }
        &[pos='2'] {}
        &[pos='3'] {
          top: 65%;
        }
      }
      .other-player {
        &[pos='0'] {
          right: 5px;
        }
        &[pos='1'] {
          top: 5px;
        }
        &[pos='2'] {
          left: 5px;
        }
      }
      @media (orientation: portrait) {
        @media screen and (max-device-width: $max-xxs-width),
        screen and (max-width: $max-xxs-width) {
          .dealer-coin {
            &[pos='0'] {
              bottom: 80px;
              transform: translate(60px, 0);
            }
          }
          .name {
            display: none;
          }
        }
      }
    }
  }
</style>
