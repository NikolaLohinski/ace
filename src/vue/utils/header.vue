<template>
  <header>
    <vue-simple-markdown class="title" :source="title">
    </vue-simple-markdown>
    <v-link tag="span" to="-1" class="nav-btn back" v-if="back">
      <i class="fa fa-arrow-left"></i>
    </v-link>
    <v-link tag="span" to="-1" class="nav-btn close" v-if="close">
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
    props: {
      title: {
        type: String,
        required: true
      }
    },
    components: {
      vLink
    },
    mounted () {
      this.back = !this.$route.meta['vertical'];
      this.close = !this.back;
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  header {
    position: relative;
    height: 50px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.51);
    background-color: $notification-background;
    color: $notification-text-color;
    padding: 15px 15px 0 15px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    .title {
      display: inline-block;
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
