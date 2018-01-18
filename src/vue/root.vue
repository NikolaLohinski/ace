<template>
  <div class="root">
    <transition name="transition" mode="out-in">
      <component :is="currentComponent"
                 @back="back"
                 @redirect="redirectTo">
      </component>
    </transition>
    <error></error>
    <devtools></devtools>
    <spinner :loading="loading" text="loading"></spinner>
  </div>
</template>
<script>
  import Home from './home.vue';
  import Create from './create.vue';
  import Join from './join.vue';
  import Room from './room.vue';
  import Game from './game.vue';
  import Error from './error.vue';
  import Spinner from './spinner.vue';
  import Devtools from './devtools.vue';
  export default {
    data () {
      return {
        history: []
      };
    },
    computed: {
      currentComponent () {
        return this.$store.getters.currentView;
      },
      loading () {
        return this.$store.getters.loading;
      }
    },
    components: {
      Home,
      Create,
      Join,
      Spinner,
      Room,
      Game,
      Error,
      Devtools
    },
    store: global.store,
    methods: {
      redirectTo (link) {
        if (link === 'home') {
          this.history = [];
        } else {
          this.history.push(this.currentComponent);
        }
        this.$store.commit('setCurrentView', link);
      },
      back () {
        let link = this.history.pop();
        if (!link) link = 'home';
        this.$store.commit('setCurrentView', link);
        this.$store.dispatch('quit');
      }
    },
    mounted () {
      this.$store.dispatch('loadSettings');
      this.$store.commit('setCurrentView', 'home');
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
