<template>
  <transition name="component-fade" mode="out-in">
  <div class="container" v-if="loading" :block="block" :cover="cover">
    <div class=loader>
      <div class=spinner></div>
      <span class=text>{{ $t(text) }}</span>
    </div>
  </div>
  </transition>
</template>
<script>
  export default {
    data () {
      return {};
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: ''
      },
      cover: {
        type: Boolean,
        default: true
      },
      block: {
        type: Boolean,
        default: true
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
@import '../scss/general';
.container {
    overflow: hidden;
    position: fixed;
    z-index: 990;
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
      }
      > .spinner {
        display: block;
        margin: 10px auto;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: 0 0;
        border: 4px solid #ddd;
        border-bottom-color: #777;
        animation: loading 1.2s infinite linear
      }
    }
  }
  @keyframes loading {
    to {
      transform: rotate(360deg)
    }
  }
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity .2s ease;
  }
  .component-fade-enter,
  .component-fade-leave-to {
    opacity: 0;
  }
</style>
