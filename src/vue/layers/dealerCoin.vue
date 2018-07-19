<template>
  <div class="dealer-coin">
    <div id="coin" :position="position"></div>
  </div>
</template>
<script>
  export default {
    computed: {
      position () {
        const dealer = this.$store.getters.game.getDealer();
        return this.$store.getters.players[dealer].getPosition();
      }
    },
    store: global.store
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/sizes';
  .dealer-coin {
    pointer-events: none;
    #coin {
      background: $dealer-coin center;
      background-size: cover;
      width: $dealer-coin-size;
      height: $dealer-coin-size;
      position: absolute;
      text-align: center;
      margin: 0;
      pointer-events: auto;
      &[position='-1'] {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &[position='0'] {
        left: 50%;
        top: 100%;
        transform: translate(-50%, -50%);
        margin-left: -100px;
        margin-top: -100px;
        @include answer-to-height ('s') {
          margin-top: -50px;
        }
        @include answer-to-height ('l') {
          margin-top: -20vh;
        }
      }
      &[position='3'] {
        top: 50%;
        left: 10px;
        transform: translate(0, -50%);
        margin-top: -50px;
      }
      &[position='2'] {
        top: 25px;
        left: 50%;
        transform: translate(-50%, 0);
        margin-top: 30px;
        margin-left: -70px;
      }
      &[position='1'] {
        top: 50%;
        left: 100%;
        transform: translate(-100%, -50%);
        margin-top: -50px;
        margin-left: -30px;
      }
    }
  }
</style>
