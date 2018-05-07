<template>
  <div class="root">
    <transition :name="transitionName">
      <router-view class="view">
      </router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        axis: 'x',
        direction: 1
      };
    },
    computed: {
      transitionName () {
        return `${this.axis}-${this.direction > 0}`;
      }
    },
    store: global.store,
    watch: {
      '$route' (to, from) {
        this.$store.commit('path', this.$router.history.current.fullPath);
        this.axis = (to.meta['vertical'] || from.meta['vertical']) ? 'y' : 'x';
        const toDepth = (to.path === '/') ? 1 : to.path.split('/').length;
        const fromDepth = (from.path === '/') ? 1 : from.path.split('/').length;
        this.direction = (toDepth !== fromDepth) ? fromDepth - toDepth : this.direction * (-1);
      }
    },
    mounted () {
      if (this.$store.getters.path) this.$router.replace(this.$store.getters.path);
      localStorage['i18n'] ? this.$store.commit('language', localStorage['i18n']) : null;
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
  @import '../scss/main';
  .root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: $general-background;
    background-size: cover;
    font-family: DefaultFont;
    color: $default-text-color;
    .view {
      transition: all .3s cubic-bezier(.55,0,.1,1);
    }
    .x-false-enter,
    .x-true-leave-active {
      opacity: 0;
      transform: translate(100vw, 0);
    }
    .x-false-leave-active,
    .x-true-enter {
      opacity: 0;
      transform: translate(-100vw, 0);
    }
    .y-true-enter,
    .y-false-leave-active {
      opacity: 0;
      transform: translate(0, 100vh);
    }
    .y-true-leave-active,
    .y-false-enter {
      opacity: 0;
      transform: translate(0, -100vh);
    }
  }
</style>
