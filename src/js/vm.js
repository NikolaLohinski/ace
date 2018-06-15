import Root from '../vue/root.vue';
export default {
  computed: {
    loading () {
      return this.$store.getters.loading;
    }
  },
  store: global.store,
  el: '#app-container',
  components: {
    Root
  },
  mounted () {
    this.$store.commit('loading', false);
  }
};
