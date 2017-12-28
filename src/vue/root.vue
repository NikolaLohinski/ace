<template>
  <div class="root">
    <transition name="transition">
    <v-touch class="back-to-menu"
             tag="div"
             @tap="back"
             v-if="history.length > 0">Back</v-touch>
    </transition>
    <transition name="transition">
      <component :is="currentComponent"
                 @redirect="redirectTo">
      </component>
    </transition>
  </div>
</template>
<script>
  import Menu from './menu.vue';
  import Create from './create.vue';
  import Join from './join.vue';
  import Rules from './rules.vue';
  import About from './about.vue';
  import Room from './room.vue';
  import Spinner from './utils/spinner.vue';
  export default {
    data () {
      return {
        currentComponent: 'game-menu',
        history: []
      };
    },
    components: {
      'game-menu': Menu,
      Create,
      Join,
      Rules,
      About,
      Spinner,
      Room
    },
    store: global.store,
    methods: {
      redirectTo (link) {
        if (link === 'game-menu') {
          this.history = [];
        } else {
          this.history.push(this.currentComponent);
        }
        this.currentComponent = link;
      },
      back () {
        this.currentComponent = this.history.pop();
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
  .transition-leave-active {
    transition: opacity .1s;
  }
  .transition-enter-active {
    transition: opacity .1s ease .1s;
  }

  .transition-leave-to,
  .transition-enter {
    opacity: 0;
  }
</style>
