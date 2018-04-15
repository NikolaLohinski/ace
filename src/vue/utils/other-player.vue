<template>
  <div class="other-player" :position="position">
    <div class="status" :status="status"></div>
    <div class="name">{{ name }}</div>
    <div class="dealer-coin" v-if="dealer"></div>
  </div>
</template>
<script>
  export default {
    props: {
      name: {
        required: true,
        type: String
      },
      status: {
        required: true,
        type: Number
      },
      position: {
        required: true,
        type: Number,
        validator: (v) => v < 4 && v > 0
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  $player-name-font-size: 12px;
  .other-player {
    position: absolute;
    text-align: center;
    &[position='3'] {
      top: 50%;
      left: 10px;
      transform: translate(0, -50%);
    }
    &[position='2'] {
      top: 25px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    &[position='1'] {
      top: 50%;
      right: 10px;
      transform: translate(0, -50%);
      > .status {
        float: right;
      }
    }
    .status {
      width: 12px;
      height: 12px;
      line-height: $player-name-font-size;
      border-radius: 50%;
      transition: background-color 200ms;
      display: inline-block;
      margin: 0 5px;
      vertical-align: middle;
      float: left;
      box-shadow: $players-status-box-shadow;
      &[status='1'] {
        background-color: $active-player-color;
      }
      &[status='0'] {
        background-color: $inactive-player-color;
      }
      &[status='-1'] {
        background-color: $afk-player-color;
      }
    }
    .name {
      font-size: $player-name-font-size;
      line-height: $player-name-font-size;
      float: left;
      color: $lighter-text-color;
      display: inline-block;
    }
  }
</style>
