import Root from '../vue/root.vue';
const Vm = {
  el: '#app-container',
  components: {
    Root
  },
  mounted () {
    this.$http.get('/not-cached', {
      timeout: 3000
    }).then(() => {
      this.$store.dispatch('restart').then(() => {
        this.$store.commit('setLoading', false);
      }, (err) => {
        if (err) console.error(err);
        this.$store.commit('setLoading', false);
      });
    }, (err) => {
      this.$store.commit('setError', 'serverUnreachable');
      this.$store.commit('setLoading', false);
      console.error(err);
    });
  }
};

module.exports = (store) => {
  Vm.store = store;
  return Vm;
};
