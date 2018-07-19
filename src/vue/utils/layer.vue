<template>
  <div class="layer" :style="style">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      zIndex: {
        type: Number,
        default: -1
      }
    },
    computed: {
      style () {
        return {
          zIndex: this.zIndex
        };
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  .layer {
    pointer-events: none;
    > * {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
