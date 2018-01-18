<template>
  <div class="game">
    <div class="center-logo">
    </div>
    <bets :bet="bet" :family="family"></bets>
  </div>
</template>

<script>
  import Bets from './bets.vue';
  export default {
    data () {
      return {
        family: 'h',
        bet: 130
      };
    },
    components: {
      Bets
    }
  };
</script>

<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import "../scss/general";
  .game {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $table-texture;
    background-size: cover;
    .center-logo {
      position: absolute;
      background: $center-logo;
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 200px;
      min-height: 200px;
      width: 25vw;
      height: 25vw;
      max-width: 300px;
      max-height: 300px;
    }
  }
</style>
