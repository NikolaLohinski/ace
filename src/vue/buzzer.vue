<template>
  <div class="buzzer">
    <v-touch tag="div" @tap="coinche" class="button" :disabled="!enable">
      <div class="timer">
        <div class="liquid" :style="timerStyle"></div>
      </div>
      <div class="background"></div>
    </v-touch>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        internalTimeout: null,
        timer: null
      };
    },
    computed: {
      enable () {
        return this.internalTimeout > 0 && this.coincheAvailable;
      },
      timerStyle () {
        const perc = 100 * this.internalTimeout / this.timeout;
        const color = (perc > 80) ? '#5cb85c' : (perc > 40) ? '#f0ad4e' : '#d9534f';
        return {
          height: `${perc}%`,
          backgroundColor: color
        };
      }
    },
    props: {
      coincheAvailable: {
        type: Boolean,
        default: false
      },
      timeout: {
        type: Number,
        default: 3.0
      }
    },
    methods: {
      coinche () {
        this.$emit('coinche');
        this.internalTimeout = null;
        clearTimeout(this.timer);
      },
      countDown (start) {
        this.internalTimeout = start;
        this.timer = setTimeout(() => {
          if (start > 0) this.countDown(start - 0.2);
        }, 200);
      }
    },
    watch: {
      coincheAvailable (available) {
        if (available) {
          this.countDown(this.timeout);
        }
      }
    },
    mounted () {
      if (this.coincheAvailable) {
        this.countDown(this.timeout);
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .buzzer {
    position: absolute;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    min-height: 200px;
    width: 25vw;
    height: 25vw;
    max-width: 300px;
    max-height: 300px;
    z-index: 0;
    .button {
      width: 28%;
      height: 28%;
      position: absolute;
      top: 50%;
      pointer-events: auto;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: opacity .2s;
      cursor: pointer;
      &[disabled] {
        pointer-events: none;
        opacity: 0.25;
        .timer {
          display: none;
        }
      }
      &:active .background {
        box-shadow: inset 2px 2px 5px rgba(0,0,0,0.75);
        background-color: red;
      }
      .background {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: $buzzer;
        background-size: 100% 100%;
        border-radius: 50%;
      }
      .timer {
        width: 100%;
        height: 100%;
        pointer-events: none;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 50%;
        overflow: hidden;
        .liquid {
          width: 100%;
          height: 100%;
          bottom: 0;
          position: absolute;
          left: 0;
          opacity: 0.6;
          transition: height .2s, background-color .2s;
        }
      }
    }
  }
</style>
