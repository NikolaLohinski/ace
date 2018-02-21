<template>
  <v-touch tag="div"  class="error" @tap="close" :open="open">
    <div class="box">
      <div class="header">
        !
      </div>
      <div class="body">
        <div class="message">{{ $t(`errors.${ message }`, args) }}</div>
      </div>
    </div>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        open: false
      };
    },
    computed: {
      error () {
        return this.$store.getters.error;
      },
      message () {
        if (this.error.length > 0) {
          this.open = true;
        }
        return (this.error instanceof Array) ? this.error[0] || '' : this.error || '';
      },
      args () {
        return (this.error instanceof Array) ? this.error[1] : {};
      }
    },
    methods: {
      close (e) {
        e.preventDefault();
        this.open = false;
        setTimeout(() => this.$store.commit('setError', []), 200);
      }
    },
    store: global.store
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .error {
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
    &[open] {
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
      .header {
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
    }
  }
</style>
