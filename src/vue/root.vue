<template>
  <div class="root">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    store: global.store
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/style';
  .root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: $general-background;
    background-size: cover;
    font-family: DefaultFont;
    color: $default-text-color;
  }
</style>
