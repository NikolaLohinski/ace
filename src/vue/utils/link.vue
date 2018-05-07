<template>
  <v-touch :tag="tag" @tap.prevent="goTo"
           @pressup.prevent="goTo"
           link>
    <slot></slot>
  </v-touch>
</template>
<script>
  export default {
    methods: {
      goTo () {
        setTimeout(() => {
          if (this.append && this.to !== '-1') {
            this.$router.push(this.$route.fullPath + this.to);
          } else {
            (this.to === '-1') ? this.$router.go(-1) : this.$router.push(this.to);
          }
        }, 100);
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
      },
      append: {
        type: Boolean,
        default: false
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
    transition: opacity 200ms;
    &:active {
      color: $link-text-color;
    }
    &[disabled] {
      pointer-events: none;
      opacity: 0.3;
    }
  }
</style>