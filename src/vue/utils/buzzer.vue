<template>
  <div class="buzzer-container">
    <div class="buzzer-holder">
      <v-touch tag="div" class="buzzer cube-btn"
               @tap.prevent="$emit('hit')">
        <i class="fa fa-hand-rock-o"></i>
      </v-touch>
    </div>
  </div>
</template>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/colors';
  .buzzer-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $size-center-logo;
    height: $size-center-logo;
    display: table;
    pointer-events: none;
    .buzzer-holder {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      .buzzer {
        cursor: pointer;
        display: inline-block;
        width: $size-center-logo / 3.5;
        height: $size-center-logo / 3.5;
        line-height: $size-center-logo / 3.8;
        font-size: $size-center-logo / 5;
        border-radius: 50%;
        padding: 0;
        pointer-events: auto;
        color: $default-text-color;
        &:focus {
          outline: none;
        }
        &:active {
          box-shadow: inset 1px 1px 2px $default-text-color;
          border-color: $active-button-background-color;
          outline: none;
          color: white;
        }
        &:after {
          content: none;
          display: none;
        }
        > i.fa {
          margin-right: 0;
          transform: none;
        }
      }
    }
    &[disabled] {
      .buzzer {
        pointer-events: none;
        opacity: 0.3;
      }
    }
  }
</style>
