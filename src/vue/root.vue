<template>
  <div class="root" id="root-identifier">
    <transition name="transition" mode="out-in">
      <component :is="view"
                 @back="back"
                 @redirect="redirect">
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
      view () {
        return this.$store.getters.view;
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
      redirect (link) {
        if (link === 'home') {
          this.history = [];
        } else {
          this.history.push(this.view);
        }
        this.$store.commit('setView', link);
      },
      back () {
        let link = this.history.pop();
        if (!link) link = 'home';
        this.$store.commit('setView', link);
      }
    },
    mounted () {
      this.$store.dispatch('loadSettings').then(() => {
        this.$store.dispatch('loadSession').then(() => {
          this.$store.commit('setLoading', false);
        });
      });
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
    background: $table-texture;
    background-size: cover;
    font-family: DefaultFont;
    color: $default-text-color;
    &[vibrate] {
        animation-name: shake;
        animation-duration: 1s;
        transform-origin:50% 50%;
        animation-timing-function: linear;
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
  @keyframes shake {
    0% { -webkit-transform: translate(2px, 1px) rotate(0deg); }
    10% { -webkit-transform: translate(-1px, -2px) rotate(-1deg); }
    20% { -webkit-transform: translate(-3px, 0px) rotate(1deg); }
    30% { -webkit-transform: translate(0px, 2px) rotate(0deg); }
    40% { -webkit-transform: translate(1px, -1px) rotate(1deg); }
    50% { -webkit-transform: translate(-1px, 2px) rotate(-1deg); }
    60% { -webkit-transform: translate(-3px, 1px) rotate(0deg); }
    70% { -webkit-transform: translate(2px, 1px) rotate(-1deg); }
    80% { -webkit-transform: translate(-1px, -1px) rotate(1deg); }
    90% { -webkit-transform: translate(2px, 2px) rotate(0deg); }
    100% { -webkit-transform: translate(1px, -2px) rotate(-1deg); }
  }
</style>
