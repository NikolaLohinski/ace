<template>
  <div class="root">
    <transition name="component-fade" mode="out-in">
    <v-touch class="back-to-menu"
             tag="div"
             @tap="backToMenu"
             v-if="currentComponent != 'game-menu'">Back</v-touch>
    </transition>
    <transition name="component-slide" mode="out-in">
      <component :is="currentComponent" @redirect="redirectTo"></component>
    </transition>
    <spinner></spinner>
  </div>
</template>
<script>
  import Menu from './menu.vue';
  import Create from './create.vue';
  import Join from './join.vue';
  import Rules from './rules.vue';
  import About from './about.vue';
  import Spinner from './utils/spinner.vue';
  export default {
    data () {
      return {
        currentComponent: 'game-menu'
      };
    },
    components: {
      'game-menu': Menu,
      Create,
      Join,
      Rules,
      About,
      Spinner
    },
    store: global.store,
    methods: {
      redirectTo (link) {
        this.currentComponent = link;
      },
      backToMenu () {
        this.currentComponent = 'game-menu';
        this.$store.commit('killSocket');
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: $general-background;
    font-family: DefaultFont;
    color: $default-text-color;
    .back-to-menu {
      position: absolute;
      bottom: 15px;
      left: 15px;
      cursor: pointer;
      z-index: 99;
      &:hover, &:active {
        color: $link-text-color;
      }
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
  .component-slide-enter-active,
  .component-slide-leave-active {
    transition: transform .2s ease;
  }
  .component-slide-enter {
    transform: translateX(-100vw);
  }

  .component-slide-leave-to {
    transform: translateX(100vw);
  }
</style>
