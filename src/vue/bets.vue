<template>
  <div class="bets">
    <div class="center">
      <v-touch tag="div" class="coinche-buzzer"
               @tap="coinche"
               :loading="coincheLoading"
               :disabled="!coinchable">
        <div class="small-spinner"></div>
      </v-touch>
    </div>
    <div class="betting-table">
      <div class="families">
        <div class="list-of-families">
          <v-touch tag="div" v-for="f in availableFamilies" :key="f"
                   class="family" :family="f"
                   :selected="family === f"
                   @tap="selectFamily(f, $event)">
          </v-touch>
        </div>
      </div>
      <div class="possible-bets">
        <div class="list-of-bets">
          <v-touch tag="div" class="bet" v-for="b in availableBets" :key="b"
               :selected="bet === b"
               @tap="selectBet(b, $event)">
            {{ b }}
          </v-touch>
        </div>
      </div>
      <div class="actions">
        <div class="action bet" :disabled="bet === null || family === null">
          {{ (bet) ? bet : $t('game.bet') }}
          <span class="bet-show" :family="family" v-if="family"></span>
        </div>
        <div class="action pass">{{ $t('game.pass') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        coinchable: false,
        coincheLoading: false,
        family: null,
        bet: null,
        availableBets: [81, 90, 100, 110, 120, 130, 140, 150, 160, 162],
        availableFamilies: ['h', 'c', 'd', 's']
      };
    },
    store: global.store,
    methods: {
      coinche () {
        this.$store.dispatch('vibrate');
        this.coincheLoading = true;
      },
      selectFamily (f, $event) {
        this.family = (this.family !== f) ? f : null;
        $event.preventDefault();
      },
      selectBet (b, $event) {
        this.bet = (this.bet !== b) ? b : null;
        $event.preventDefault();
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import "../scss/general";
  .bets {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 200px;
      min-height: 200px;
      width: 25vw;
      height: 25vw;
      max-width: 300px;
      max-height: 300px;
      .coinche-buzzer {
        position: absolute;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 27%;
        height: 27%;
        border-radius: 50%;
        cursor: pointer;
        background: $fist-coinche #535354;
        background-size: 100% 100%;
        &[disabled] {
          pointer-events: none;
          opacity: 0.75;
          background-color: #c0c0c2;
        }
        &:not([loading]):active {
          background-color: red !important;
          box-shadow: 1px 1px 5px black inset;
        }
        .small-spinner {
          opacity: 0;
          pointer-events: none;
        }
        &[loading] {
          display: inline-block;
          background: none #c0c0c2;
          > .small-spinner {
            opacity: 1;
            display: block;
            margin: 20% auto;
            width: 50%;
            height: 50%;
            border-radius: 50%;
            border: 4px solid #ddd;
            border-bottom-color: #777;
            animation: loading 1.2s infinite linear, opacify 200ms;
          }
          @keyframes loading {
            to {
              transform: rotate(360deg)
            }
          }
        }
      }
    }
    .betting-table {
      z-index: 10;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80vw;
      max-width: 600px;
      height: 70vh;
      max-height: 400px;
      background-color: $general-background-opaque;
      border: 1px solid $default-text-color;
      border-radius: 5px;
      text-align: center;
      > div {
        display: inline-block;
        vertical-align: middle;
      }
      [family='s'] {
        background: $spades;
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
      .families {
        height: calc(70vh - 80px);
        margin: 15px 5px;
        max-height: 320px;
        width: calc(49% - 10px);
        position: relative;
        .list-of-families {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
          .family {
            width: 40px;
            height: 40px;
            display: inline-block;
            margin: 5px;
            border: 1px solid $default-text-color;
            border-radius: 5px;
            padding: 5px;
            background-color: $general-background-opaque;
            cursor: pointer;
            &[selected], &:active {
              background-color: #ddd;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.75) inset;
            }
          }
        }
      }
      .possible-bets {
        margin: 15px 0;
        height: calc(70vh - 80px);
        max-height: 320px;
        width: 49%;
        position: relative;
        .list-of-bets {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
          .bet {
            display: inline-block;
            margin: 5px;
            padding: 5px 0;
            width: 40px;
            border: 1px solid $default-text-color;
            font-size: 20px;
            border-radius: 5px;
            background-color: $general-background-opaque;
            cursor: pointer;
            &[selected] {
              background-color: #ddd;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.75) inset;
            }
            &:active {
              background-color: #ddd;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.75) inset;
            }
          }
        }
      }
      .actions {
        width: 100%;
        display: inline-flex;
        justify-content: space-around;
        .action {
          display: inline-block;
          width: 40%;
          height: 40px;
          border: 1px solid $default-text-color;
          font-size: 15px;
          background-color: $general-background-opaque;
          border-radius: 5px;
          vertical-align: middle;
          line-height: 40px;
          cursor: pointer;
          &[disabled] {
            pointer-events: none;
            opacity: 0.5;
          }
          &:active {
            background-color: #ddd;
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.75) inset;
          }
          .bet-show {
            width: 20px;
            height: 20px;
            position: relative;
            display: inline-block;
            top: 3px;
          }
        }
      }
    }
  }
</style>
