<template>
  <v-touch :tag="tag" @tap.prevent="goTo" link>
    <slot></slot>
  </v-touch>
</template>
<script>
  export default {
    methods: {
      goTo () {
        setTimeout(() => (this.to === '-1') ? this.$router.go(-1) : this.$router.push(this.to), 100);
      }
    },
    props: {
      tag: {
        type: String,
        default: 'a'
      },
      to: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  [link] {
    min-width: 50px;
    text-align: center;
    cursor: pointer;
    &:active {
      color: $link-text-color !important;
    }
  }
</style>