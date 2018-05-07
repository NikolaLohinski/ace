<template>
  <div class="dealer-coin" :position="position">
  </div>
</template>
<script>
  export default {
    props: {
      position: {
        type: Number,
        required: true,
        validator: (v) => v < 4 && v >= -1
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/sizes';
  .dealer-coin {
    background: $dealer-coin center;
    background-size: cover;
    width: 60px;
    height: 60px;
    position: absolute;
    text-align: center;
    margin: 0;
    left: 50%;
    top: 50%;
    transform: translate(0, 0);
    transition: all 1s ease;
    z-index: 1;
    &[position='-1'] {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &[position='0'] {
      left: 50%;
      top: 100%;
      transform: translate(-50%, -100%);
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
      margin-top: 50px;
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
</style>
