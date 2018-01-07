<template>
  <div class="root">
    <transition name="transition" mode="out-in">
    <v-touch class="back-to-menu"
             tag="div"
             @tap="back"
             :disabled="disableBack"
             v-if="currentComponent !== 'game-menu'">Back</v-touch>
    </transition>
    <transition name="transition" mode="out-in">
      <component :is="currentComponent"
                 @disable-back-button="disableBackButton"
                 @redirect="redirectTo">
      </component>
    </transition>
    <error></error>
  </div>
</template>
<script>
  import Menu from './menu.vue';
  import Create from './create.vue';
  import Join from './join.vue';
  import Rules from './rules.vue';
  import About from './about.vue';
  import Room from './room.vue';
  import Error from './error.vue';
  import Spinner from './utils/spinner.vue';
  export default {
    data () {
      return {
        disableBack: false,
        history: []
      };
    },
    computed: {
      currentComponent () {
        return this.$store.getters.currentView;
      }
    },
    components: {
      'game-menu': Menu,
      Create,
      Join,
      Rules,
      About,
      Spinner,
      Room,
      Error
    },
    store: global.store,
    methods: {
      redirectTo (link) {
        if (link === 'game-menu') {
          this.history = [];
        } else {
          this.history.push(this.currentComponent);
        }
        this.$store.commit('setCurrentView', link);
      },
      back () {
        let link = this.history.pop();
        if (!link) link = 'game-menu';
        this.$store.commit('setCurrentView', link);
        this.$store.dispatch('killSocket');
      },
      disableBackButton (status) {
        this.disableBack = status;
      }
    },
    mounted () {
      this.$store.commit('setCurrentView', 'game-menu');
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
      &[disabled] {
        display: none;
      }
      &:hover, &:active {
        color: $link-text-color;
      }
    }
  }
  .transition-leave-active,
  .transition-enter-active {
    transition: opacity .1s;
  }

  .transition-leave-to,
  .transition-enter {
    opacity: 0;
  }
</style>
