<template>
  <v-touch tag="div"  class="notification" :show="!hide" @tap="clear">
    <div class="box">
      <header class="title">
        <span v-if="args['title'] && !args['timer']">
          {{ args.title }}
        </span>
        <span v-else-if="args['timer']">{{ timer }}</span>
        <span v-else>!</span>
      </header>
      <div class="body" v-if="args['body']">
        <div class="message" v-html="args.body">
        </div>
      </div>
      <footer class="actions" v-if="args['callback']">
        <v-touch tag="div" class="action infirm" @tap="act(false)">
          {{ $t('back') }}
        </v-touch>
        <v-touch tag="div" class="action confirm" @tap="act(true)">
          {{ $t('ok') }}
        </v-touch>
      </footer>
    </div>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        timer: null,
        timeout: null
      };
    },
    store: global.store,
    computed: {
      hide () {
        return !this.args['body'];
      },
      args () {
        return this.$store.getters.notification;
      }
    },
    watch: {
      args: {
        handler (newArgs) {
          if (newArgs['timer']) {
            this.countDown(newArgs.timer.timeout, newArgs.timer.value);
          }
        }
      }
    },
    methods: {
      act (action) {
        this.args.callback(action);
        clearTimeout(this.timeout);
        this.timer = null;
        this.$store.commit('setNotification', {});
      },
      clear () {
        if (!this.args['callback']) {
          this.$store.commit('setNotification', {});
        }
      },
      countDown (timer, value) {
        this.timer = timer;
        this.timeout = setTimeout(() => {
          if (this.timer <= 0) {
            this.act(value);
          } else {
            this.countDown(timer - 1, value);
          }
        }, 1000);
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
   @import '../scss/general';
  .notification {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    opacity: 0;
    color: $notification-text-color;
    background: rgba(0, 0, 0, 0.2);
    transition: opacity 200ms;
    font-family: BoldFont;
    &[show] {
      opacity: 1;
      pointer-events: auto;
      .box {
        transform: translate(-50%, -50%) scale(1);
      }
    }
    .box {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 90vw;
      max-width: 250px;
      height: 90vw;
      max-height: 250px;
      background-color: $notification-background;
      border-radius: 5px;
      transition: transform 200ms;
      transform: translate(-50%, -50%) scale(0.8);
      .title {
        position: absolute;
        top: 0;
        width: 100%;
        padding: 15px 0;
        text-align: center;
        font-size: 30px;
      }
      .body {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        text-align: center;
        font-size: 15px;
        .message {
          margin: 15px;
        }
      }
      .actions {
        > .action {
          bottom: 10px;
          cursor: pointer;
          position: absolute;
          &.infirm {
            left: 15px;
          }
          &.confirm {
            right: 15px;
            text-align: right;
          }
          &:active {
            color: $link-text-color;
          }
        }
      }
    }
    [family] {
      width: 25px;
      height: 25px;
      display: inline-block;
      border-radius: 50%;
      position: relative;
      top: 5px;
      margin: 0 5px;
    }
    [family='s'] {
      background: $spades white;
      background-size: 100%;
    }
    [family='SA'] {
      background: $SA white;
      background-size: 100%;
    }
    [family='TA'] {
      background: $TA white;
      background-size: 100%;
    }
    [family='c'] {
      background: $clubs white;
      background-size: 100%;
    }
    [family='d'] {
      background: $diamonds white;
      background-size: 100%;
    }
    [family='h'] {
      background: $hearths white;
      background-size: 100%;
    }
  }
</style>
