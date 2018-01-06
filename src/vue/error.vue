<template>
  <div class="error" :open="open">
    <div class="box">
      <div class="header">
        Something went wrong...
      </div>
      <div class="body">
        <div class="message">{{ text }}</div>
      </div>
      <div class="footer">
        <v-touch tag="div" class="close" @tap="close">Close</v-touch>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        open: false,
        text: ''
      };
    },
    computed: {
      message () {
        return this.$store.getters.error;
      }
    },
    watch: {
      message (newMessage) {
        this.$store.commit('setLoading', false);
        if (newMessage.length === 0) {
          this.open = false;
          setTimeout(() => {
            this.text = '';
          }, 200);
        } else {
          this.$store.commit('setLoading', false);
          this.text = this.message;
          this.open = true;
        }
      }
    },
    methods: {
      close () {
        this.$store.commit('setError', '');
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
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: $default-text-color;
    transition: opacity 200ms;
    &[open] {
      opacity: 1;
      pointer-events: auto;
      .box {
        top: 5%;
      }
    }
    .box {
      position: absolute;
      top: -50%;
      left: 5%;
      width: 90%;
      height: 90%;
      background-color: $general-background;
      border: 1px solid $lighter-text-color;
      border-radius: 3px;
      transition: top 200ms;
      .header {
        position: absolute;
        top: 0;
        width: 100%;
        padding: 15px 0;
        text-align: center;
        font-size: 20px;
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
      .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        padding: 15px 0;
        .close {
          cursor: pointer;
          &:hover, &:active {
            color: $link-text-color;
          }
        }
      }
    }
  }
</style>
