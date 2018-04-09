<template>
  <div class="root">
    <home></home>
  </div>
</template>
<script>
  import Home from './home.vue';
  export default {
    components: {
      Home
    },
    store: global.store
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
  }
</style>
