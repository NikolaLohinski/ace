<template>
  <v-touch tag="div" class="switch" @tap.prevent="check">
    <cube-switch v-model="internalCheck" :disabled="disabled">
      <slot></slot>
    </cube-switch>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        internalCheck: this.checked
      };
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      checked: Boolean
    },
    model: {
      prop: 'checked',
      event: 'change'
    },
    methods: {
      check () {
        this.internalCheck = !this.internalCheck;
        this.$emit('change', this.internalCheck);
      }
    }
  };
</script>

<style lang="sass" type="text/scss" rel="stylesheet/scss">
  @import '../../scss/colors';
  .switch {
    pointer-events: none;
    .cube-switch-ui {
      pointer-events: auto;
      cursor: pointer;
    }
  }
</style>