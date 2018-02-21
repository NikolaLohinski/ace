import Root from '../vue/root.vue';
const Vm = {
  el: '#app-container',
  components: {
    Root
  },
  mounted () {
    // to make vue-resource available in store directly
    this.$store.commit('setHttp', this.$http);
  }
};

module.exports = (store) => {
  Vm.store = store;
  return Vm;
};
