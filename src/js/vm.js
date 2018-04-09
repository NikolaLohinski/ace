import Root from '../vue/root.vue';
export default {
  el: '#app-container',
  components: {
    Root
  },
  store: global.store,
  mounted () {
    // to make vue-resource available in store directly
    this.$store.commit('setHttp', this.$http);
  }
};
