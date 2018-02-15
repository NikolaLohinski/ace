<template>
  <div class="play">
    <div class="center">
      <div class="bet">{{ bet }}</div>
      <div class="family" :family="family"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        family: null,
        bet: null
      };
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import "../scss/general";
  .play {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 200px;
      min-height: 200px;
      width: 25vw;
      height: 25vw;
      max-width: 300px;
      max-height: 300px;
      .bet {
        position: absolute;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15%;
        height: 15%;
        margin-top: -8px;
        display: inline-table;
      }
      .family {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15%;
        height: 15%;
        margin-top: 12px;
        &[family='s'] {
          background: $spades;
          background-size: 100% 100%
        }
        &[family='c'] {
          background: $clubs;
          background-size: 100% 100%
        }
        &[family='d'] {
          background: $diamonds;
          background-size: 100% 100%
        }
        &[family='h'] {
          background: $hearths;
          background-size: 100% 100%
        }
      }
    }
  }
</style>
