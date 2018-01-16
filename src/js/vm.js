import Root from '../vue/root.vue';
const Vm = {
  el: '#app-container',
  components: {
    Root
  },
  mounted () {
    // to make vue-resource available in store directly
    this.$store.commit('setHttp', this.$http);
    this.$store.dispatch('restart').then(() => {
      this.$store.commit('setLoading', false);
    }, () => {
      // if restart failed, check connection in case
      this.$store.dispatch('testConnection');
    });
  }
};

module.exports = (store) => {
  Vm.store = store;
  return Vm;
};
