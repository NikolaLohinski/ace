<template>
  <header>
    <div class="title">
      <slot></slot>
    </div>
    <v-link tag="span" :to="backTo" class="nav-btn back" v-if="back">
      <i class="fa fa-arrow-left"></i>
    </v-link>
    <v-link tag="span" :to="backTo" class="nav-btn close" v-if="close">
      <i class="fa fa-times"></i>
    </v-link>
  </header>
</template>
<script>
  import vLink from './link.vue';
  export default {
    data () {
      return {
        back: false,
        close: false
      };
    },
    store: global.store,
    components: {
      vLink
    },
    props: {
      backTo: {
        type: String,
        default: '-1'
      }
    },
    mounted () {
      this.back = !this.$route.meta['vertical'];
      this.close = !this.back;
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  header {
    position: relative;
    height: $header-height;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.51);
    background-color: $notification-background;
    color: $notification-text-color;
    padding: 5px 15px 0 15px;
    line-height: $header-height;
    text-align: center;
    font-size: 20px;
    z-index: 10;
    .title {
      display: inline-block;
      .fa {
        margin-right: 10px;
      }
    }
    .nav-btn {
      position: absolute;
      &.back {
        left: 0;
      }
      &.close {
        right: 0;
      }
    }
  }

</style>
