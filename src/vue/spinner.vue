<template>
  <transition name="component-fade" mode="out-in">
  <div class="container" v-if="load" :block="block" :cover="cover">
    <div class=loader>
      <div class=spinner :mode="mode">
        <div class="the-c"></div>
        <div class="bar"></div>
        <div class="center"></div>
      </div>
      <span class=text>
        <transition name="component-fade" mode="out-in">
          <span v-if="mode === 'finished' && load" key="ready">
            {{ $t('ready') }}
          </span>
          <span v-else key="loading">
            {{ $t('loading') + '...'}}
          </span>
        </transition>
      </span>
    </div>
  </div>
  </transition>
</template>
<script>
  export default {
    data () {
      return {
        load: false,
        mode: 'finished'
      };
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      cover: {
        type: Boolean,
        default: true
      },
      block: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      turn (timeout) {
        this.mode = 'turning';
        if (!this.loading) {
          this.mode = 'finished';
          setTimeout(() => { this.load = false; }, 1000);
        } else {
          setTimeout(() => {
            this.mode = 'checking';
            setTimeout(this.turn, timeout, timeout);
          }, timeout);
        }
      }
    },
    watch: {
      loading (loading) {
        if (loading) {
          this.load = true;
          setTimeout(() => {
            this.mode = 'first-check';
            setTimeout(() => {
              this.turn(1000);
            }, 200);
          }, 0);
        }
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
@import '../scss/general';
.container {
    overflow: hidden;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
    transition: opacity .2s;
    pointer-events: none;
    &[cover] {
      background-color: $general-background;
    }
    &[block] {
      pointer-events: auto;
    }
    > .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      white-space: nowrap;
      > .text {
        color: $default-text-color;
        display: block;
        font-size: 15px;
        height: 15px;
      }
      > .spinner {
        display: block;
        position: relative;
        margin: 10px auto;
        width: 100px;
        height: 100px;
        opacity: 0.85;
        > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 20px solid transparent;
        }
        .the-c {
          border-color: #393939;
          border-right-color: transparent;
          transition: border-color 200ms;
        }
        .bar {
          border-right-color: rgba(229, 0, 0, 0.75);
          transition: 500ms margin-left, border-color 200ms;
          margin-left: 0;
        }
        .center {
          border: none;
          top: 35px;
          left: 35px;
          width: 30px;
          height: 30px;
          background-color: rgba(229, 0, 0, 0.75);
          transition: background-color 200ms;
        }
        &[mode='finished'] {
          .the-c {
            border-color: black;
            border-right-color: transparent;
          }
          .bar {
            border-right-color: rgba(229, 0, 0, 1);
          }
          .center {
            background-color: rgba(229, 0, 0, 1);
          }
        }
        &[mode='checking'] {
          .bar {
            margin-left: 30px;
            animation: 500ms scaler ease;
          }
          .the-c {
            animation: 1000ms rot2 linear;
            @keyframes rot2 {
              100% {
                transform: rotate(360deg);
              }
            }
          }
          .center {
            animation: 500ms scaler ease;
          }
          @keyframes scaler {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        }
        &[mode='first-check'] {
          .bar {
            margin-left: 30px;
          }
        }
        &[mode='turning'] {
          .bar {
            margin-left: 30px;
          }
          .the-c {
            animation: 1000ms rot linear;
            @keyframes rot {
              to {
                transform: rotate(360deg);
              }
            }
          }
        }
      }
    }
  }
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity .1s ease;
  }
  .component-fade-enter,
  .component-fade-leave-to {
    opacity: 0;
  }
</style>
