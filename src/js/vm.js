import Root from '../vue/root.vue';
const Vm = {
  el: '#app-container',
  components: {
    Root
  },
  mounted () {
    this.$store.dispatch('restart').then(() => {
      this.$store.commit('setLoading', false);
    }, (err) => {
      if (err) console.error(err);
      this.$store.commit('setLoading', false);
    });
  }
};

module.exports = (store) => {
  Vm.store = store;
  return Vm;
};
