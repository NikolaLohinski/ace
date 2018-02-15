<template>
  <v-touch tag="div"
           class="card"
           @tap="$emit('tap', $event)">
    <div class="face"
           :hide="num === 'hide' || family === 'hide'"
           :style="style">
    </div>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        nums: {
          '7': 0,
          '8': -81,
          '9': -162,
          '10': -243,
          'j': -324,
          'q': -405,
          'k': -486,
          'a': -567,
          'hide': 0
        },
        families: {
          'd': 0,
          'c': -119,
          'h': -238,
          's': -357,
          'hide': -476
        }
      };
    },
    props: {
      card: {
        type: String,
        default: 'hide'
      }
    },
    computed: {
      xOffset () {
        return this.nums[this.num];
      },
      yOffset () {
        return this.families[this.family];
      },
      num () {
        return (this.card !== 'hide') ? this.card.split(',')[0] : 'hide';
      },
      family () {
        return (this.card !== 'hide') ? this.card.split(',')[1] : 'hide';
      },
      style () {
        return {
          backgroundPositionX: this.xOffset + 'px',
          backgroundPositionY: this.yOffset + 'px'
        };
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .card {
    border: 1px solid $default-text-color;
    border-radius: 4px;
    width: 78px;
    padding: 1px;
    height: 116px;
    overflow: hidden;
    display: inline-block;
    .face {
      width: 80px;
      height: 118px;
      position: relative;
      top: -1px;
      left: -1px;
      background: white $cards;
      &[hide] {
        background-color: black;
      }
    }
  }
</style>
